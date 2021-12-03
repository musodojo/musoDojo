import { Container } from "./container.mjs";
import {
  getFretboardTuningNameFromValue,
  getFretboardTuningSelect,
} from "../data/fretboardTunings.mjs";
import { NOTE_NAMES, getNoteNamesSelect } from "../data/noteNames.mjs";
import {
  getSequenceNameFromValue,
  getNoteSequenceSelect,
} from "../data/noteSequences.mjs";
import {
  NOTE_LABELS,
  getLabelsNameFromValue,
  getNoteLabelsSelect,
} from "../data/noteLabels.mjs";
import {
  NOTE_COLORS,
  getNoteColorsNameFromValue,
  getNoteColorsSelect,
} from "../data/noteColors.mjs";
import {
  COLOR_THEMES,
  getColorThemeNameFromValue,
  getColorThemeSelect,
} from "../data/colorThemes.mjs";

class FretboardMenu extends Container {
  constructor(props = {}, width = "46em") {
    super();

    // don't need to store this.props in this class
    const PROPS = {
      instrument: "Guitar",
      rootNote: 0,
      sequence: [0, 2, 4, 5, 7, 9, 11],
      fromFret: 0,
      toFret: 21,
      // mode = "Play" || "Edit One" || "Edit All"
      mode: "Play",
      hand: "Right",
      noteLabels: NOTE_LABELS["None"],
      noteColors: NOTE_COLORS["Muso Dojo"],
      noteSizes: { first: "91%", second: "55%" },
      // noteDuration = -1 means play full note duration
      // noteDuration = 0 means play note until up event occurs
      // noteDuration = x means play note for x seconds (clipped at note's duration in audio sprite)
      noteDuration: 0,
      colorTheme: COLOR_THEMES["Dark"],
      ...props,
    };

    this.container.style.backgroundColor = PROPS.colorTheme.background;
    this.container.style.maxWidth = width;

    const SELECT_STYLE = {
      "font-size": "1em",
      "background-color": PROPS.colorTheme.background,
      color: PROPS.colorTheme.foreground,
      margin: "0.2em",
      "border-radius": "0.2em",
    };

    this.instrumentSelect = getFretboardTuningSelect(
      getFretboardTuningNameFromValue(PROPS.tuning)
    );
    Object.assign(this.instrumentSelect.style, SELECT_STYLE);

    this.rootNoteSelect = getNoteNamesSelect(NOTE_NAMES[PROPS.rootNote]);
    Object.assign(this.rootNoteSelect.style, SELECT_STYLE);

    this.noteSequenceSelect = getNoteSequenceSelect(
      getSequenceNameFromValue(PROPS.sequence)
    );
    Object.assign(this.noteSequenceSelect.style, SELECT_STYLE);

    this.fromFretSelect = document.createElement("select");
    Object.assign(this.fromFretSelect.style, SELECT_STYLE);
    const FROM_FRET_LABEL = document.createElement("option");
    FROM_FRET_LABEL.text = "From";
    FROM_FRET_LABEL.disabled = "disabled";
    this.fromFretSelect.add(FROM_FRET_LABEL);
    for (let i = 0; i <= 24; i++) {
      const FROM_FRET_OPTION = document.createElement("option");
      FROM_FRET_OPTION.text = i;
      this.fromFretSelect.add(FROM_FRET_OPTION);
      if (i === PROPS.fromFret) {
        FROM_FRET_OPTION.selected = true;
      }
    }
    this.fromFretSelect.addEventListener("change", () => {
      const FROM_FRET = parseInt(this.fromFretSelect.value);
      const TO_FRET = parseInt(this.toFretSelect.value);
      this.fromFretSelect.value = FROM_FRET > TO_FRET ? TO_FRET : FROM_FRET;
    });

    this.toFretSelect = document.createElement("select");
    Object.assign(this.toFretSelect.style, SELECT_STYLE);
    const TO_FRET_LABEL = document.createElement("option");
    TO_FRET_LABEL.text = "To";
    TO_FRET_LABEL.disabled = "disabled";
    this.toFretSelect.add(TO_FRET_LABEL);
    for (let i = 0; i <= 24; i++) {
      const TO_FRET_OPTION = document.createElement("option");
      TO_FRET_OPTION.text = i;
      this.toFretSelect.add(TO_FRET_OPTION);
      if (i === PROPS.toFret) {
        TO_FRET_OPTION.selected = true;
      }
    }
    this.toFretSelect.addEventListener("change", () => {
      const FROM_FRET = parseInt(this.fromFretSelect.value);
      const TO_FRET = parseInt(this.toFretSelect.value);
      this.toFretSelect.value = TO_FRET < FROM_FRET ? FROM_FRET : TO_FRET;
    });

    this.modeSelect = document.createElement("select");
    Object.assign(this.modeSelect.style, SELECT_STYLE);
    const MODE_LABEL = document.createElement("option");
    MODE_LABEL.text = "Mode";
    MODE_LABEL.disabled = "disabled";
    this.modeSelect.add(MODE_LABEL);
    const MODE_PLAY_OPTION = document.createElement("option");
    MODE_PLAY_OPTION.text = "Play";
    this.modeSelect.add(MODE_PLAY_OPTION);
    const MODE_EDITONE_OPTION = document.createElement("option");
    MODE_EDITONE_OPTION.text = "Edit One";
    this.modeSelect.add(MODE_EDITONE_OPTION);
    const MODE_EDITALL_OPTION = document.createElement("option");
    MODE_EDITALL_OPTION.text = "Edit All";
    this.modeSelect.add(MODE_EDITALL_OPTION);
    this.modeSelect.value = PROPS.mode;

    this.handSelect = document.createElement("select");
    Object.assign(this.handSelect.style, SELECT_STYLE);
    const HAND_LABEL = document.createElement("option");
    HAND_LABEL.text = "Hand";
    HAND_LABEL.disabled = "disabled";
    this.handSelect.add(HAND_LABEL);
    const HAND_LEFT_OPTION = document.createElement("option");
    HAND_LEFT_OPTION.text = "Left";
    this.handSelect.add(HAND_LEFT_OPTION);
    const HAND_RIGHT_OPTION = document.createElement("option");
    HAND_RIGHT_OPTION.text = "Right";
    this.handSelect.add(HAND_RIGHT_OPTION);
    this.handSelect.value = PROPS.hand;

    this.noteLabelsSelect = getNoteLabelsSelect(
      getLabelsNameFromValue(PROPS.noteLabels)
    );
    Object.assign(this.noteLabelsSelect.style, SELECT_STYLE);

    this.noteColorsSelect = getNoteColorsSelect(
      getNoteColorsNameFromValue(PROPS.noteColors)
    );
    Object.assign(this.noteColorsSelect.style, SELECT_STYLE);

    this.noteSizeSelect = document.createElement("select");
    Object.assign(this.noteSizeSelect.style, SELECT_STYLE);
    const NOTE_SIZE_LABEL = document.createElement("option");
    NOTE_SIZE_LABEL.text = "Note Size";
    NOTE_SIZE_LABEL.disabled = "disabled";
    this.noteSizeSelect.add(NOTE_SIZE_LABEL);
    const NOTE_SIZE_LARGE_OPTION = document.createElement("option");
    NOTE_SIZE_LARGE_OPTION.text = "Large";
    this.noteSizeSelect.add(NOTE_SIZE_LARGE_OPTION);
    const NOTE_SIZE_SMALL_OPTION = document.createElement("option");
    NOTE_SIZE_SMALL_OPTION.text = "Small";
    this.noteSizeSelect.add(NOTE_SIZE_SMALL_OPTION);
    this.noteSizeSelect.value =
      parseInt(PROPS.noteSizes.first) > parseInt(PROPS.noteSizes.second)
        ? "Large"
        : "Small";

    this.noteDurationSelect = document.createElement("select");
    Object.assign(this.noteDurationSelect.style, SELECT_STYLE);
    const NOTE_DURATION_LABEL = document.createElement("option");
    NOTE_DURATION_LABEL.text = "Duration";
    NOTE_DURATION_LABEL.disabled = "disabled";
    this.noteDurationSelect.add(NOTE_DURATION_LABEL);
    const NOTE_DURATION_0_OPTION = document.createElement("option");
    NOTE_DURATION_0_OPTION.text = "Touch";
    NOTE_DURATION_0_OPTION.value = "0";
    this.noteDurationSelect.add(NOTE_DURATION_0_OPTION);
    const NOTE_DURATION_05_OPTION = document.createElement("option");
    NOTE_DURATION_05_OPTION.text = "0.5s";
    NOTE_DURATION_05_OPTION.value = "0.5";
    this.noteDurationSelect.add(NOTE_DURATION_05_OPTION);
    const NOTE_DURATION_1_OPTION = document.createElement("option");
    NOTE_DURATION_1_OPTION.text = "1s";
    NOTE_DURATION_1_OPTION.value = "1";
    this.noteDurationSelect.add(NOTE_DURATION_1_OPTION);
    const NOTE_DURATION_2_OPTION = document.createElement("option");
    NOTE_DURATION_2_OPTION.text = "2s";
    NOTE_DURATION_2_OPTION.value = "2";
    this.noteDurationSelect.add(NOTE_DURATION_2_OPTION);
    const NOTE_DURATION_3_OPTION = document.createElement("option");
    NOTE_DURATION_3_OPTION.text = "3s";
    NOTE_DURATION_3_OPTION.value = "3";
    this.noteDurationSelect.add(NOTE_DURATION_3_OPTION);
    this.noteDurationSelect.value = PROPS.noteDuration;

    this.colorThemeSelect = getColorThemeSelect(
      getColorThemeNameFromValue(PROPS.colorTheme)
    );
    Object.assign(this.colorThemeSelect.style, SELECT_STYLE);
    this.colorThemeSelect.addEventListener("change", (event) => {
      const COLOR_THEME = COLOR_THEMES[event.target.value];
      const CHILD_NODES = this.container.childNodes;
      CHILD_NODES.forEach((node) => {
        node.style.backgroundColor = COLOR_THEME.background;
        node.style.color = COLOR_THEME.foreground;
      });
      this.container.style.backgroundColor = COLOR_THEME.background;
    });

    this.render(this.instrumentSelect);
    this.render(this.rootNoteSelect);
    this.render(this.noteSequenceSelect);
    this.render(this.fromFretSelect);
    this.render(this.toFretSelect);
    this.render(this.modeSelect);
    this.render(this.handSelect);
    this.render(this.noteLabelsSelect);
    this.render(this.noteColorsSelect);
    this.render(this.noteSizeSelect);
    this.render(this.noteDurationSelect);
    this.render(this.colorThemeSelect);
  }
}

export { FretboardMenu };
