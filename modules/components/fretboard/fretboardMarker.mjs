class FretboardMarker {
  constructor(fretboard, fretNum) {
    const FRET_AREA = document.createElement("div");

    // make it a flex
    FRET_AREA.style.display = "flex";
    FRET_AREA.style.alignItems = "center";
    FRET_AREA.style.justifyContent = "center";

    FRET_AREA.style.position = "absolute";
    FRET_AREA.style.width = fretboard.getFretAreaWidth(fretNum);
    FRET_AREA.style.height = "100%";
    FRET_AREA.style.top = 0;
    FRET_AREA.style[fretboard.props.hand.toLowerCase()] =
      fretboard.getFretDistance(fretNum);
    fretboard.fingerboard.appendChild(FRET_AREA);

    const MARKER = document.createElement("div");
    MARKER.style.width = "60%";
    MARKER.style.height = "65%";
    MARKER.style.backgroundColor = fretboard.props.colorTheme.midground;
    switch (fretboard.props.hand.toLowerCase()) {
      case "right":
        MARKER.style.clipPath = `polygon(0 0, 100% 6%, 100% 94%, 0 100%)`;
        break;
      case "left":
        MARKER.style.clipPath = `polygon(100% 0, 0 6%, 0 94%, 100% 100%)`;
        break;
    }
    FRET_AREA.appendChild(MARKER);
  }
}

export { FretboardMarker };
