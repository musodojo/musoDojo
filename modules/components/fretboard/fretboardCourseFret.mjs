import { AudioInterface } from "../audioInterface.mjs";

class FretboardCourseFret {
  constructor(fretboard, courseNum, fretNum) {
    this.fretboard = fretboard;
    this.courseNum = courseNum;
    this.fretNum = fretNum;
    fretboard.checkFretNum(fretNum);
    fretboard.checkCourseNum(courseNum);
    this.midi = this.fretboard.getMidi(this.courseNum, this.fretNum);

    const COURSE_FRET = document.createElement("div");
    COURSE_FRET.style.cursor = "pointer";
    COURSE_FRET.style.position = "absolute";
    COURSE_FRET.style.display = "flex";
    COURSE_FRET.style.justifyContent = "center";
    COURSE_FRET.style.alignItems = "center";

    COURSE_FRET.style.width = fretboard.getFretAreaWidth(fretNum);

    COURSE_FRET.style.height = `calc(${fretboard.fingerboard.style.height} / ${fretboard.props.tuning.length})`;

    // are passed in lowest=1 to highest, but strings are traditionally
    // labelled with highest=1
    COURSE_FRET.style.top = `calc(( (${courseNum} - 1) / ${fretboard.props.tuning.length}) *
      ${fretboard.fingerboard.style.height})`;

    COURSE_FRET.style[fretboard.props.hand.toLowerCase()] =
      fretboard.getFretDistance(fretNum);

    fretboard.fingerboard.appendChild(COURSE_FRET);

    // add a highlighter div, which can be used to highlight an interaction
    // this is stored in 'this' so it can be accessed from FretboardNote
    this.highlighter = document.createElement("div");
    this.highlighter.style.pointerEvents = "none";
    this.highlighter.style.display = "flex";
    this.highlighter.style.justifyContent = "center";
    this.highlighter.style.alignItems = "center";
    this.highlighter.style.width = "98%";
    this.highlighter.style.height = "98%";
    this.highlighter.style.borderRadius = "20%";
    COURSE_FRET.appendChild(this.highlighter);

    fretboard.state.areas[`${courseNum}_${fretNum}`] = this;

    this.addInteractivity(COURSE_FRET);
  }

  addInteractivity(COURSE_FRET) {
    COURSE_FRET.addEventListener(
      "pointerdown",
      (event) => {
        if (this.fretboard.state.notes[`${this.courseNum}_${this.fretNum}`])
          this.fretboard.play(this.courseNum, this.fretNum);
        const INDEX = this.fretboard.state.pointerDownIds.indexOf(
          event.pointerId
        );
        // if id was not found, push it
        if (INDEX < 0) {
          this.fretboard.state.pointerDownIds.push(event.pointerId);
          event.target.releasePointerCapture(event.pointerId);
        }
        // this.fretboard.state.pointerDownIds.push(event.pointerId);
        // event.target.releasePointerCapture(event.pointerId);
        if (this.fretboard.props.mode === "Edit One")
          this.fretboard.toggleNote(this.courseNum, this.fretNum);
        else if (this.fretboard.props.mode === "Edit All")
          this.fretboard.togglePitchClass(this.courseNum, this.fretNum);
      },
      true
    );

    COURSE_FRET.addEventListener(
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

    COURSE_FRET.addEventListener(
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
      COURSE_FRET.addEventListener(
        "pointerup",
        () => {
          if (
            this.fretboard.state.audioBuffers[
              `${this.courseNum}_${this.fretNum}`
            ]
          ) {
            this.fretboard.state.audioBuffers[
              `${this.courseNum}_${this.fretNum}`
            ].forEach((audioBuffer) => {
              AudioInterface.stopNote(audioBuffer);
            });
            this.highlighter.style.backgroundColor = "transparent";
            delete this.fretboard.state.audioBuffers[
              `${this.courseNum}_${this.fretNum}`
            ];
          }
        },
        true
      );
      COURSE_FRET.addEventListener(
        "pointerleave",
        () => {
          if (
            this.fretboard.state.audioBuffers[
              `${this.courseNum}_${this.fretNum}`
            ]
          ) {
            this.fretboard.state.audioBuffers[
              `${this.courseNum}_${this.fretNum}`
            ].forEach((audioBuffer) => {
              AudioInterface.stopNote(audioBuffer);
            });
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

  play(duration = this.fretboard.props.noteDuration) {
    // duration = -1 means play full note duration in audio sprite
    // duration = 0 means play note until up event occurs (event handled externally)
    // duration = x means play note for x seconds (max = note's duration in audio sprite)

    // clear the previous timeout if the note is currently active
    if (
      this.fretboard.state.audioBuffers[`${this.courseNum}_${this.fretNum}`]
    ) {
      this.fretboard.state.audioBuffers[
        `${this.courseNum}_${this.fretNum}`
      ].forEach((audioBuffer) => {
        clearTimeout(audioBuffer.timeout);
      });
    }

    // inisitalize the audioBuffer here for a course/fret
    // makes sure it doesn't return undefined when accessed
    // in forEach below, resulting in undefined[index]
    this.fretboard.state.audioBuffers[`${this.courseNum}_${this.fretNum}`] = [];

    // stores an object {buffer, gain, noteDuration} in audioBuffers object
    // the noteDuration can be updated by AudioInterface.startNote
    // if noteDuration = 0
    // OR if noteDuration > sprite note's full duration
    this.midi.forEach((midiValue, index) => {
      this.fretboard.state.audioBuffers[`${this.courseNum}_${this.fretNum}`][
        index
      ] = AudioInterface.startNote(
        this.fretboard.props.instrument,
        midiValue,
        duration,
        index * 0.04 // set by ear
      );
      // adds the timeout property to the audioBuffer definition in audioBuffers
      // this can be cleared in the play function
      // the === 0 case is handled by event listeners in the addInteractivity function
      if (duration !== 0) {
        this.fretboard.state.audioBuffers[`${this.courseNum}_${this.fretNum}`][
          index
        ].timeout = setTimeout(() => {
          this.highlighter.style.backgroundColor = "transparent";
          delete this.fretboard.state.audioBuffers[
            `${this.courseNum}_${this.fretNum}`
          ];
        }, this.fretboard.state.audioBuffers[`${this.courseNum}_${this.fretNum}`][index].duration * 1000);
      }
    });

    this.highlighter.style.backgroundColor =
      this.fretboard.props.colorTheme.foreground;
  }
}

export { FretboardCourseFret };
