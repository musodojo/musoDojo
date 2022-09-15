class FretboardFret {
  constructor(fretboard, fretNum) {
    const FRET = document.createElement("div");
    FRET.style.position = "absolute";
    FRET.style.height = "100%";
    FRET.style.width = `max( calc(${fretboard.props.width}px / 350), 1px)`;
    FRET.style.backgroundColor = fretboard.props.colorTheme.foreground;
    FRET.style[fretboard.props.hand.toLowerCase()] =
      fretboard.getFretDistance(fretNum);

    fretboard.fingerboard.appendChild(FRET);
  }
}

export { FretboardFret };
