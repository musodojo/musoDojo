# Fretboard

- update without redrawing, if possible - investigate update() and reset()
- fretboard updateProps(props={}) - runs update/reset as necessary
- reset and update should set the colors in colorTheme?
- mode change updates fretboard - keep notes
- resize mode
  -- resize button in buttonsDiv
- investigate storing of this.everything

# Audio Interface

- HQ audio sprite - violin high note missing
- Mandolin uses guitar audio - needs higher notes

# New Features

- strum mode, which plays nearest large note in direction of nut
  -- draw courses last if mode = strum?
- 0-referenced colors, e.g. root is red and 5th is green for all keys
- add "scenes", e.g. blues, 2-5-1, 4-chord, ...

# Other

- squashyMenuButton not in right place on mobile chrome-based browsers
