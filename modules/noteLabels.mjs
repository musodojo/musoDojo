const NOTE_LABELS = {
  None: ["", "", "", "", "", "", "", "", "", "", "", ""],
  "Pitch Class (♯)": [
    "C",
    "C♯",
    "D",
    "D♯",
    "E",
    "F",
    "F♯",
    "G",
    "G♯",
    "A",
    "A♯",
    "B",
  ],
  "Pitch Class (♭)": [
    "C",
    "D♭",
    "D",
    "E♭",
    "E",
    "F",
    "G♭",
    "G",
    "A♭",
    "A",
    "B♭",
    "B",
  ],
  Quality: [
    "P1",
    "m2",
    "M2",
    "m3",
    "M3",
    "P4",
    "d5",
    "P5",
    "m6",
    "M6",
    "m7",
    "M7",
  ],
  Relative: ["1", "♭2", "2", "♭3", "3", "4", "♭5", "5", "♭6", "6", "♭7", "7"],
  Extension: [
    "1",
    "♭9",
    "9",
    "♭3",
    "3",
    "11",
    "♭5",
    "5",
    "♭13",
    "13",
    "♭7",
    "7",
  ],
  MIDI: [
    "<%MIDI%>",
    "<%MIDI%>",
    "<%MIDI%>",
    "<%MIDI%>",
    "<%MIDI%>",
    "<%MIDI%>",
    "<%MIDI%>",
    "<%MIDI%>",
    "<%MIDI%>",
    "<%MIDI%>",
    "<%MIDI%>",
    "<%MIDI%>",
  ],
  "Moveable Do": [
    "Do",
    "Ra",
    "Re",
    "Me",
    "Mi",
    "Fa",
    "Fi",
    "Sol",
    "Le",
    "La",
    "Te",
    "Ti",
  ],
  "Moveable La": [
    "La",
    "Te",
    "Ti",
    "Do",
    "Di",
    "Re",
    "Me",
    "Mi",
    "Fa",
    "Fi",
    "Sol",
    "Si",
  ],
};

const getLabelsNameFromValue = (value) => {
  const VALUE_STRING = JSON.stringify(value);
  const LABELS = Object.entries(NOTE_LABELS);
  for (const [LABELS_NAME, LABELS_VALUE] of LABELS) {
    if (JSON.stringify(LABELS_VALUE) === VALUE_STRING) {
      return LABELS_NAME;
    }
  }
};

const getNoteLabelsSelect = (selected = "None") => {
  const SELECT = document.createElement("select");
  const LABEL = document.createElement("option");
  LABEL.text = "Note Labels";
  LABEL.disabled = "disabled";
  SELECT.add(LABEL);
  Object.keys(NOTE_LABELS).forEach((label) => {
    const OPTION = document.createElement("option");
    OPTION.text = label;
    SELECT.add(OPTION);
    if (label === selected) {
      OPTION.selected = true;
    }
  });
  return SELECT;
};

export { NOTE_LABELS, getLabelsNameFromValue, getNoteLabelsSelect };
