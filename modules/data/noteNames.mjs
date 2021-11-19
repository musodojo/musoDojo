const NOTE_NAMES = [
  "C / C♮ / D♭♭ / B♯",
  "D♭ / C♯ / B♯♯",
  "D / D♮ / E♭♭ / C♯♯",
  "E♭ / F♭♭ / D♯",
  "E / E♮ / F♭ / D♯♯",
  "F / F♮ / G♭♭ / E♯",
  "G♭ / F♯ / E♯♯",
  "G / G♮ / A♭♭ / F♯♯",
  "A♭ / G♯",
  "A / A♮ / B♭♭ / G♯♯",
  "B♭ / C♭♭ / A♯",
  "B / B♮ / C♭ / A♯♯",
];

function getNoteNamesSelect(selected = NOTE_NAMES[0]) {
  const SELECT = document.createElement("select");
  const LABEL = document.createElement("option");
  LABEL.text = "Root";
  LABEL.disabled = "disabled";
  SELECT.add(LABEL);
  NOTE_NAMES.forEach((name) => {
    const OPTION = document.createElement("option");
    OPTION.text = name;
    SELECT.add(OPTION);
    if (name === selected) {
      OPTION.selected = true;
    }
  });
  return SELECT;
}

function getNameFromIndex(index) {
  return NOTE_NAMES[Math.abs(index % 12)];
}

function getIndexFromName(name) {
  let index = NOTE_NAMES.indexOf(name);
  if (index < 0) {
    index = NOTE_NAMES.findIndex((element) => element.split(" / ").includes(name)
    );
    // if findIndex of partial name match is invalid (===-1), throw an error
    if (index < 0) {
      throw new Error(
        `NoteNames getIndexFromName(name): unknown name = ${name}`
      );
    }
  }
  return index;
}

export { NOTE_NAMES, getNoteNamesSelect, getNameFromIndex, getIndexFromName };
