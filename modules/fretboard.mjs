import { Container } from "./container.mjs";
import { FretboardArea } from "./fretboardArea.mjs";
import { FretboardNote } from "./fretboardNote.mjs";
import { AudioInterface } from "./audioInterface.mjs";

class Fretboard extends Container {
  constructor(props = {}) {
    try {
      super();
      this.props = {
        width: 750, // don't include the implied "px" units
        height: 250, // don't include the implied "px" units
        instrument: "Guitar",
        tuning: [40, 45, 50, 55, 59, 64], // EADGBE
        fromFret: 0,
        toFret: 21,
        // mode = "Play" || "Edit One" || "Edit All"
        mode: "Play",
        hand: "Right",
        noteLabels: ["", "", "", "", "", "", "", "", "", "", "", ""],
        noteColors: null,
        noteSizes: { first: "91%", second: "55%" },
        // noteDuration = -1 means play full note duration
        // noteDuration = 0 means play note until up event occurs
        // noteDuration = x means play note for x seconds (clipped at note's duration in audio sprite)
        noteDuration: 0,
        colorTheme: {
          background: "#000000",
          midground: "#999999",
          foreground: "#FFFFFF",
        },
        showStrings: true,
        showFrets: true,
        fretMarkers: [3, 5, 7, 9, 12, 15, 17, 19, 21, 24],
        showFretNumbers: true,
        showFretboardMarkers: true,
        ...props,
      };

      this.container.style.position = "relative";
      this.container.style.backgroundColor = this.props.colorTheme.background;
      this.container.style.color = this.props.colorTheme.foreground;

      // width and heigth are numbers in px
      this.container.style.width = this.props.width + "px";
      this.container.style.height = this.props.height + "px";

      this.props.mainScale = this.props.showFretNumbers ? 0.95 : 1;

      if (this.props.fromFret > this.props.toFret) {
        throw new Error(
          `Fretboard fromFret=${this.props.fromFret} should be less than toFret=${this.props.toFret}`
        );
      }

      if (
        !(
          this.props.hand.toLowerCase() === "left" ||
          this.props.hand.toLowerCase() === "right"
        )
      ) {
        throw new Error(
          `Fretboard hand=${this.props.hand.toLowerCase()} should be left or right`
        );
      }

      this.pointerDownIds = new Array();
      this.areas = new Object();
      this.notes = new Object();
      this.audioBuffers = new Object();

      this.renderFretboard();
      if (this.props.sequence) this.renderSequence();
    } catch (err) {
      console.error(err);
      this.container.innerHTML = "";
      this.render(this.getErrorContainer(err));
    }
  }

  getErrorContainer(err) {
    const ERROR_HTML = document.createElement("div");
    ERROR_HTML.style.textAlign = "center";
    ERROR_HTML.style.fontSize = "1.2em";
    ERROR_HTML.innerHTML = `<h2>Error Building Fretboard</h2><br/><h3>${err}</h3>`;
    return ERROR_HTML;
  }

  // calculate an extra fret over what is drawn on screen
  // so the nut is spaced nicely from the edge
  get fretsToCalculate() {
    return this.props.toFret - this.props.fromFret + 1;
  }

  getMidiFromStringFret(stringNum, fretNum) {
    return this.props.tuning[this.props.tuning.length - stringNum] + fretNum;
  }

  getFretWidth(fretNum) {
    return (
      ((Math.pow(
        2,
        (this.fretsToCalculate + this.props.fromFret - fretNum) / 12
      ) -
        Math.pow(
          2,
          (this.fretsToCalculate + this.props.fromFret - fretNum - 1) / 12
        )) /
        (Math.pow(2, this.fretsToCalculate / 12) - 1)) *
      this.props.width
    );
  }

