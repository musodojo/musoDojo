import { AudioInterface } from "../audioInterface.mjs";

class FretboardCourseFret {
  constructor(fretboard, courseNum, fretNum) {
    this.fretboard = fretboard;
    this.courseNum = courseNum;
    this.fretNum = fretNum;
    fretboard.checkFretNum(fretNum);
    fretboard.checkCourseNum(courseNum);
    this.midi = this.fretboard.getMidi(this.courseNum, this.fretNum);

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
    // this is stored in 'this' so it can be accessed from FretboardNote
    this.highlighter = document.createElement("div");
    this.highlighter.style.pointerEvents = "none";
    this.highlighter.style.display = "flex";
    this.highlighter.style.justifyContent = "center";
    this.highlighter.style.alignItems = "center";
    this.highlighter.style.width = "98%";
    this.highlighter.style.height = "98%";
    this.highlighter.style.borderRadius = "20%";
    this.fretboardCourseFret.appendChild(this.highlighter);

    fretboard.state.areas[`${courseNum}_${fretNum}`] = this;

    this.addInteractivity();
  }

  pointerDownFunction1(event) {
    if (this.fretboard.state.notes[`${this.courseNum}_${this.fretNum}`])
      this.play();
    const INDEX = this.fretboard.state.pointerDownIds.indexOf(event.pointerId);
    // if id was not found, push it
    if (INDEX < 0) {
      this.fretboard.state.pointerDownIds.push(event.pointerId);
      event.target.releasePointerCapture(event.pointerId);
    }

    if (this.fretboard.props.mode === "Edit One")
      this.fretboard.toggleNote(this.courseNum, this.fretNum);
    else if (this.fretboard.props.mode === "Edit All")
      this.fretboard.togglePitchClass(this.courseNum, this.fretNum);

    // if the note duration is -1 (i.e. play for infinity)
    // we need to handle next pointerdown event differently
    // when hit a second time (i.e. stop note and highlighter)
    if (this.fretboard.props.noteDuration === -1) {
      this.fretboardCourseFret.removeEventListener(
        "pointerdown",
        this.currentPointerDownFunction,
        true
      );

      this.currentPointerDownFunction = this.pointerDownFunction2.bind(this);
      this.fretboardCourseFret.addEventListener(
        "pointerdown",
        this.currentPointerDownFunction,
        true
      );
    }
  }

  pointerDownFunction2() {
    this.fretboard.state.audioBuffers[
      `${this.courseNum}_${this.fretNum}`
    ].forEach((audioBuffer) => {
      AudioInterface.stopNote(audioBuffer);
    });
    this.highlighter.style.backgroundColor = "transparent";
    delete this.fretboard.state.audioBuffers[
      `${this.courseNum}_${this.fretNum}`
    ];

    this.fretboardCourseFret.removeEventListener(
      "pointerdown",
      this.currentPointerDownFunction,
      true
    );

    this.currentPointerDownFunction = this.pointerDownFunction1.bind(this);
    this.fretboardCourseFret.addEventListener(
      "pointerdown",
      this.currentPointerDownFunction,
      true
    );
  }

  addInteractivity() {
    this.currentPointerDownFunction = this.pointerDownFunction1.bind(this);

    this.fretboardCourseFret.addEventListener(
      "pointerdown",
      this.currentPointerDownFunction,
      true
    );

    this.fretboardCourseFret.addEventListener(
      "pointerover",
      (event) => {
        if (this.fretboard.state.pointerDownIds.includes(event.pointerId)) {
          if (this.fretboard.state.notes[`${this.courseNum}_${this.fretNum}`])
            this.play();
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
      this.fretboardCourseFret.addEventListener(
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
    // duration = -1 means play note for infinity (stop event handled externally)
    // duration = 0 means play note until up event occurs (stop event handled externally)
    // duration = x means play note for x seconds

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

    // stores an object {buffer, gain, duration}, which is returned by
    // the AudioInterface, in audioBuffers object
    this.midi.forEach((midiValue, index) => {
      this.fretboard.state.audioBuffers[`${this.courseNum}_${this.fretNum}`][
        index
      ] = AudioInterface.startNote(
        this.fretboard.props.audio,
        midiValue,
        duration,
        index * 0.04 // extra course/string delay - set by ear
      );

      // adds the timeout property to the audioBuffer definition in audioBuffers
      // this can be cleared in the play function
      // the === 0 and === -1 cases are handled by event listeners in the addInteractivity function
      if (duration > 0) {
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
