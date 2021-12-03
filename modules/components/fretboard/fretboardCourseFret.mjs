import { AudioInterface } from "../audioInterface.mjs";

class FretboardCourseFret {
  constructor(fretboard, courseNum, fretNum) {
    this.fretboard = fretboard;
    this.courseNum = courseNum;
    this.fretNum = fretNum;

    fretboard.checkFretNum(fretNum);
    fretboard.checkCourseNum(courseNum);

    this.fretboardCourseFret = document.createElement("div");

    this.fretboardCourseFret.style.cursor = "pointer";

    this.fretboardCourseFret.style.position = "absolute";
    this.fretboardCourseFret.style.display = "flex";
    this.fretboardCourseFret.style.justifyContent = "center";
    this.fretboardCourseFret.style.alignItems = "center";

    this.fretboardCourseFret.style.width = fretboard.getFretAreaWidth(fretNum);

    this.fretboardCourseFret.style.height = `calc(${fretboard.fingerboard.style.height} / ${fretboard.props.tuning.length})`;

    // are passed in lowest=1 to highest, but strings are traditionally
    // labelled with highest=1
    this.fretboardCourseFret.style.top = `calc(( (${courseNum} - 1) / ${fretboard.props.tuning.length}) *
      ${fretboard.fingerboard.style.height})`;

    this.fretboardCourseFret.style[fretboard.props.hand.toLowerCase()] =
      fretboard.getFretDistance(fretNum);

    fretboard.fingerboard.appendChild(this.fretboardCourseFret);

    // add a highlighter div, which can be used to highlight an interaction
    this.highlighter = document.createElement("div");
    this.highlighter.style.pointerEvents = "none";
    this.highlighter.style.display = "flex";
    this.highlighter.style.justifyContent = "center";
    this.highlighter.style.alignItems = "center";
    this.highlighter.style.width = "97%";
    this.highlighter.style.height = "97%";
    this.highlighter.style.borderRadius = "20%";
    this.fretboardCourseFret.appendChild(this.highlighter);

    fretboard.state.areas[`${courseNum}_${fretNum}`] = this;

    this.addInteractivity();
  }

  addInteractivity() {
    this.fretboardCourseFret.addEventListener(
      "pointerdown",
      (event) => {
        if (this.fretboard.state.notes[`${this.courseNum}_${this.fretNum}`])
          this.fretboard.play(this.courseNum, this.fretNum);
        this.fretboard.state.pointerDownIds.push(event.pointerId);
        event.target.releasePointerCapture(event.pointerId);
        if (this.fretboard.props.mode === "Edit One")
          this.fretboard.toggleNote(this.courseNum, this.fretNum);
        else if (this.fretboard.props.mode === "Edit All")
          this.fretboard.togglePitchClass(this.courseNum, this.fretNum);
      },
      true
    );

    this.fretboardCourseFret.addEventListener(
      "pointerover",
      (event) => {
        if (this.fretboard.state.pointerDownIds.includes(event.pointerId)) {
          if (this.fretboard.state.notes[`${this.courseNum}_${this.fretNum}`])
            this.fretboard.play(this.courseNum, this.fretNum);
          if (this.fretboard.props.mode === "Edit One")
            this.fretboard.toggleNote(this.courseNum, this.fretNum);
          else if (this.fretboard.props.mode === "Edit All")
            this.fretboard.togglePitchClass(this.courseNum, this.fretNum);
        }
      },
      true
    );

    this.fretboardCourseFret.addEventListener(
      "pointerup",
      (event) => {
        // pointer id will already be removed by the FreboardMultitool
        // if the Fretboard is inside a FreboardMultitool
        const INDEX = this.fretboard.state.pointerDownIds.indexOf(
          event.pointerId
        );
        if (INDEX >= 0) {
          this.fretboard.state.pointerDownIds.splice(INDEX, 1);
        }
      },
      true
    );

    // if the note duration is 0 (i.e. play for touched duration)
    // we need to handle up and leave events separately
    if (this.fretboard.props.noteDuration === 0) {
      this.fretboardCourseFret.addEventListener(
        "pointerup",
        () => {
          if (
            this.fretboard.state.audioBuffers[
              `${this.courseNum}_${this.fretNum}`
            ]
          ) {
            AudioInterface.stopNote(
              this.fretboard.state.audioBuffers[
                `${this.courseNum}_${this.fretNum}`
              ]
            );
            this.highlighter.style.backgroundColor = "transparent";
            delete this.fretboard.state.audioBuffers[
              `${this.courseNum}_${this.fretNum}`
            ];
          }
        },
        true
      );
      this.fretboardCourseFret.addEventListener(
        "pointerleave",
        () => {
          if (
            this.fretboard.state.audioBuffers[
              `${this.courseNum}_${this.fretNum}`
            ]
          ) {
            AudioInterface.stopNote(
              this.fretboard.state.audioBuffers[
                `${this.courseNum}_${this.fretNum}`
              ]
            );
            this.highlighter.style.backgroundColor = "transparent";
            delete this.fretboard.state.audioBuffers[
              `${this.courseNum}_${this.fretNum}`
            ];
          }
        },
        true
      );
    }
  }

  play(duration = this.fretboard.props.duration) {
    // duration = -1 means play full note duration in audio sprite
    // duration = 0 means play note until up event occurs (event handled externally)
    // duration = x means play note for x seconds (max = note's duration in audio sprite)

    // clear the previous timeout if the note is currently active
    if (
      this.fretboard.state.audioBuffers[`${this.courseNum}_${this.fretNum}`]
    ) {
      clearTimeout(
        this.fretboard.state.audioBuffers[`${this.courseNum}_${this.fretNum}`]
          .timeout
      );
    }

    // stores an object {buffer, gain, noteDuration} in audioBuffers object
    // the noteDuration can be updated by AudioInterface.startNote
    // if noteDuration = 0
    // OR if noteDuration > sprite note's full duration
    this.fretboard.state.audioBuffers[`${this.courseNum}_${this.fretNum}`] =
      AudioInterface.startNote(
        this.fretboard.props.instrument,
        this.fretboard.getMidi(this.courseNum, this.fretNum),
        duration
      );

    this.highlighter.style.backgroundColor =
      this.fretboard.props.colorTheme.foreground;

    // the === 0 case is handled by event listeners in the fretboardCourseFretNote
    // adds the timeout property to the audioBuffer definition in audioBuffers
    if (duration !== 0) {
      this.fretboard.state.audioBuffers[
        `${this.courseNum}_${this.fretNum}`
      ].timeout = setTimeout(() => {
        this.highlighter.style.backgroundColor = "transparent";
        delete this.fretboard.state.audioBuffers[
          `${this.courseNum}_${this.fretNum}`
        ];
      }, this.fretboard.state.audioBuffers[`${this.courseNum}_${this.fretNum}`].duration * 1000);
    }
  }
}

export { FretboardCourseFret };
