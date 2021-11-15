import { Container } from "./container.mjs";
import { INSTRUMENT_CONFIGS } from "./instrumentConfigs.mjs";
import { FretboardMenu } from "./fretboardMenu.mjs";
import { NOTE_NAMES, getIndexFromName } from "./noteNames.mjs";
import { NOTE_SEQUENCES } from "./noteSequences.mjs";
import { NOTE_LABELS } from "./noteLabels.mjs";
import { NOTE_COLORS } from "./noteColors.mjs";
import { COLOR_THEMES } from "./colorThemes.mjs";
import { Fretboard } from "./fretboard.mjs";
import { SquashyMenuIcon } from "./squashyMenuIcon.mjs";
import { SpinningPlusIcon } from "./spinningPlusIcon.mjs";
import { SpinningMinusIcon } from "./spinningMinusIcon.mjs";

class FretboardMultitool extends Container {
  constructor(props = {}) {
    super();
    // don't need to store this.props in this class
    const PROPS = { ...INSTRUMENT_CONFIGS.defaults, ...props };

    this.container.style.backgroundColor = PROPS.colorTheme.background;

    this.fretboardMenu = new FretboardMenu(PROPS);
    this.fretboard = new Fretboard(PROPS);

    // catch a pointer down/up event that happens in the FretboardMultitool
    // push/clear that pointer id if it hasn't been pushed/cleared by Fretboard
    // which will happen if it happens outside of the Fretboard but
    // inside of the FretboardMultitool
    this.container.addEventListener(
      "pointerdown",
      (event) => {
        try {
          const INDEX = this.fretboard.pointerDownIds.indexOf(event.pointerId);
          // if id was not found, push it
          if (INDEX < 0) {
            this.fretboard.pointerDownIds.push(event.pointerId);
            event.target.releasePointerCapture(event.pointerId);
          }
        } catch (err) {
          console.error(err);
        }
      },
      false
    );
    this.container.addEventListener(
      "pointerup",
      (event) => {
        try {
          const INDEX = this.fretboard.pointerDownIds.indexOf(event.pointerId);
          // if id was found, it wasn't cleared by Fretboard
          if (INDEX >= 0) {
            this.fretboard.pointerDownIds.splice(INDEX, 1);
          }
        } catch (err) {
          console.error(err);
        }
      },
      false
    );

    // clear the pointer id when you leave the
    // multitool's area with pointer down
    this.container.addEventListener(
      "pointerleave",
      (event) => {
        try {
          const INDEX = this.fretboard.pointerDownIds.indexOf(event.pointerId);
          if (INDEX >= 0) {
            this.fretboard.pointerDownIds.splice(INDEX, 1);
          }
        } catch (err) {
          console.error(err);
        }
      },
      false
    );

    this.fretboardMenu.instrumentSelect.addEventListener("change", (event) => {
      this.fretboard.props = {
        ...this.fretboard.props,
        ...INSTRUMENT_CONFIGS.instruments[event.target.value],
        fromFret: parseInt(this.fretboardMenu.fromFretSelect.value), // default fret value is set in INSTRUMENT_CONFIGS, so update it here
        toFret: parseInt(this.fretboardMenu.toFretSelect.value), // default fret value is set in INSTRUMENT_CONFIGS, so update it here
      };
      this.fretboard.reset();
    });

    this.fretboardMenu.rootNoteSelect.addEventListener("change", (event) => {
      this.fretboard.props.rootNote = getIndexFromName(event.target.value);
      this.fretboard.reset();
    });

    this.fretboardMenu.noteSequenceSelect.addEventListener("change", () => {
      this.sequenceAndLabelsUpdate();
      this.fretboard.reset();
    });

    this.fretboardMenu.fromFretSelect.addEventListener("change", (event) => {
      this.fretboard.props.fromFret = parseInt(event.target.value);
      this.fretboard.reset();
    });

    this.fretboardMenu.toFretSelect.addEventListener("change", (event) => {
      this.fretboard.props.toFret = parseInt(event.target.value);
      this.fretboard.reset();
    });

    this.fretboardMenu.modeSelect.addEventListener("change", (event) => {
      this.fretboard.props.mode = event.target.value;
    });

    // Fretboard uses a lower case hand value to use in style calculations
    this.fretboardMenu.handSelect.addEventListener("change", (event) => {
      this.fretboard.props.hand = event.target.value;
      this.fretboard.update();
    });

    this.fretboardMenu.noteLabelsSelect.addEventListener("change", () => {
      this.sequenceAndLabelsUpdate();
      this.fretboard.update();
    });

    this.fretboardMenu.noteColorsSelect.addEventListener("change", (event) => {
      this.fretboard.props.noteColors = NOTE_COLORS[event.target.value];
      this.fretboard.update();
    });

    // reset the index to the first option, which is the title i.e. "Note Size"
    // this is so a change event will fire even if you re-select an option
    // this will set all notes to the option size when their size has been edited
    // but the select still says their original size
    this.fretboardMenu.noteSizeSelect.addEventListener("pointerdown", () => {
      this.fretboardMenu.noteSizeSelect.selectedIndex = "0";
    });

    // change event could fire on selecting same option because selectedIndex
    // is reset to "0" in pointerdown listener
    // this means we must check which noteSize is bigger and set that
    // to first or second based on option choice, even if it's the same as
    // the previous option choice
    // this also works for selecting same value with keyboard shortcuts "k" and "l"
    // which dispatch a change event, even if the same
    this.fretboardMenu.noteSizeSelect.addEventListener("change", () => {
      let largeValue, smallValue;
      // check if first value is bigger than second
      if (
        parseInt(this.fretboard.props.noteSizes.first) >
        parseInt(this.fretboard.props.noteSizes.second)
      ) {
        largeValue = this.fretboard.props.noteSizes.first;
        smallValue = this.fretboard.props.noteSizes.second;
      } else {
        largeValue = this.fretboard.props.noteSizes.second;
        smallValue = this.fretboard.props.noteSizes.first;
      }
      // set Fretboard.props.noteSizes
      if (this.fretboardMenu.noteSizeSelect.value === "Large") {
        this.fretboard.props.noteSizes = {
          first: largeValue,
          second: smallValue,
        };
      } else if (this.fretboardMenu.noteSizeSelect.value === "Small") {
        this.fretboard.props.noteSizes = {
          first: smallValue,
          second: largeValue,
        };
      }
      // passing true means note sizes will be reset to
      // Fretboard.props.noteSizes.first
      this.fretboard.update(true);
    });

    this.fretboardMenu.noteDurationSelect.addEventListener(
      "change",
      (event) => {
        this.fretboard.props.noteDuration = parseFloat(event.target.value);
        this.fretboard.update();
      }
    );

    this.fretboardMenu.colorThemeSelect.addEventListener("change", (event) => {
      this.container.style.backgroundColor =
        COLOR_THEMES[event.target.value].background;
      this.fretboard.props.colorTheme = COLOR_THEMES[event.target.value];
      this.fretboard.container.style.backgroundColor =
        COLOR_THEMES[event.target.value].background;
      this.showHideButton.setColorTheme(
        COLOR_THEMES[event.target.value].foreground
      );
      this.addToolButton.setColorTheme(
        COLOR_THEMES[event.target.value].foreground
      );
      this.removeToolButton.setColorTheme(
        COLOR_THEMES[event.target.value].foreground
      );
      this.fretboard.update();
    });

    this.showHideButton = new SquashyMenuIcon(
      "3.5em",
      "3em",
      PROPS.colorTheme.foreground
    );
    this.showHideButton.container.addEventListener("pointerdown", () => {
      this.fretboardMenu.container.style.display =
        this.fretboardMenu.container.style.display === "none"
          ? "block"
          : "none";
    });

    this.addToolButton = new SpinningPlusIcon(
      "3em",
      "3em",
      PROPS.colorTheme.foreground
    );
    this.addToolButton.container.style.marginLeft = "0.7em";
    this.addToolButton.container.addEventListener("pointerdown", () => {
      this.container.dispatchEvent(
        new CustomEvent("addtool", {
          detail: this.fretboard.props,
          bubbles: true,
        })
      );
    });

    this.removeToolButton = new SpinningMinusIcon(
      "3em",
      "3em",
      PROPS.colorTheme.foreground
    );
    this.removeToolButton.container.style.marginLeft = "0.7em";
    this.removeToolButton.container.addEventListener("pointerdown", () => {
      this.container.dispatchEvent(new Event("removetool", { bubbles: true }));
    });

    this.render(this.fretboardMenu.container);
    this.render(this.fretboard.container);
    this.render(this.showHideButton.container);
    this.render(this.addToolButton.container);
    this.render(this.removeToolButton.container);

    this.addKeyboardShortcuts();
  }

