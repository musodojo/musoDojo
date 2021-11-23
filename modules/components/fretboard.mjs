import { Container } from "./container.mjs";
import { FretboardArea } from "./fretboardArea.mjs";
import { FretboardNote } from "./fretboardNote.mjs";
import { AudioInterface } from "./audioInterface.mjs";

class Fretboard extends Container {
  constructor(props = {}) {
    try {
      // set up this.render and this.container
      super();

      // properties are defined here
      this.props = {
        // don't include the implied "px" units in width or height
        width: 750,
        height: 250,

        // used to tell AudioInterface.startNote which type of sound to play
        instrument: "Guitar",

        // standard guitar tuning: [E=40,A=45,D=50,G=55,B=59,E=64]
        tuning: [40, 45, 50, 55, 59, 64],

        // these available settings are not set here, but can be passed in via props
        // rootNote: 0, // would be "C / C♮ / D♭♭ / B♯"
        // sequence: [0, 2, 4, 5, 7, 9, 11] // would be "Ionian / Major"
        // sequence: [0] // would be just the root note

        fromFret: 0,
        toFret: 21,

        // mode = "Play" || "Edit One" || "Edit All"
        mode: "Play",

        // this value is used as hand.toLowerCase() in position calculations
        // the capitalized "R" in "Right" comes from the menu settings using capital letters
        // and for consistency with data/instrumentConfigs.mjs
        hand: "Right",

        // default to no labels displayed inside the notes
        noteLabels: ["", "", "", "", "", "", "", "", "", "", "", ""],

        // default to no note colors definition, which then uses the colorTheme.foreground
        noteColors: ["", "", "", "", "", "", "", "", "", "", "", ""],

        // notes can be sized with first or second size value (or removed) by using
        // props.mode's Edit One" and "Edit All" functionality
        noteSizes: { first: "91%", second: "55%" },

        // noteDuration = -1 means play full note duration
        // noteDuration = 0 means play note until up event occurs
        // noteDuration = x means play note for x seconds (clipped at note's duration in audio sprite)
        noteDuration: 0,

        // default to a dark theme
        colorTheme: {
          background: "#000000",
          midground: "#999999",
          foreground: "#FFFFFF",
        },

        // standard settings for guitar
        showStrings: true,
        showFrets: true,
        fretMarkers: [3, 5, 7, 9, 12, 15, 17, 19, 21, 24],
        showFretNumbers: true,
        showFretboardMarkers: true,

        // then overwrite with any of the passed props
        ...props,
      };

      // something for
      this.container.style.position = "relative";

      this.resetLook();

      this.state = {};
      this.resetState();

      this.renderFretboard();
      if (this.props.sequence) this.renderSequence();
    } catch (err) {
      console.error(err);
      this.container.innerHTML = "";
      this.render(this.getErrorContainer(err));
    }
  }

  // ERROR HANDLERS

  // return a div with an error message inside
  getErrorContainer(err) {
    const ERROR_HTML = document.createElement("div");
    ERROR_HTML.style.textAlign = "center";
    ERROR_HTML.style.fontSize = "1.2em";
    ERROR_HTML.innerHTML = `<h2>Error Building Fretboard</h2><br/><h3>${err}</h3>`;
    return ERROR_HTML;
  }

  // UPDATERS

  // reset colors and sizes and check some property values
  resetLook() {
    this.resetColors();

    this.resetSize();

    // sets how much space is fretboard and how much is fret numbers
    this.props.mainScale = this.props.showFretNumbers ? 0.95 : 1;

    // this makes sure fromFret isn't bigger than toFret
    this.checkFretNum(this.props.fromFret);

    this.checkHand();
  }

  resetColors() {
    this.container.style.backgroundColor = this.props.colorTheme.background;
    this.container.style.color = this.props.colorTheme.foreground;
  }

  // width and heigth are numbers in px (with no units)
  resetSize(width = this.props.width, height = this.props.height) {
    this.props.width = width;
    this.container.style.width = width + "px";
    this.props.height = height;
    this.container.style.height = height + "px";
  }