  getFretDistance(fretNum) {
    return (
      ((Math.pow(
        2,
        (this.fretsToCalculate - 1 + this.props.fromFret - fretNum) / 12
      ) -
        1) /
        (Math.pow(2, this.fretsToCalculate / 12) - 1)) *
      this.props.width
    );
  }

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
    this.pointerDownIds = [];
    this.areas = {};
    this.notes = {};
    this.audioBuffers = {};
    this.renderFretboard();
    if (this.props.sequence) this.renderSequence();
  }

  // resets the fretboard and keeps all notes as they were
  // including edited notes, unless resetNoteSize is true
  update(resetNoteSize = false) {
    this.container.innerHTML = "";
    this.pointerDownIds = [];
    this.areas = {};
    const NOTES_COPY = { ...this.notes };
    this.notes = {};
    this.audioBuffers = {};
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
    // done by eye
    let fretWidth = this.props.width / 500 < 1 ? 1 : this.props.width / 500;
    for (let i = this.props.fromFret; i <= this.props.toFret; i++) {
      const FRET = document.createElement("div");
      FRET.style.backgroundColor = this.props.colorTheme.foreground;
      FRET.style.position = "absolute";
      FRET.style.top = 0;
      FRET.style.width = fretWidth + "px";
      FRET.style.height = this.props.height * this.props.mainScale + "px";
      FRET.style[this.props.hand.toLowerCase()] =
        this.getFretDistance(i) + "px";
      this.render(FRET);
    }
  }

  renderFretNumbers(numbersFollowMarkers = true) {
    for (let i = this.props.fromFret; i <= this.props.toFret; i++) {
      if (
        numbersFollowMarkers &&
        !this.props.fretMarkers.includes(i) &&
        i !== 0
      ) {
        continue;
      }
      const FRETBOARD_AREA = new FretboardArea(
        this.getFretWidth(i) + "px",
        this.props.height * (1 - this.props.mainScale) + "px"
      );
      FRETBOARD_AREA.container.style.top =
        this.props.height * this.props.mainScale + "px";
      FRETBOARD_AREA.container.style[this.props.hand.toLowerCase()] =
        this.getFretDistance(i) + "px";

      const FRET_NUMBER_LABEL = document.createElement("div");
      FRET_NUMBER_LABEL.style.fontSize = this.props.height / 23 + "px";
      FRET_NUMBER_LABEL.innerText = i;
      FRETBOARD_AREA.render(FRET_NUMBER_LABEL);
      this.render(FRETBOARD_AREA.container);
    }
  }

  renderFretboardMarkers(fretMarkers = this.props.fretMarkers) {
    for (let i = this.props.fromFret; i <= this.props.toFret; i++) {
      if (fretMarkers.includes(i)) {
        const FRETBOARD_AREA = new FretboardArea(
          this.getFretWidth(i) + "px",
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
      let string = document.createElement("div");
      string.style.backgroundColor = this.props.colorTheme.foreground;
      string.style.position = "absolute";
      string.style.width = "100%";
      string.style.top =
        ((i - 0.5) / this.props.tuning.length) *
          this.props.height *
          this.props.mainScale +
        "px";
      string.style.height = this.props.height / 200 + "px";
      this.render(string);
    }
  }

  checkStringNum(stringNum) {
    if (stringNum < 1 || stringNum > this.props.tuning.length) {
      throw new Error(
        `Fretboard checkStringNum(stringNum): stringNum=${stringNum} is out of range (1 - ${this.tuning.length})`
      );
    }
  }

  checkFretNum(fretNum) {
    if (fretNum < this.props.fromFret || fretNum > this.props.toFret) {
      throw new Error(
        `Fretboard checkFretNum(fretNum): fretNum=${fretNum} is out of range (${this.fromFret} to ${this.toFret})`
      );
    }
  }

  renderStringFretAreas() {
    for (let i = this.props.fromFret; i <= this.props.toFret; i++) {
      for (let j = 1; j <= this.props.tuning.length; j++) {
        this.renderStringFretArea(j, i);
      }
    }
  }

  // string numbers start counting from 1
  renderStringFretArea(stringNum, fretNum) {
    try {
      this.checkStringNum(stringNum);
      this.checkFretNum(fretNum);
      const FRETBOARD_AREA = new FretboardArea(
        this.getFretWidth(fretNum) + "px",
        (this.props.height / this.props.tuning.length) * this.props.mainScale +
          "px"
      );
      this.areas[`${stringNum}_${fretNum}`] = FRETBOARD_AREA;

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
            this.pointerDownIds.push(event.pointerId);
            event.target.releasePointerCapture(event.pointerId);
            if (this.notes[`${stringNum}_${fretNum}`])
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
            if (this.pointerDownIds.includes(event.pointerId)) {
              if (this.notes[`${stringNum}_${fretNum}`])
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
            const INDEX = this.pointerDownIds.indexOf(event.pointerId);
            if (INDEX >= 0) {
              this.pointerDownIds.splice(INDEX, 1);
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
              if (this.audioBuffers[`${stringNum}_${fretNum}`]) {
                AudioInterface.stopNote(
                  this.audioBuffers[`${stringNum}_${fretNum}`]
                );
                this.areas[`${stringNum}_${fretNum}`].backgroundDivColor =
                  "transparent";
                delete this.audioBuffers[`${stringNum}_${fretNum}`];
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
              if (this.audioBuffers[`${stringNum}_${fretNum}`]) {
                AudioInterface.stopNote(
                  this.audioBuffers[`${stringNum}_${fretNum}`]
                );
                this.areas[`${stringNum}_${fretNum}`].backgroundDivColor =
                  "transparent";
                delete this.audioBuffers[`${stringNum}_${fretNum}`];
              }
            } catch (err) {
              console.error(err);
            }
          },
          true
        );
      }

      this.render(FRETBOARD_AREA.container);
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
      if (this.audioBuffers[`${stringNum}_${fretNum}`]) {
        clearTimeout(this.audioBuffers[`${stringNum}_${fretNum}`].timeout);
      }
      // stores an object {buffer, gain, noteDuration} in audioBuffers object
      // the noteDuration can be updated by AudioInterface.startNote
      // if noteDuration = 0
      // OR if noteDuration > sprite note's full duration
      // future looping functionality in AudioInterface class might change this
      this.audioBuffers[`${stringNum}_${fretNum}`] = AudioInterface.startNote(
        this.props.instrument,
        this.getMidiFromStringFret(stringNum, fretNum),
        duration
      );

      this.areas[`${stringNum}_${fretNum}`].backgroundDivColor =
        this.props.colorTheme.foreground;

      // the === 0 case is handled by event listeners in the FretboardArea
      // adds the timeout property to the audioBuffer definition in audioBuffers
      if (duration !== 0) {
        this.audioBuffers[`${stringNum}_${fretNum}`].timeout = setTimeout(
          () => {
            this.areas[`${stringNum}_${fretNum}`].backgroundDivColor =
              "transparent";
            delete this.audioBuffers[`${stringNum}_${fretNum}`];
          },
          this.audioBuffers[`${stringNum}_${fretNum}`].duration * 1000
        );
      }
    } catch (err) {
      throw err;
    }
  }

  toggleNote(stringNum, fretNum) {
    try {
      const NOTE = this.notes[`${stringNum}_${fretNum}`];
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
      const NOTE = this.notes[`${stringNum}_${fretNum}`];
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
            currentNote = this.notes[`${j}_${i}`];
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
    const NOTE = this.notes[`${stringNum}_${fretNum}`];
    if (NOTE) {
      NOTE.container.remove();
      delete this.notes[`${stringNum}_${fretNum}`];
    }
  }

  // string numbers start counting from 1
  renderNote(stringNum, fretNum, size = this.props.noteSizes.first) {
    try {
      this.checkStringNum(stringNum);
      this.checkFretNum(fretNum);
      let note = this.notes[`${stringNum}_${fretNum}`];
      const MIDI = this.getMidiFromStringFret(stringNum, fretNum);
      const COLOR = this.props.noteColors
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
          this.areas[`${stringNum}_${fretNum}`].container.style.width;
        const PARENT_HEIGHT =
          this.areas[`${stringNum}_${fretNum}`].container.style.height;
        note = new FretboardNote(
          size,
          PARENT_WIDTH,
          PARENT_HEIGHT,
          this.props.colorTheme,
          COLOR,
          label
        );
        this.areas[`${stringNum}_${fretNum}`].render(note.container);
        this.notes[`${stringNum}_${fretNum}`] = note;
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
