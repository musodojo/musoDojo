# Fretboard

- strum mode, which plays nearest large note in direction of nut!
- subtract padding / border from width, height in CSS calc
- update without redrawing, if possible - investigate update() and reset()
- fretboard updateProps(props={}) - runs update/reset as necessary
- changes in freboard height filter to fingerboard + side - grid?
- reset and update should set the colors in colorTheme?
- mode change updates fretboard - keep notes
- change order in renderFretboard - courses last if mode = strum

# Fretboard Menu

- 0-referenced colors, e.g. root is red and 5th is green for all keys
- chrome holds onto pointerdown after a menu selection
- store it's own props, rather than doing reverse lookups on fretboard props
  -- or add more info to fretboard props

# Audio Interface

- HQ audio sprite - violin high note missing
- Mandolin uses guitar audio - needs higher notes

# Other

- investigate storing of this.everything in all mjs files
- extension Label dissapeared on replicate and change key, then sequence
  -- NOTE_SEQUENCES labels overwrite
- add "scenes", e.g. blues, 2-5-1, 4-chord?
- put hide, add, minus panel into a div
- use drag events instead of keeping track of pointerdown id
