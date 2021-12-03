class FretboardCourse {
  constructor(fretboard, courseNum) {
    const COURSE = document.createElement("div");
    COURSE.style.position = "absolute";
    COURSE.style.display = "flex";
    COURSE.style.alignItems = "center";

    // assume each string area is equal in height
    const HEIGHT = `calc(${fretboard.fingerboard.style.height} / ${fretboard.props.tuning.length})`;
    COURSE.style.top = `calc(${HEIGHT} * (${courseNum} - 1))`;
    COURSE.style.width = "100%";
    COURSE.style.height = HEIGHT;

    fretboard.fingerboard.appendChild(COURSE);

    const STRING = document.createElement("div");
    STRING.style.backgroundColor = fretboard.props.colorTheme.foreground;
    STRING.style.width = "100%";
    STRING.style.height = `max(calc(${HEIGHT} / 20), 1px)`;

    COURSE.appendChild(STRING);
  }
}

export { FretboardCourse };