  sequenceAndLabelsUpdate() {
    const SEQUENCE =
      NOTE_SEQUENCES[
        this.fretboardMenu.noteSequenceSelect.querySelector("option:checked")
          .parentElement.label
      ][this.fretboardMenu.noteSequenceSelect.value];
    this.fretboard.props.sequence = SEQUENCE.sequence;
    // reset note names
    const NOTE_LABELS_TYPE = this.fretboardMenu.noteLabelsSelect.value;
    // spread NOTE_LABELS[NOTE_LABELS_TYPE] so it is a deep copy
    // because values can be overwritten below
    let labels = [...NOTE_LABELS[NOTE_LABELS_TYPE]];
    if (SEQUENCE.labels && SEQUENCE.labels[NOTE_LABELS_TYPE]) {
      Object.entries(SEQUENCE.labels[NOTE_LABELS_TYPE]).forEach(
        ([integer, name]) => {
          labels[parseInt(integer)] = name;
        }
      );
    }
    // set Fretboard.props to the deep copy of labels
    this.fretboard.props.noteLabels = labels;
  }

  set tabIndex(index) {
    // helps this div to be keyboard focusable
    this.container.tabIndex = index;
  }

  addKeyboardShortcuts() {
    this.tabIndex = "-1";
    this.container.addEventListener("pointerdown", () => {
      this.container.focus();
    });
    this.container.addEventListener("keydown", (event) => {
      // ROOT NOTE SHORTCUTS
      switch (event.key) {
        case "z":
        case "Z":
          this.fretboardMenu.rootNoteSelect.value = NOTE_NAMES[0];
          this.fretboardMenu.rootNoteSelect.dispatchEvent(new Event("change"));
          break;
        case "s":
        case "S":
          this.fretboardMenu.rootNoteSelect.value = NOTE_NAMES[1];
          this.fretboardMenu.rootNoteSelect.dispatchEvent(new Event("change"));
          break;
        case "x":
        case "X":
          this.fretboardMenu.rootNoteSelect.value = NOTE_NAMES[2];
          this.fretboardMenu.rootNoteSelect.dispatchEvent(new Event("change"));
          break;
        case "d":
        case "D":
          this.fretboardMenu.rootNoteSelect.value = NOTE_NAMES[3];
          this.fretboardMenu.rootNoteSelect.dispatchEvent(new Event("change"));
          break;
        case "c":
        case "C":
          this.fretboardMenu.rootNoteSelect.value = NOTE_NAMES[4];
          this.fretboardMenu.rootNoteSelect.dispatchEvent(new Event("change"));
          break;
        case "v":
        case "V":
          this.fretboardMenu.rootNoteSelect.value = NOTE_NAMES[5];
          this.fretboardMenu.rootNoteSelect.dispatchEvent(new Event("change"));
          break;
        case "g":
        case "G":
          this.fretboardMenu.rootNoteSelect.value = NOTE_NAMES[6];
          this.fretboardMenu.rootNoteSelect.dispatchEvent(new Event("change"));
          break;
        case "b":
        case "B":
          this.fretboardMenu.rootNoteSelect.value = NOTE_NAMES[7];
          this.fretboardMenu.rootNoteSelect.dispatchEvent(new Event("change"));
          break;
        case "h":
        case "H":
          this.fretboardMenu.rootNoteSelect.value = NOTE_NAMES[8];
          this.fretboardMenu.rootNoteSelect.dispatchEvent(new Event("change"));
          break;
        case "n":
        case "N":
          this.fretboardMenu.rootNoteSelect.value = NOTE_NAMES[9];
          this.fretboardMenu.rootNoteSelect.dispatchEvent(new Event("change"));
          break;
        case "j":
        case "J":
          this.fretboardMenu.rootNoteSelect.value = NOTE_NAMES[10];
          this.fretboardMenu.rootNoteSelect.dispatchEvent(new Event("change"));
          break;
        case "m":
        case "M":
          this.fretboardMenu.rootNoteSelect.value = NOTE_NAMES[11];
          this.fretboardMenu.rootNoteSelect.dispatchEvent(new Event("change"));
          break;
        case ",":
        case "<":
          this.fretboardMenu.rootNoteSelect.value = NOTE_NAMES[0];
          this.fretboardMenu.rootNoteSelect.dispatchEvent(new Event("change"));
          break;
        // NOTE SEQUENCES SHORTCUTS
        case "1":
          this.fretboardMenu.noteSequenceSelect.value = "Ionian / Major";
          this.fretboardMenu.noteSequenceSelect.dispatchEvent(
            new Event("change")
          );
          break;
        case "2":
          this.fretboardMenu.noteSequenceSelect.value = "Dorian";
          this.fretboardMenu.noteSequenceSelect.dispatchEvent(
            new Event("change")
          );
          break;
        case "3":
          this.fretboardMenu.noteSequenceSelect.value = "Phrygian";
          this.fretboardMenu.noteSequenceSelect.dispatchEvent(
            new Event("change")
          );
          break;
        case "4":
          this.fretboardMenu.noteSequenceSelect.value = "Lydian";
          this.fretboardMenu.noteSequenceSelect.dispatchEvent(
            new Event("change")
          );
          break;
        case "5":
          this.fretboardMenu.noteSequenceSelect.value = "Mixolydian";
          this.fretboardMenu.noteSequenceSelect.dispatchEvent(
            new Event("change")
          );
          break;
        case "6":
          this.fretboardMenu.noteSequenceSelect.value = "Aeolian / Minor";
          this.fretboardMenu.noteSequenceSelect.dispatchEvent(
            new Event("change")
          );
          break;
        case "7":
          this.fretboardMenu.noteSequenceSelect.value = "Locrian";
          this.fretboardMenu.noteSequenceSelect.dispatchEvent(
            new Event("change")
          );
          break;
        case "8":
          this.fretboardMenu.noteSequenceSelect.value = "Root";
          this.fretboardMenu.noteSequenceSelect.dispatchEvent(
            new Event("change")
          );
          break;
        case "9":
          this.fretboardMenu.noteSequenceSelect.value = "Chromatic";
          this.fretboardMenu.noteSequenceSelect.dispatchEvent(
            new Event("change")
          );
          break;
        case "0":
          this.fretboardMenu.noteSequenceSelect.value = "Blank";
          this.fretboardMenu.noteSequenceSelect.dispatchEvent(
            new Event("change")
          );
          break;
        // MODE SHORTCUTS
        case "p":
        case "P":
          this.fretboardMenu.modeSelect.value = "Play";
          this.fretboardMenu.modeSelect.dispatchEvent(new Event("change"));
          break;
        case "o":
        case "O":
          this.fretboardMenu.modeSelect.value = "Edit One";
          this.fretboardMenu.modeSelect.dispatchEvent(new Event("change"));
          break;
        case "i":
        case "I":
          this.fretboardMenu.modeSelect.value = "Edit All";
          this.fretboardMenu.modeSelect.dispatchEvent(new Event("change"));
          break;
        // NOTE SIZE SHORTCUTS
        case "l":
        case "L":
          this.fretboardMenu.noteSizeSelect.value = "Large";
          this.fretboardMenu.noteSizeSelect.dispatchEvent(new Event("change"));
          break;
        case "k":
        case "K":
          this.fretboardMenu.noteSizeSelect.value = "Small";
          this.fretboardMenu.noteSizeSelect.dispatchEvent(new Event("change"));
          break;
      }
    });
  }
}

export { FretboardMultitool };