  // reset the state object
  resetState() {
    this.state.pointerDownIds = [];
    this.state.areas = {};
    this.state.notes = {};
    this.state.audioBuffers = {};
  }

  // GETTERS OF INFORMATION

  // returns one fret more than what is displayed on the fretboard
  // so the nut is spaced nicely from the edge when drawing frets, etc.
  // in calculations, this gets you to the end of the fretboard, past fret #0, to fret #-1
  getFretsToCalculate() {
    return this.props.toFret - this.props.fromFret + 1;
  }

  // returns the MIDI number of a note on a given string and fret
  getMidiFromStringFret(stringNum, fretNum) {
    return this.props.tuning[this.props.tuning.length - stringNum] + fretNum;
  }

  // returns a number representing the width in px between (fretNum-1) and (fretNum)
  // fret numbers are labelled to the right of the fret area to be
  // pressed by finger (on a right handed instrument)
  // units are not included in returned number
  // getFretsToCalculate() is like fret #-1
  // e.g. fromFret = 0; toFret = 12; fretNum = 0
  // calculations are actually done from the bridge end, fret #0 is
  // calculated using fret #12
  // 12+1=13 (fret #-1) is getFretsToCalculate
  // so get the difference between 13 frets from end (fret #-1)
  // and 12 frets from the end (fret#0)
  // which is correct for fret #0's fret area (finger area)
  getFretAreaWidth(fretNum) {
    return (
      ((Math.pow(
        2,
        (this.getFretsToCalculate() + this.props.fromFret - fretNum) / 12
      ) -
        Math.pow(
          2,
          (this.getFretsToCalculate() + this.props.fromFret - fretNum - 1) / 12
        )) /
        (Math.pow(2, this.getFretsToCalculate() / 12) - 1)) *
      this.props.width
    );
  }

  // returns a number representing the width in px between the bridge end
  // and fret #fretNum
  getFretDistance(fretNum) {
    return (
      ((Math.pow(
        2,
        (this.getFretsToCalculate() - 1 + this.props.fromFret - fretNum) / 12
      ) -
        1) /
        (Math.pow(2, this.getFretsToCalculate() / 12) - 1)) *
      this.props.width
    );
  }

  // SETTINGS CHECKING

  // stringNum should be greater than 1
  // and less than the length of the tuning definition array
  checkStringNum(stringNum) {
    if (stringNum < 1 || stringNum > this.props.tuning.length) {
      throw new Error(
        `Fretboard checkStringNum(stringNum): stringNum=${stringNum} is out of range (1 - ${this.props.tuning.length})`
      );
    }
  }

  // fretNum should not be less than Fretboard's fromFret
  // or greater than toFret
  checkFretNum(fretNum) {
    if (fretNum < this.props.fromFret || fretNum > this.props.toFret) {
      throw new Error(
        `Fretboard checkFretNum(fretNum): fretNum=${fretNum} is out of range (${this.props.fromFret} to ${this.props.toFret})`
      );
    }
  }

  // make sure hand is either "Left" or "Right"
  // the capital first letter is used in instrumentConfigs.mjs
  // and FretboardMenu.mjs
  checkHand() {
    if (
      !(
        this.props.hand.toLowerCase() === "left" ||
        this.props.hand.toLowerCase() === "right"
      )
    ) {
      throw new Error(
        `Fretboard hand=${this.props.hand} should be Left or Right`
      );
    }
  }

  // RENDERERS

  renderFretboard() {
    try {
      if (this.props.showFrets) {
        this.renderFrets();
      }
      if (this.props.showFretboardMarkers) {
        this.renderFretboardMarkers();
      }
      if (this.props.showStrings) {
        this.renderStrings();
      }
      if (this.props.showFretNumbers) {
        this.renderFretNumbers();
      }
      this.renderStringFretAreas();
    } catch (err) {
      throw err;
    }
  }

