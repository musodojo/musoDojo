import { FretboardMarker } from "./fretboardMarker.mjs";
import { FretboardFret } from "./fretboardFret.mjs";
import { FretboardCourse } from "./fretboardCourse.mjs";
import { FretboardCourseFret } from "./fretboardCourseFret.mjs";
import { FretboardFretLabel } from "./fretboardFretLabel.mjs";
import { FretboardNote } from "./fretboardNote.mjs";

class Fretboard {
  constructor(props = {}, width = "42em", height = "14em") {
    try {
      // properties are defined here
      this.props = {
        // used in FretboardMenu's instrument select
        name: "Guitar",

        // used to tell AudioInterface.startNote which type of sound to play
        audio: "Guitar",

        // standard guitar tuning: [E=40,A=45,D=50,G=55,B=59,E=64]
        // each element is the open course's midi value
        // each course can contain multiple strings
        tuning: [[40], [45], [50], [55], [59], [64]],

        // these available settings are not set here, but can be passed in via props
        // rootNote: 0,   // would be "C / C♮ / D♭♭ / B♯"
        // sequenceName: "Ionian / Major",   // used in FretboardMenu
        // sequence: [0, 2, 4, 5, 7, 9, 11],   // would be "Ionian / Major"
        // sequence: [0],   // would be just the root note

        fromFret: 0,
        toFret: 24,

        // mode = "Play" || "Edit One" || "Edit All"
        mode: "Play",

        // this value is used as hand.toLowerCase() in position calculations
        // the capitalized "R" in "Right" comes from the menu settings using capital letters
        // and for consistency with fretboardInstrumentsProps.mjs
        hand: "Right",

        // these available settings are not set here, but can be passed in via props
        // noteLabelsName : "None",

        // default to no labels displayed inside the notes
        noteLabels: ["", "", "", "", "", "", "", "", "", "", "", ""],

        // default to no note colors definition, which then uses the colorTheme.foreground
        noteColors: ["", "", "", "", "", "", "", "", "", "", "", ""],

        // notes can be sized with first or second size value (or removed) by using
        // props.mode's Edit One" and "Edit All" functionality
        noteSizes: { first: "88%", second: "55%" },

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

        // the fret labels are the numbers shown in Freboard.side
        // by default only frets in props.fretMarkers are allowed
        // in renderFretLabels(onlyLabelDefinedMarkers = true) {...}
        // set onlyLabelDefinedMarkers = false to render all fret's labels
        showFretLabels: true,

        // show the fret maker inlays on the fingerboard
        // only frets in props.fretMarkers are rendered
        showFretboardMarkers: true,

        // some defined fret marker positions for rendering
        // FretboardFingerboardMarker's and FretboardFretLabel's
        // plural with apostrophe included for clarity
        fretMarkers: [3, 5, 7, 9, 12, 15, 17, 19, 21, 24],

        // sets how much space is fingerboard and how much is fret labels
        // it is used if this.props.showFretLabels = true
        // otherwise ther fingerboard takes 100% of the Fretboard
        // and the side div which displays the labels is not drawn
        fingerboardFraction: 0.94,

        // then overwrite with any of the passed props
        ...props,
      };

      this.checkProps();
      this.createFretboard(width, height);
    } catch (err) {
      console.error(err);
      this.fretboard.innerHTML = "";
      this.fretboard.appendChild(this.getErrorElement(err));
    }
  }

  // FRETBOARD SETUP

  createFretboard(width, height) {
    // create the main div and set style.position it so children can position relative to it
    this.fretboard = document.createElement("div");
    this.fretboard.style.position = "relative";
    this.fretboard.style.resize = "both";
    this.fretboard.style.overflow = "hidden";

    this.setSize(width, height);
    this.setColorThemeStyles();

    const FINGERBOARD_FRACTION = this.props.showFretLabels
      ? this.props.fingerboardFraction
      : 1;
    this.createFingerboard(FINGERBOARD_FRACTION);
    this.props.showFretLabels ? this.createSide(FINGERBOARD_FRACTION) : null;

    this.resetState();

    this.renderFretboard();
    if (this.props.sequence) this.renderSequence();
  }

