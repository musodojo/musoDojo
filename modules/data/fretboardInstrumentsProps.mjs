import { NOTE_SEQUENCES } from "./noteSequences.mjs";
import { NOTE_COLORS } from "./noteColors.mjs";
import { NOTE_LABELS } from "./noteLabels.mjs";
import { COLOR_THEMES } from "./colorThemes.mjs";

const FRET_MARKERS = {
  "Guitar Style": [3, 5, 7, 9, 12, 15, 17, 19, 21, 24],
  "Mandolin Style": [3, 5, 7, 10, 12, 15, 17, 19, 22, 24],
};

// see Fretboard class's contstructor for porperty explanations
const FRETBOARD_INSTRUMENTS_PROPS = {
  defaults: {
    instrument: "Guitar",
    tuning: [[40], [45], [50], [55], [59], [64]], // EADGBE
    rootNote: 0,
    sequenceName: "Ionian / Major",
    sequence: NOTE_SEQUENCES["Mode"]["Ionian / Major"].sequence,
    fromFret: 0,
    toFret: 24,
    // mode = "Play" || "Edit One" || "Edit All"
    mode: "Play",
    hand: "Right",
    noteLabelsName: "None",
    noteLabels: NOTE_LABELS["None"],
    noteColors: NOTE_COLORS["Muso Dojo"],
    noteSizes: { first: "91%", second: "55%" },
    // noteDuration = -1 means play full note duration in audio sprite
    // noteDuration = 0 means play note until up event occurs
    // noteDuration = x means play note for x seconds (clipped at note's duration in audio sprite)
    noteDuration: 0,
    colorTheme: COLOR_THEMES["Dark"],
    showStrings: true,
    showFrets: true,
    showFretLabels: true,
    showFretboardMarkers: true,
    fretMarkers: FRET_MARKERS["Guitar Style"],
    fingerboardFraction: 0.94,
  },
  instruments: {
    Guitar: {
      instrument: "Guitar",
      tuning: [[40], [45], [50], [55], [59], [64]], // EADGBE
      fromFret: 0,
      toFret: 24,
      showStrings: true,
      showFrets: true,
      fretMarkers: FRET_MARKERS["Guitar Style"],
      showFretLabels: true,
      showFretboardMarkers: true,
    },
    "Guitar DADGAD": {
      instrument: "Guitar",
      tuning: [[38], [45], [50], [55], [57], [62]], // DADGAD
      fromFret: 0,
      toFret: 24,
      showStrings: true,
      showFrets: true,
      fretMarkers: FRET_MARKERS["Guitar Style"],
      showFretLabels: true,
      showFretboardMarkers: true,
    },
    "Guitar DADGBE": {
      instrument: "Guitar",
      tuning: [[38], [45], [50], [55], [59], [64]], // Drop D
      fromFret: 0,
      toFret: 24,
      showStrings: true,
      showFrets: true,
      fretMarkers: FRET_MARKERS["Guitar Style"],
      showFretLabels: true,
      showFretboardMarkers: true,
    },
    Bass: {
      instrument: "Bass",
      tuning: [[28], [33], [38], [43]], // EADG
      fromFret: 0,
      toFret: 24,
      showStrings: true,
      showFrets: true,
      fretMarkers: FRET_MARKERS["Guitar Style"],
      showFretLabels: true,
      showFretboardMarkers: true,
    },
    "Bass 5-String": {
      instrument: "Bass",
      tuning: [[23], [28], [33], [38], [43]], // BEADG
      fromFret: 0,
      toFret: 24,
      showStrings: true,
      showFrets: true,
      fretMarkers: FRET_MARKERS["Guitar Style"],
      showFretLabels: true,
      showFretboardMarkers: true,
    },
    Violin: {
      instrument: "Violin",
      tuning: [[55], [62], [69], [76]], // GDAE
      fromFret: 0,
      toFret: 17,
      showStrings: true,
      showFrets: false,
      fretMarkers: FRET_MARKERS["Guitar Style"],
      showFretLabels: true,
      showFretboardMarkers: false,
    },
    Mandolin: {
      instrument: "Guitar",
      tuning: [
        [55, 55],
        [62, 62],
        [69, 69],
        [76, 76],
      ], // GDAE
      fromFret: 0,
      toFret: 20,
      showStrings: true,
      showFrets: true,
      fretMarkers: FRET_MARKERS["Mandolin Style"],
      showFretLabels: true,
      showFretboardMarkers: true,
    },
    Ukulele: {
      instrument: "Guitar",
      tuning: [[55], [60], [64], [69]], // GCEA
      fromFret: 0,
      toFret: 17,
      showStrings: true,
      showFrets: true,
      fretMarkers: FRET_MARKERS["Mandolin Style"],
      showFretLabels: true,
      showFretboardMarkers: true,
    },
    //DADGBD: [38, 45, 50, 55, 59, 62], // Double Drop D
    //EbAbDbGbBbEb: [39, 44, 49, 54, 58, 63], // Half Step Down
    //DGCFAD: [38, 43, 48, 53, 57, 62], // Whole Step Down
    //DGDGBD: [38, 43, 50, 55, 59, 62], // Open G
    //DGDGBbD: [38, 43, 50, 55, 58, 62], // Open G minor
    //"DADF#AD": [38, 45, 50, 54, 57, 62], // Open D
    //DADFAD: [38, 45, 50, 53, 57, 62], // Open D minor
  },
};

function getFretboardInstrumentNameFromTuning(tuningArray) {
  const VALUE_STRING = JSON.stringify(tuningArray);
  const TUNINGS = Object.entries(FRETBOARD_INSTRUMENTS_PROPS.instruments);
  for (const [INSTRUMENT_NAME, INSTRUMENT_PROPS] of TUNINGS) {
    if (JSON.stringify(INSTRUMENT_PROPS.tuning) === VALUE_STRING) {
      return INSTRUMENT_NAME;
    }
  }
}

function getFretboardInstrumentSelect(selected = "Guitar") {
  const SELECT = document.createElement("select");
  const LABEL = document.createElement("option");
  LABEL.text = "Instrument";
  LABEL.disabled = "disabled";
  SELECT.add(LABEL);
  Object.keys(FRETBOARD_INSTRUMENTS_PROPS.instruments).forEach((instrument) => {
    const OPTION = document.createElement("option");
    OPTION.text = instrument;
    SELECT.add(OPTION);
    if (instrument === selected) {
      OPTION.selected = true;
    }
  });
  return SELECT;
}
export {
  FRETBOARD_INSTRUMENTS_PROPS,
  getFretboardInstrumentNameFromTuning,
  getFretboardInstrumentSelect,
};
