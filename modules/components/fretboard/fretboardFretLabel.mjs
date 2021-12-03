class FretboardFretLabel {
  constructor(fretboard, fretNum) {
    const FRET_LABEL = document.createElement("div");
    FRET_LABEL.style.position = "absolute";
    FRET_LABEL.style.width = fretboard.getFretAreaWidth(fretNum);
    FRET_LABEL.style.height = "100%";
    FRET_LABEL.style.top = "0";
    FRET_LABEL.style[fretboard.props.hand.toLowerCase()] =
      fretboard.getFretDistance(fretNum);
    fretboard.side.appendChild(FRET_LABEL);

    // the font size is set on thie label, which can mess up calculations based
    // on "em" units - this is why it has to be a child of the fretboardFretLabel
    // and not just it's innerText
    const LABEL = document.createElement("div");
    LABEL.style.display = "flex";
    LABEL.style.alignItems = "center";
    LABEL.style.justifyContent = "center";
    LABEL.style.width = "100%";
    LABEL.style.height = "100%";
    LABEL.style.fontSize = `calc(${fretboard.side.style.height} * 0.9)`;
    LABEL.innerText = fretNum;
    FRET_LABEL.appendChild(LABEL);
  }
}

export { FretboardFretLabel };
