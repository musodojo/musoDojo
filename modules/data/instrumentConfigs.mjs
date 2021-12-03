import { FRETBOARD_TUNINGS } from "./fretboardTunings.mjs";
import { NOTE_SEQUENCES } from "./noteSequences.mjs";
import { NOTE_COLORS } from "./noteColors.mjs";
import { NOTE_LABELS } from "./noteLabels.mjs";
import { COLOR_THEMES } from "./colorThemes.mjs";

const FRET_MARKERS = {
  "Guitar Style": [3, 5, 7, 9, 12, 15, 17, 19, 21, 24],
  "Ukulele Style": [3, 5, 7, 10, 12, 15],
};

const INSTRUMENT_CONFIGS = {
  defaults: {
    instrument: "Guitar",
    tuning: FRETBOARD_TUNINGS["Guitar"],
    rootNote: 0,
    sequence: NOTE_SEQUENCES["Modes"]["Ionian / Major"].sequence,
    fromFret: 0,
    toFret: 21,
    // mode = "Play" || "Edit One" || "Edit All"
    mode: "Play",
    hand: "Right",
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
      tuning: FRETBOARD_TUNINGS["Guitar"],
      fromFret: 0,
      toFret: 21,
      showStrings: true,
      showFrets: true,
      fretMarkers: FRET_MARKERS["Guitar Style"],
      showFretLabels: true,
      showFretboardMarkers: true,
    },
    "Guitar DADGAD": {
      instrument: "Guitar",
      tuning: FRETBOARD_TUNINGS["Guitar DADGAD"],
      fromFret: 0,
      toFret: 21,
      showStrings: true,
      showFrets: true,
      fretMarkers: FRET_MARKERS["Guitar Style"],
      showFretLabels: true,
      showFretboardMarkers: true,
    },
    "Guitar DADGBE": {
      instrument: "Guitar",
      tuning: FRETBOARD_TUNINGS["Guitar DADGBE"],
      fromFret: 0,
      toFret: 21,
      showStrings: true,
      showFrets: true,
      fretMarkers: FRET_MARKERS["Guitar Style"],
      showFretLabels: true,
      showFretboardMarkers: true,
    },
    Bass: {
      instrument: "Bass",
      tuning: FRETBOARD_TUNINGS["Bass"],
      fromFret: 0,
      toFret: 21,
      showStrings: true,
      showFrets: true,
      fretMarkers: FRET_MARKERS["Guitar Style"],
      showFretLabels: true,
      showFretboardMarkers: true,
    },
    Violin: {
      instrument: "Violin",
      tuning: FRETBOARD_TUNINGS["Violin"],
      fromFret: 0,
      toFret: 17,
      showStrings: true,
      showFrets: false,
      fretMarkers: FRET_MARKERS["Guitar Style"],
      showFretLabels: true,
      showFretboardMarkers: false,
    },
    Ukulele: {
      instrument: "Guitar",
      tuning: FRETBOARD_TUNINGS["Ukulele"],
      fromFret: 0,
      toFret: 17,
      showStrings: true,
      showFrets: true,
      fretMarkers: FRET_MARKERS["Ukulele Style"],
      showFretLabels: true,
      showFretboardMarkers: true,
    },
    Mandolin: {
      instrument: "Guitar",
      tuning: FRETBOARD_TUNINGS["Violin"],
      fromFret: 0,
      toFret: 20,
      showStrings: true,
      showFrets: true,
      fretMarkers: FRET_MARKERS["Ukulele Style"],
      showFretLabels: true,
      showFretboardMarkers: true,
    },
  },
};

export { INSTRUMENT_CONFIGS };
