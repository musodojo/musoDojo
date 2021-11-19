const NOTE_SEQUENCES = {
  Modes: {
    "Ionian / Major": {
      sequence: [0, 2, 4, 5, 7, 9, 11],
    },
    Dorian: {
      sequence: [0, 2, 3, 5, 7, 9, 10],
    },
    Phrygian: {
      sequence: [0, 1, 3, 5, 7, 8, 10],
    },
    Lydian: {
      sequence: [0, 2, 4, 6, 7, 9, 11],
      labels: {
        Quality: { 6: "A4" },
        Relative: { 6: "♯4" },
        Extension: { 6: "#11" },
      },
    },
    Mixolydian: {
      sequence: [0, 2, 4, 5, 7, 9, 10],
    },
    "Aeolian / Minor": {
      sequence: [0, 2, 3, 5, 7, 8, 10],
    },
    Locrian: {
      sequence: [0, 1, 3, 5, 6, 8, 10],
    },
  },
  Major: {
    "M / Major": {
      sequence: [0, 4, 7],
    },
    "M6 / Major 6th": {
      sequence: [0, 4, 7, 9],
    },
    "M7 / Major 7th": {
      sequence: [0, 4, 7, 11],
    },
    "M9 / Major 9th": {
      sequence: [0, 2, 4, 7, 11],
      labels: {
        Quality: { 2: "M9" },
        Relative: { 2: "9" },
      },
    },
    "add9 / Major add 9": {
      sequence: [0, 2, 4, 7],
      labels: {
        Quality: { 2: "M9" },
        Relative: { 2: "9" },
      },
    },
    "6/9 / Major 6/9": {
      sequence: [0, 2, 4, 7, 9],
      labels: {
        Quality: { 2: "M9" },
        Relative: { 2: "9" },
      },
    },
  },
  Minor: {
    "m / Minor": {
      sequence: [0, 3, 7],
    },
    "m6 / Minor (maj)6th": {
      sequence: [0, 3, 7, 9],
    },
    "m7 / Minor 7th": {
      sequence: [0, 3, 7, 10],
    },
    "m9 / Minor 9th": {
      sequence: [0, 2, 3, 7, 10],
      labels: {
        Quality: { 2: "M9" },
        Relative: { 2: "9" },
      },
    },
    "m(add9) / Minor add 9": {
      sequence: [0, 2, 3, 7],
      labels: {
        Quality: { 2: "M9" },
        Relative: { 2: "9" },
      },
    },
    "m6/9 / Minor 6/9": {
      sequence: [0, 2, 3, 7, 9],
      labels: {
        Quality: { 2: "M9" },
        Relative: { 2: "9" },
      },
    },
  },
  Dominant: {
    "7 / Dominant 7th": {
      sequence: [0, 4, 7, 10],
    },
    "9 / Dominant 9th": {
      sequence: [0, 2, 4, 7, 10],
      labels: {
        Quality: { 2: "M9" },
        Relative: { 2: "9" },
      },
    },
  },
  Pentatonic: {
    "Major Pentatonic": {
      sequence: [0, 2, 4, 7, 9],
    },
    "Suspended Pentatonic": {
      sequence: [0, 2, 5, 7, 10],
    },
    "Blues Minor Pentatonic": {
      sequence: [0, 3, 5, 8, 10],
    },
    "Blues Major Pentatonic": {
      sequence: [0, 2, 5, 7, 9],
    },
    "Minor Pentatonic": {
      sequence: [0, 3, 5, 7, 10],
    },
    "Dominant Pentatonic": {
      sequence: [0, 2, 4, 7, 10],
    },
  },
  Diminished: {
    "dim / o / Diminished Triad": {
      sequence: [0, 3, 6],
    },
    "dim7 / o7 / Diminished 7th": {
      sequence: [0, 3, 6, 9],
      labels: {
        Quality: { 9: "d7" },
        Relative: { 9: "♭♭7" },
        Extension: { 9: "♭♭7" },
      },
    },
    "m7♭5 / ø7 / Half-Diminished 7th": {
      sequence: [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
      sequence: [0, 3, 6, 10],
    },
    "Whole-Half Diminished": {
      sequence: [0, 2, 3, 5, 6, 8, 9, 11],
      labels: {
        Quality: { 8: "A5" },
        Relative: { 8: "♯5" },
        Extension: { 8: "♯5" },
      },
    },
    "Half-Whole / Dominant Diminished": {
      sequence: [0, 1, 3, 4, 6, 7, 9, 10],
      labels: {
        Quality: { 3: "A2", 6: "A4" },
        Relative: { 3: "♯2", 6: "♯4" },
        Extension: { 3: "♯9", 6: "♯11" },
      },
    },
  },
  Augmented: {
    "aug / + / Augmented Triad": {
      sequence: [0, 4, 8],
      labels: {
        Quality: { 8: "A5" },
        Relative: { 8: "#5" },
        Extension: { 8: "#5" },
      },
    },
    "It+6 / Italian 6th": {
      sequence: [0, 4, 10],
      labels: {
        Quality: { 10: "A6" },
        Relative: { 10: "#6" },
        Extension: { 10: "#13" },
      },
    },
    "Fr+6 / French 6th": {
      sequence: [0, 4, 6, 10],
      labels: {
        Quality: { 10: "A6" },
        Relative: { 10: "#6" },
        Extension: { 10: "#13" },
      },
    },
    "Ger+6 / German 6th": {
      sequence: [0, 4, 7, 10],
      labels: {
        Quality: { 10: "A6" },
        Relative: { 10: "#6" },
        Extension: { 10: "#13" },
      },
    },
    "aug7 / +7 / 7#5 / Augmented Seventh": {
      sequence: [0, 4, 8, 10],
      labels: {
        Quality: { 8: "A5" },
        Relative: { 8: "#5" },
        Extension: { 8: "#5" },
      },
    },
  },
  "Melodic Minor": {
    "Melodic Minor": {
      sequence: [0, 2, 3, 5, 7, 9, 11],
    },
    "Phrygian ♮6 / Dorian ♭2": {
      sequence: [0, 1, 3, 5, 7, 9, 10],
    },
    "Lydian Augmented / Lydian ♯5": {
      sequence: [0, 2, 4, 6, 8, 9, 11],
    },
    "Lydian Dominant / Mixolydian ♯4": {
      sequence: [0, 2, 4, 6, 7, 9, 10],
    },
    "Mixolydian ♭6": {
      sequence: [0, 2, 4, 5, 7, 8, 10],
    },
    "Locrian ♮2 / Half Diminished": {
      sequence: [0, 2, 3, 5, 6, 8, 10],
    },
    "Super Locrian / Altered": {
      sequence: [0, 1, 3, 4, 6, 8, 10],
    },
  },
  "Harmonic Minor": {
    "Harmonic Minor": {
      sequence: [0, 2, 3, 5, 7, 8, 11],
    },
    "Locrian ♯6": {
      sequence: [0, 1, 3, 5, 6, 9, 10],
    },
    "Ionian ♯5": {
      sequence: [0, 2, 4, 5, 8, 9, 11],
    },
    "Dorian ♯4": {
      sequence: [0, 2, 3, 6, 7, 9, 10],
    },
    "Phrygian Dominant": {
      sequence: [0, 1, 4, 5, 7, 8, 10],
    },
    "Lydian ♯2": {
      sequence: [0, 3, 4, 6, 7, 9, 11],
    },
    "Super Locrian ♭♭7": {
      sequence: [0, 1, 3, 4, 6, 8, 9],
    },
  },
  Other: {
    Root: {
      sequence: [0],
    },
    Chromatic: {
      sequence: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    },
    Blank: {
      sequence: [],
    },
    "Root and 5th": {
      sequence: [0, 7],
    },
    Blues: {
      sequence: [0, 3, 5, 6, 7, 10],
    },
    "Whole Tone": {
      sequence: [0, 2, 4, 6, 8, 10],
    },
  },
};

function getSequenceNameFromValue(value) {
  const VALUE_STRING = JSON.stringify(value);
  const GROUPS_VALUES = Object.values(NOTE_SEQUENCES);
  for (const GROUPS_VALUE of GROUPS_VALUES) {
    for (const [SEQUENCE_NAME, SEQUENCE_VALUE] of Object.entries(
      GROUPS_VALUE
    )) {
      if (JSON.stringify(SEQUENCE_VALUE.sequence) === VALUE_STRING) {
        return SEQUENCE_NAME;
      }
    }
  }
}

function getNoteSequenceSelect(selected = "Ionian / Major") {
  const SELECT = document.createElement("select");
  const LABEL = document.createElement("option");
  LABEL.text = "Sequence";
  LABEL.disabled = "disabled";
  SELECT.add(LABEL);
  Object.entries(NOTE_SEQUENCES).forEach(([groupName, groupSequences]) => {
    const OPTGROUP = document.createElement("optgroup");
    OPTGROUP.label = groupName;
    SELECT.add(OPTGROUP);
    Object.keys(groupSequences).forEach((sequenceName) => {
      const OPTION = document.createElement("option");
      OPTION.text = sequenceName;
      OPTGROUP.appendChild(OPTION);
      if (sequenceName === selected) {
        OPTION.selected = true;
      }
    });
  });
  return SELECT;
}

export { NOTE_SEQUENCES, getSequenceNameFromValue, getNoteSequenceSelect };