  // resets the fretboard and redraws sequence if available
  reset() {
    this.container.innerHTML = "";
    this.resetState();
    this.renderFretboard();
    if (this.props.sequence) this.renderSequence();
  }

  // resets the fretboard and keeps all notes as they were
  // including edited notes, unless resetNoteSize is true
  update(resetNoteSize = false) {
    this.container.innerHTML = "";
    this.state.pointerDownIds = [];
    this.state.areas = {};
    const NOTES_COPY = { ...this.state.notes };
    this.state.notes = {};
    this.state.audioBuffers = {};
    this.renderFretboard();
    Object.entries(NOTES_COPY).forEach(([string_fret, note]) => {
      const SPLIT = string_fret.split("_");
      this.renderNote(
        parseInt(SPLIT[0]),
        parseInt(SPLIT[1]),
        resetNoteSize ? this.props.noteSizes.first : note.size
      );
    });
  }

  renderFrets() {
    for (let i = this.props.fromFret; i <= this.props.toFret; i++) {
      this.render(this.getFret(i));
    }
  }

  getFret(fretNum) {
    const FRET = document.createElement("div");
    FRET.style.backgroundColor = this.props.colorTheme.foreground;
    FRET.style.position = "absolute";
    FRET.style.top = 0;
    // fret width is done by eye
    let fretWidth = this.props.width / 500 < 1 ? 1 : this.props.width / 500;
    FRET.style.width = fretWidth + "px";
    FRET.style.height = this.props.height * this.props.mainScale + "px";
    FRET.style[this.props.hand.toLowerCase()] =
      this.getFretDistance(fretNum) + "px";
    return FRET;
  }

  renderFretNumbers() {
    for (let i = this.props.fromFret; i <= this.props.toFret; i++) {
      this.render(this.getFretNumberArea(i).container);
    }
  }

  getFretNumberArea(fretNum, onlyLabelDefinedMarkers = true) {
    const FRET_NUMBER_AREA = new FretboardArea(
      this.getFretAreaWidth(fretNum) + "px",
      this.props.height * (1 - this.props.mainScale) + "px"
    );
    FRET_NUMBER_AREA.container.style.top =
      this.props.height * this.props.mainScale + "px";
    FRET_NUMBER_AREA.container.style[this.props.hand.toLowerCase()] =
      this.getFretDistance(fretNum) + "px";

    if (
      onlyLabelDefinedMarkers &&
      !this.props.fretMarkers.includes(fretNum) &&
      fretNum !== 0
    ) {
      return FRET_NUMBER_AREA;
    }

    const FRET_NUMBER_LABEL = document.createElement("div");
    FRET_NUMBER_LABEL.style.fontSize = this.props.height / 23 + "px";
    FRET_NUMBER_LABEL.innerText = fretNum;
    FRET_NUMBER_AREA.render(FRET_NUMBER_LABEL);
    return FRET_NUMBER_AREA;
  }

  renderFretboardMarkers(fretMarkers = this.props.fretMarkers) {
    for (let i = this.props.fromFret; i <= this.props.toFret; i++) {
      if (fretMarkers.includes(i)) {
        const FRETBOARD_AREA = new FretboardArea(
          this.getFretAreaWidth(i) + "px",
          this.props.height * this.props.mainScale + "px"
        );
        FRETBOARD_AREA.container.style.top = 0;
        FRETBOARD_AREA.container.style[this.props.hand.toLowerCase()] =
          this.getFretDistance(i) + "px";
        this.render(FRETBOARD_AREA.container);
        const FRET_MARKER = document.createElement("div");
        FRET_MARKER.style.width = "60%";
        FRET_MARKER.style.height = "65%";
        FRET_MARKER.style.backgroundColor = this.props.colorTheme.midground;
        switch (this.props.hand.toLowerCase()) {
          case "right":
            FRET_MARKER.style.clipPath = `polygon(0 0, 100% 6%, 100% 94%, 0 100%)`;
            break;
          case "left":
            FRET_MARKER.style.clipPath = `polygon(100% 0, 0 6%, 0 94%, 100% 100%)`;
            break;
        }
        FRETBOARD_AREA.render(FRET_MARKER);
      }
    }
  }