  createFingerboard(FINGERBOARD_FRACTION) {
    this.fingerboard = document.createElement("div");
    this.fingerboard.style.position = "absolute";
    this.fingerboard.style.width = "100%";
    this.fingerboard.style.height = `calc(${this.height} * ${FINGERBOARD_FRACTION})`;
    this.fingerboard.style.top = "0";
    this.fretboard.appendChild(this.fingerboard);
  }

  createSide(FINGERBOARD_FRACTION) {
    this.side = document.createElement("div");
    this.side.style.position = "absolute";
    this.side.style.width = "100%";
    this.side.style.height = `calc(${this.height} * (1 - ${FINGERBOARD_FRACTION}))`;
    this.side.style.bottom = "0";
    this.fretboard.appendChild(this.side);
  }

  setColorThemeStyles() {
    this.fretboard.style.backgroundColor = this.props.colorTheme.background;
    this.fretboard.style.color = this.props.colorTheme.foreground;
  }

  // reset the state object
  resetState() {
    this.state = {};
    this.state.pointerDownIds = [];
    this.state.areas = {};
    this.state.notes = {};
    this.state.audioBuffers = {};
  }

  // WIDTH and HEIGHT
  // keep track of width and height of the main Fretboard.fretboard div
  // in this.widthValue, this.widthUnits, this.heightValue, this.heightUnits
  // this is because CSS can't yet do power calculations (e.g. 2^3)
  // which is needed for fret distance calculations

  // get and set width
  get width() {
    return this.fretboard.style.width;
  }

  set width(width) {
    this.widthValue = this.getValueFromStyleSetting(width);
    this.widthUnits = this.getUnitsFromStyleSetting(width);
    this.fretboard.style.width = width;
  }

  // get and set height
  get height() {
    return this.fretboard.style.height;
  }

  set height(height) {
    this.heightValue = this.getValueFromStyleSetting(height);
    this.heightUnits = this.getUnitsFromStyleSetting(height);
    this.fretboard.style.height = height;
  }

  // set width and height together
  setSize(width, height) {
    this.width = width;
    this.height = height;
  }

  // return a string containing
  // multiple (+)
  // case-insensitive (/i)
  // letters [A-Z...]
  // at the end of the value string ($)
  // need [0] because match returns an array
  getUnitsFromStyleSetting(styleSetting) {
    return styleSetting.match(/[A-Z]+$/i)[0];
  }

  // return a number containing numeric part at start of styleSetting
  getValueFromStyleSetting(styleSetting) {
    return parseFloat(styleSetting);
  }

  // ERROR HANDLERS

