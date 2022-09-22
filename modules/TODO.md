- audio sprite

  - guitar sound on some notes
  - set loop points
  - infinity seconds selected but no loop points set

- convert data to arrays not objects

- resize event

  - filter back to multitool / include buttons div
  - put show/hide, plus and minus into main menu and minimise to
    just menu icon when hiding

- icons

  - use icons from online
  - replace left/right
  - replace large/small select
  - show/hide menu
  - plus
  - minus

- redesign using web components / Lit

- use -1 for infinity in audioInterface

  - investigate play mechanism in fretboard and fretboardCourseFret
  - two pointerdown functions in FreboardCourseFret - best way?
  - what if another mode is selected while playing - turn off, I suppose!

- display triad and seven chord built off each note, if applicable

- screen interface module to handle all clicks, drags, etc.?

- strum mode

  - plays nearest large note in direction of nut
  - draw courses last if mode = strum?

- bend mode

  - notes can be dragged and pitch changes

- fretboard note emits events (noteOn, noteOff) on interactions

  - relates to Lit's events up, props down ethos
  - linking up to other apps/tools e.g. tabs display/generator

- root-referenced colors

  - e.g. root is red, 5th is green, all else black for all keys
  - note colors and note text colors are customisable

- add "scenes", e.g. blues, 2-5-1, 4-chord, ...