  // string numbers start counting from 1
  renderStrings() {
    for (let i = 1; i <= this.props.tuning.length; i++) {
      this.render(this.getString(i));
    }
  }

  // returns a div styled as a string in the correct position on fretboard
  // string numbers start counting from 1
  getString(stringNum) {
    const STRING = document.createElement("div");
    STRING.style.backgroundColor = this.props.colorTheme.foreground;
    STRING.style.position = "absolute";
    STRING.style.width = "100%";
    STRING.style.top =
      ((stringNum - 0.5) / this.props.tuning.length) *
        this.props.height *
        this.props.mainScale +
      "px";
    STRING.style.height = this.props.height / 200 + "px";
    return STRING;
  }

  // fill the Fretboard.container with interactive FretboardArea.container divs
  renderStringFretAreas() {
    for (let i = this.props.fromFret; i <= this.props.toFret; i++) {
      for (let j = 1; j <= this.props.tuning.length; j++) {
        this.render(this.getStringFretArea(j, i).container);
      }
    }
  }

  // returns an interactive FretboardArea for a string/fret area on the fretboard
  // FretboardArea inherits Container, which means it's div container can be accessed
  // via FretboardArea.container
  // string numbers start counting from 1
  getStringFretArea(stringNum, fretNum) {
    try {
      this.checkStringNum(stringNum);
      this.checkFretNum(fretNum);
      const FRETBOARD_AREA = new FretboardArea(
        this.getFretAreaWidth(fretNum) + "px",
        (this.props.height / this.props.tuning.length) * this.props.mainScale +
          "px"
      );
      this.state.areas[`${stringNum}_${fretNum}`] = FRETBOARD_AREA;

      // reverse the order of the string numbers because the string tunings
      // are passed in lowest=1 to highest, but strings are traditionally
      // labelled with highest=1
      FRETBOARD_AREA.container.style.top =
        ((stringNum - 1) / this.props.tuning.length) *
          this.props.height *
          this.props.mainScale +
        "px";
      FRETBOARD_AREA.container.style[this.props.hand.toLowerCase()] =
        this.getFretDistance(fretNum) + "px";
      FRETBOARD_AREA.container.style.cursor = "pointer";

      FRETBOARD_AREA.container.addEventListener(
        "pointerdown",
        (event) => {
          try {
            this.state.pointerDownIds.push(event.pointerId);
            event.target.releasePointerCapture(event.pointerId);
            if (this.state.notes[`${stringNum}_${fretNum}`])
              this.playNote(stringNum, fretNum);
            if (this.props.mode === "Edit One")
              this.toggleNote(stringNum, fretNum);
            else if (this.props.mode === "Edit All")
              this.togglePitchClass(stringNum, fretNum);
          } catch (err) {
            console.error(err);
          }
        },
        true
      );

      FRETBOARD_AREA.container.addEventListener(
        "pointerover",
        (event) => {
          try {
            if (this.state.pointerDownIds.includes(event.pointerId)) {
              if (this.state.notes[`${stringNum}_${fretNum}`])
                this.playNote(stringNum, fretNum);
              if (this.props.mode === "Edit One")
                this.toggleNote(stringNum, fretNum);
              else if (this.props.mode === "Edit All")
                this.togglePitchClass(stringNum, fretNum);
            }
          } catch (err) {
            console.error(err);
          }
        },
        true
      );

      FRETBOARD_AREA.container.addEventListener(
        "pointerup",
        (event) => {
          try {
            // pointer id will already be removed by the FreboardMultitool
            // if the Fretboard is inside a FreboardMultitool
            const INDEX = this.state.pointerDownIds.indexOf(event.pointerId);
            if (INDEX >= 0) {
              this.state.pointerDownIds.splice(INDEX, 1);
            }
          } catch (err) {
            console.error(err);
          }
        },
        true
      );

      // if the note duration is 0 (i.e. play for touched duration)
      // we need to handle up and leave events separately
      if (this.props.noteDuration === 0) {
        FRETBOARD_AREA.container.addEventListener(
          "pointerup",
          () => {
            try {
              if (this.state.audioBuffers[`${stringNum}_${fretNum}`]) {
                AudioInterface.stopNote(
                  this.state.audioBuffers[`${stringNum}_${fretNum}`]
                );
                this.state.areas[`${stringNum}_${fretNum}`].backgroundDivColor =
                  "transparent";
                delete this.state.audioBuffers[`${stringNum}_${fretNum}`];
              }
            } catch (err) {
              console.error(err);
            }
          },
          true
        );
        FRETBOARD_AREA.container.addEventListener(
          "pointerleave",
          () => {
            try {
              if (this.state.audioBuffers[`${stringNum}_${fretNum}`]) {
                AudioInterface.stopNote(
                  this.state.audioBuffers[`${stringNum}_${fretNum}`]
                );
                this.state.areas[`${stringNum}_${fretNum}`].backgroundDivColor =
                  "transparent";
                delete this.state.audioBuffers[`${stringNum}_${fretNum}`];
              }
            } catch (err) {
              console.error(err);
            }
          },
          true
        );
      }

      return FRETBOARD_AREA;
    } catch (err) {
      console.error(err);
    }
  }

