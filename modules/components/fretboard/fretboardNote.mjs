class FretboardNote {
  constructor(fretboard, courseNum, fretNum, size) {
    this.fretboardNote = document.createElement("div");

    // make it a flex
    this.fretboardNote.style.display = "flex";
    this.fretboardNote.style.alignItems = "center";
    this.fretboardNote.style.justifyContent = "center";

    // fill up the parent FretboardCourseFret
    this.fretboardNote.style.width = "100%";
    this.fretboardNote.style.height = "100%";

    // let pointer events pass through this, past the highlighter div and
    // through to the FretboardsCourseFret
    this.fretboardNote.style.pointerEvents = "none";

    // add a border to increase visibility / contrast
    this.fretboardNote.style.border = `1px solid ${fretboard.props.colorTheme.foreground}`;
    this.fretboardNote.style.borderRadius = "20%";

    this.size = size;

    // set the font details for the potential label
    const WIDTH = fretboard.getFretAreaWidth(fretNum);
    const HEIGHT = `calc(${fretboard.fingerboard.style.height} / ${fretboard.props.tuning.length})`;
    this.fretboardNote.style.fontSize = `min( calc(${HEIGHT} / 2), calc(${WIDTH} / 2) )`;
    this.fretboardNote.style.fontWeight = "bold";
    this.fretboardNote.style.textShadow = `-1px 1px 2px ${fretboard.props.colorTheme.background}, 
    1px 1px 2px ${fretboard.props.colorTheme.background}, 
    1px -1px 2px ${fretboard.props.colorTheme.background}, 
    -1px -1px 2px ${fretboard.props.colorTheme.background}`;
    this.fontColor = fretboard.props.colorTheme.foreground;

    // only deal with the first string in each course
    const MIDI_NUM = fretboard.getMidi(courseNum, fretNum)[0];
    this.noteColor = fretboard.props.noteColors[MIDI_NUM % 12]
      ? fretboard.props.noteColors[MIDI_NUM % 12]
      : fretboard.props.colorTheme.foreground;

    switch (fretboard.props.noteLabels[0]) {
      case "C":
        this.label = fretboard.props.noteLabels[MIDI_NUM % 12];
        break;
      case "<%MIDI%>":
        this.label = MIDI_NUM;
        break;
      default:
        this.label =
          fretboard.props.noteLabels[
            (MIDI_NUM - fretboard.props.rootNote) % 12
          ];
        break;
    }

    // put this note in the correct FretboardCourseFretArea
    fretboard.state.areas[`${courseNum}_${fretNum}`].highlighter.appendChild(
      this.fretboardNote
    );

    // add this note to Fretboard's state
    fretboard.state.notes[`${courseNum}_${fretNum}`] = this;
  }

  get size() {
    return this.fretboardNote.style.width;
  }

  set size(size) {
    this.fretboardNote.style.width = size;
    this.fretboardNote.style.height = size;
  }

  get noteColor() {
    return this.fretboardNote.style.backgroundColor;
  }

  set noteColor(color) {
    this.fretboardNote.style.backgroundColor = color;
  }

  set fontColor(color) {
    this.fretboardNote.style.color = color;
  }

  get fontColor() {
    return this.fretboardNote.style.color;
  }

  set label(label) {
    this.fretboardNote.innerText = label;
  }

  get label() {
    return this.fretboardNote.innerText;
  }
}

export { FretboardNote };
