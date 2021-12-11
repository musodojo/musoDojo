class FretboardCourse {
  constructor(fretboard, courseNum) {
    const COURSE = document.createElement("div");
    COURSE.style.position = "absolute";
    COURSE.style.display = "flex";
    COURSE.style.flexDirection = "column";
    COURSE.style.justifyContent = "center";

    const COURSE_HEIGHT = `calc(${fretboard.fingerboard.style.height} / ${fretboard.props.tuning.length})`;
    const STRING_HEIGHT = `max(calc(${COURSE_HEIGHT} / 25), 1px)`;
    COURSE.style.gap = STRING_HEIGHT;

    COURSE.style.top = `calc(${COURSE_HEIGHT} * (${courseNum}))`;
    COURSE.style.width = "100%";
    COURSE.style.height = COURSE_HEIGHT;

    fretboard.fingerboard.appendChild(COURSE);

    fretboard.props.tuning[courseNum].forEach(() => {
      const STRING = document.createElement("div");
      STRING.style.backgroundColor = fretboard.props.colorTheme.foreground;
      STRING.style.height = STRING_HEIGHT;
      COURSE.appendChild(STRING);
    });
  }
}

export { FretboardCourse };