  playNote(stringNum, fretNum, duration = this.props.noteDuration) {
    // duration = -1 means play full note duration in audio sprite
    // duration = 0 means play note until up event occurs (event handled externally)
    // duration = x means play note for x seconds (max = note's duration in audio sprite)
    try {
      // clear the previous timeout if the note is currently active
      if (this.state.audioBuffers[`${stringNum}_${fretNum}`]) {
        clearTimeout(
          this.state.audioBuffers[`${stringNum}_${fretNum}`].timeout
        );
      }
      // stores an object {buffer, gain, noteDuration} in audioBuffers object
      // the noteDuration can be updated by AudioInterface.startNote
      // if noteDuration = 0
      // OR if noteDuration > sprite note's full duration
      // future looping functionality in AudioInterface class might change this
      this.state.audioBuffers[`${stringNum}_${fretNum}`] =
        AudioInterface.startNote(
          this.props.instrument,
          this.getMidiFromStringFret(stringNum, fretNum),
          duration
        );

      this.state.areas[`${stringNum}_${fretNum}`].backgroundDivColor =
        this.props.colorTheme.foreground;

      // the === 0 case is handled by event listeners in the FretboardArea
      // adds the timeout property to the audioBuffer definition in audioBuffers
      if (duration !== 0) {
        this.state.audioBuffers[`${stringNum}_${fretNum}`].timeout = setTimeout(
          () => {
            this.state.areas[`${stringNum}_${fretNum}`].backgroundDivColor =
              "transparent";
            delete this.state.audioBuffers[`${stringNum}_${fretNum}`];
          },
          this.state.audioBuffers[`${stringNum}_${fretNum}`].duration * 1000
        );
      }
    } catch (err) {
      throw err;
    }
  }

  toggleNote(stringNum, fretNum) {
    try {
      const NOTE = this.state.notes[`${stringNum}_${fretNum}`];
      if (!NOTE) {
        this.playNote(stringNum, fretNum);
        this.renderNote(stringNum, fretNum, this.props.noteSizes.first);
      } else {
        const SIZE = NOTE.size;
        switch (SIZE) {
          case this.props.noteSizes.first:
            this.renderNote(stringNum, fretNum, this.props.noteSizes.second);
            break;
          case this.props.noteSizes.second:
            this.removeNote(stringNum, fretNum);
            break;
          default:
            throw new Error(
              `Fretboard toggleOneNote(stringNum, fretNum): size=${SIZE} should match Fretboard props.noteSizes.first=${this.props.noteSizes.first} || props.noteSizes.second=${this.props.noteSizes.second}`
            );
        }
      }
    } catch (err) {
      throw err;
    }
  }