  // courseNum should be greater than 1
  // and less than the length of the tuning definition array
  checkCourseNum(courseNum) {
    if (courseNum < 1 || courseNum > this.props.tuning.length) {
      throw new Error(
        `Fretboard checkCourseNum(courseNum): courseNum=${courseNum} is out of range (1 - ${this.props.tuning.length})`
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
  // the capital first letter is used in fretboardInstrumentsProps.mjs
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

  checkProps() {
    // this makes sure fromFret isn't bigger than toFret
    this.checkFretNum(this.props.fromFret);
    this.checkHand();
  }

  // return a div with an error message inside
  getErrorElement(err) {
    const ERROR_HTML = document.createElement("div");
    ERROR_HTML.style.textAlign = "center";
    ERROR_HTML.style.fontSize = "1.2em";
    ERROR_HTML.innerHTML = `<h2>Error Building Fretboard</h2><br/><h3>${err}</h3>`;
    return ERROR_HTML;
  }

  // GETTERS OF INFORMATION

  // returns one fret more than what is displayed on the fretboard
  // so the nut is spaced nicely from the edge when drawing frets, etc.
  // in calculations, this gets you to the end of the fretboard, past fret #0, to fret #-1
  getNumFretsToCalculate() {
    return this.props.toFret - this.props.fromFret + 1;
  }

  // returns an array of MIDI numbers for notes on a given course and fret
  // a course can contain multiple strings - props.tuning[x] contains an array,
  getMidi(courseNum, fretNum) {
    return this.props.tuning[this.props.tuning.length - courseNum].map(
      (midiValue) => midiValue + fretNum
    );
  }

  // returns a number representing the width in px between (fretNum-1) and (fretNum)
  // units are included in returned value
  // getNumFretsToCalculate() counts to fret #-1
  // e.g. fromFret = 0; toFret = 12; fretNum = 0
  // calculations are actually done from the bridge end, fret #0 (real instrument)
  // iscalculated using fret #12 (in code)
  // 12+1=13 (fret #-1) is getNumFretsToCalculate
  // so get the difference between 13 frets from bridge end (fret #-1, real instrument)
  // and 12 frets from the end (fret#0, real instrument)
  // which is correct for fret #0's fret area (finger area)
  getFretAreaWidth(fretNum) {
    const NUM_FRETS = this.getNumFretsToCalculate();
    return (
      ((Math.pow(2, (NUM_FRETS + this.props.fromFret - fretNum) / 12) -
        Math.pow(2, (NUM_FRETS + this.props.fromFret - fretNum - 1) / 12)) /
        (Math.pow(2, NUM_FRETS / 12) - 1)) *
        this.widthValue +
      this.widthUnits
    );
  }

  // returns a number representing the fret distance value in this.widthUnits
  // between the bridge end and fret #fretNum
  // can't use CSS for pow calculations yet
  getFretDistance(fretNum) {
    const NUM_FRETS = this.getNumFretsToCalculate();
    return (
      ((Math.pow(2, (NUM_FRETS - 1 + this.props.fromFret - fretNum) / 12) - 1) /
        (Math.pow(2, NUM_FRETS / 12) - 1)) *
        this.widthValue +
      this.widthUnits
    );
  }

  // return a note if it exists, otherwise return falsey value
  getNote(courseNum, fretNum) {
    return this.state.notes[`${courseNum}_${fretNum}`];
  }

  // RENDERERS

  renderFretboard() {
    try {
      if (this.props.showFretboardMarkers) {
        this.renderFretboardMarkers();
      }
      if (this.props.showFrets) {
        this.renderFrets();
      }
      if (this.props.showStrings) {
        this.renderCourses();
      }
      if (this.props.showFretLabels) {
        this.renderFretLabels();
      }
      this.renderCourseFrets();
    } catch (err) {
      throw err;
    }
  }

  // resets the fretboard and redraws sequence if available
  reset() {
    this.fingerboard.innerHTML = "";
    this.side.innerHTML = "";
    this.resetState();
    this.renderFretboard();
    if (this.props.sequence) this.renderSequence();
  }

  // resets the fretboard but keeps notes currently on fretboard
  // handy for updates to hand, note labels, note colors, ...
  // including edited notes, unless resetNoteSize is true
  update(resetNoteSize = false) {
    const NOTES_COPY = { ...this.state.notes };
    this.fingerboard.innerHTML = "";
    this.side.innerHTML = "";
    this.resetState();
    this.renderFretboard();
    Object.entries(NOTES_COPY).forEach(([course_fret, note]) => {
      const SPLIT = course_fret.split("_");
      this.renderNote(
        parseInt(SPLIT[0]),
        parseInt(SPLIT[1]),
        resetNoteSize ? this.props.noteSizes.first : note.size
      );
    });
  }

  renderFretboardMarkers() {
    for (let i = this.props.fromFret; i <= this.props.toFret; i++) {
      if (this.props.fretMarkers.includes(i)) {
        new FretboardMarker(this, i);
      }
    }
  }

  renderFrets() {
    for (let i = this.props.fromFret; i <= this.props.toFret; i++) {
      new FretboardFret(this, i);
    }
  }

  renderFretLabels(onlyLabelDefinedMarkers = true) {
    for (let i = this.props.fromFret; i <= this.props.toFret; i++) {
      if (
        i === 0 || // always render 0th fret label if it's on the fretboard
        !onlyLabelDefinedMarkers || // if onlyLabelDefinedMarkers = false, render them all
        (onlyLabelDefinedMarkers && this.props.fretMarkers.includes(i)) // if onlyLabelDefinedMarkers = true, render the ones in props.fretMakers
      )
        new FretboardFretLabel(this, i);
    }
  }

  renderCourses() {
    for (let i = 0; i < this.props.tuning.length; i++) {
      new FretboardCourse(this, i);
    }
  }

  // fill the Fretboard.fretboard with FretboardCourseFret's
  // apostrophe included for clarity!
  renderCourseFrets() {
    for (let i = this.props.fromFret; i <= this.props.toFret; i++) {
      for (let j = 1; j <= this.props.tuning.length; j++) {
        new FretboardCourseFret(this, j, i);
      }
    }
  }

  play(courseNum, fretNum, duration = this.props.noteDuration) {
    this.state.areas[`${courseNum}_${fretNum}`].play(duration);
  }

  toggleNote(courseNum, fretNum) {
    try {
      const NOTE = this.getNote(courseNum, fretNum);
      if (!NOTE) {
        this.play(courseNum, fretNum);
        this.renderNote(courseNum, fretNum, this.props.noteSizes.first);
      } else {
        const SIZE = NOTE.size;
        switch (SIZE) {
          case this.props.noteSizes.first:
            this.renderNote(courseNum, fretNum, this.props.noteSizes.second);
            break;
          case this.props.noteSizes.second:
            this.removeNote(courseNum, fretNum);
            break;
          default:
            throw new Error(
              `Fretboard toggleOneNote(courseNum, fretNum): size=${SIZE} should match Fretboard props.noteSizes.first=${this.props.noteSizes.first} || props.noteSizes.second=${this.props.noteSizes.second}`
            );
        }
      }
    } catch (err) {
      throw err;
    }
  }

  togglePitchClass(courseNum, fretNum) {
    try {
      const NOTE = this.state.notes[`${courseNum}_${fretNum}`];
      // only work with the first value if a course contains multiple strings
      const SELECTED_PITCH_CLASS = this.getMidi(courseNum, fretNum)[0] % 12;
      let currentPitchClass;
      // grab value of note width because it will change later
      if (NOTE) {
        var SIZE = NOTE.size;
      } else {
        // if there's no note, play it because the sound won't trigger
        this.play(courseNum, fretNum);
      }
      for (let i = this.props.fromFret; i <= this.props.toFret; i++) {
        for (let j = 1; j <= this.props.tuning.length; j++) {
          currentPitchClass = this.getMidi(j, i)[0] % 12;
          if (currentPitchClass === SELECTED_PITCH_CLASS) {
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
                    `Fretboard togglePitchClass(courseNum, fretNum): size=${SIZE} should match Fretboard props.noteSizes.first=${this.props.noteSizes.first} || props.noteSizes.second=${this.props.noteSizes.second}`
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

  removeNote(courseNum, fretNum) {
    const NOTE = this.state.notes[`${courseNum}_${fretNum}`];
    if (NOTE) {
      NOTE.fretboardNote.remove();
      delete this.state.notes[`${courseNum}_${fretNum}`];
    }
  }

  // course numbers start counting from 1
  renderNote(courseNum, fretNum, size = this.props.noteSizes.first) {
    try {
      let note = this.getNote(courseNum, fretNum);
      if (note) {
        // if there is already a note, just set its size
        note.size = size;
      } else {
        note = new FretboardNote(this, courseNum, fretNum, size);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // course num (j) starts at 1 in this function
  renderSequence(
    rootNote = this.props.rootNote,
    sequence = this.props.sequence,
    size = this.props.noteSizes.first
  ) {
    try {
      for (let i = this.props.fromFret; i <= this.props.toFret; i++) {
        for (let j = 1; j <= this.props.tuning.length; j++) {
          const INTERVAL = (this.getMidi(j, i)[0] - rootNote) % 12;
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