  togglePitchClass(stringNum, fretNum) {
    try {
      const NOTE = this.state.notes[`${stringNum}_${fretNum}`];
      const SELECTED_PITCH_CLASS =
        this.getMidiFromStringFret(stringNum, fretNum) % 12;
      let currentPitchClass, currentNote;
      // grab value of note width because it will change later
      if (NOTE) {
        var SIZE = NOTE.size;
      } else {
        // if there's no note, play it because the sound won't trigger
        this.playNote(stringNum, fretNum);
      }
      for (let i = this.props.fromFret; i <= this.props.toFret; i++) {
        for (let j = 1; j <= this.props.tuning.length; j++) {
          currentPitchClass = this.getMidiFromStringFret(j, i) % 12;
          if (currentPitchClass === SELECTED_PITCH_CLASS) {
            currentNote = this.state.notes[`${j}_${i}`];
            if (!NOTE) {
              this.renderNote(j, i, this.props.noteSizes.first);
            } else {
              switch (SIZE) {
                case this.props.noteSizes.first:
                  this.renderNote(j, i, this.props.noteSizes.second);
                  break;
                case this.props.noteSizes.second:
                  this.removeNote(j, i);
                  break;
                default:
                  throw new Error(
                    `Fretboard togglePitchClass(stringNum, fretNum): size=${SIZE} should match Fretboard props.noteSizes.first=${this.props.noteSizes.first} || props.noteSizes.second=${this.props.noteSizes.second}`
                  );
              }
            }
          }
        }
      }
    } catch (err) {
      throw err;
    }
  }

  removeNote(stringNum, fretNum) {
    const NOTE = this.state.notes[`${stringNum}_${fretNum}`];
    if (NOTE) {
      NOTE.container.remove();
      delete this.state.notes[`${stringNum}_${fretNum}`];
    }
  }

  // string numbers start counting from 1
  renderNote(stringNum, fretNum, size = this.props.noteSizes.first) {
    try {
      this.checkStringNum(stringNum);
      this.checkFretNum(fretNum);
      let note = this.state.notes[`${stringNum}_${fretNum}`];
      const MIDI = this.getMidiFromStringFret(stringNum, fretNum);
      const COLOR = this.props.noteColors[MIDI % 12]
        ? this.props.noteColors[MIDI % 12]
        : this.props.colorTheme.foreground;
      let label;
      switch (this.props.noteLabels[0]) {
        case "C":
          label = this.props.noteLabels[MIDI % 12];
          break;
        case "<%MIDI%>":
          label = MIDI;
          break;
        default:
          label = this.props.noteLabels[(MIDI - this.props.rootNote) % 12];
          break;
      }
      if (!note) {
        const PARENT_WIDTH =
          this.state.areas[`${stringNum}_${fretNum}`].container.style.width;
        const PARENT_HEIGHT =
          this.state.areas[`${stringNum}_${fretNum}`].container.style.height;
        note = new FretboardNote(
          size,
          PARENT_WIDTH,
          PARENT_HEIGHT,
          this.props.colorTheme,
          COLOR,
          label
        );
        this.state.areas[`${stringNum}_${fretNum}`].render(note.container);
        this.state.notes[`${stringNum}_${fretNum}`] = note;
      } else {
        note.size = size;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // string num (j) starts at 1 in this function
  renderSequence(
    rootNote = this.props.rootNote,
    sequence = this.props.sequence,
    size = this.props.noteSizes.first
  ) {
    try {
      for (let i = this.props.fromFret; i <= this.props.toFret; i++) {
        for (let j = 1; j <= this.props.tuning.length; j++) {
          const INTERVAL = (this.getMidiFromStringFret(j, i) - rootNote) % 12;
          if (sequence.includes(INTERVAL)) {
            this.renderNote(j, i, size);
          }
        }
      }
    } catch (err) {
      throw err;
    }
  }
}

export { Fretboard };
