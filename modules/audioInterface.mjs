class AudioInterface {
  static audioSpriteData;
  static audioSprite;
  static context = new (window.AudioContext || window.webkitAudioContext)();

  static async loadAudioSprite(audioSpriteData) {
    try {
      this.audioSpriteData = audioSpriteData;
      const sprite = await fetch(this.audioSpriteData.url);
      const arrayBuffer = await sprite.arrayBuffer();
      this.audioSprite = await this.context.decodeAudioData(arrayBuffer);
    } catch (err) {
      throw err;
    }
  }

  // returns an object containing {midi:..., start:..., duration:...}
  static closestSpriteNote(instrument, note) {
    const MIDI_NUMBERS = this.audioSpriteData[instrument];
    const MIDI_NUMBERS_LENGTH = MIDI_NUMBERS.length;
    for (let i = 0; i < MIDI_NUMBERS_LENGTH; i++) {
      const CURRENT_SPRITE_NOTE = MIDI_NUMBERS[i].midi;
      // if the sprite midi note is bigger than the input note, we've gone far enough
      if (CURRENT_SPRITE_NOTE > note) {
        // if it is the first midi note that is bigger, return that entry
        // because midi notes are in ascending order
        if (i === 0) {
          return MIDI_NUMBERS[0];
        }
        // if not, find out if the input note is closer to the previous sprite midi note
        let previousSpriteNote = MIDI_NUMBERS[i - 1].midi;
        return Math.abs(previousSpriteNote - note) <=
          Math.abs(CURRENT_SPRITE_NOTE - note)
          ? MIDI_NUMBERS[i - 1]
          : MIDI_NUMBERS[i];
      }
    }
    // final case: closest midi note is the last one
    return MIDI_NUMBERS[MIDI_NUMBERS_LENGTH - 1];
  }

  // duration and delay are in seconds
  // note is the MIDI note number
  // duration = -1 means play full note duration in audio sprite
  // duration = 0 means play note until up event occurs (event handled externally)
  // duration = x means play note for x seconds (max = note's duration in audio sprite)
  static startNote(instrument, note, duration = -1, delay = 0) {
    const BUFFER = this.context.createBufferSource();
    const GAIN = this.context.createGain();
    const CLOSEST_SPRITE_NOTE = this.closestSpriteNote(instrument, note);
    BUFFER.buffer = this.audioSprite;
    BUFFER.connect(GAIN).connect(this.context.destination);
    BUFFER.detune.value = (note - CLOSEST_SPRITE_NOTE.midi) * 100;
    // largest detune is an octave = 12 semi-tones = 1200 cents
    if (Math.abs(BUFFER.detune.value) > 1200) {
      throw new RangeError(
        `AudioInterface startNote(note, duration, delay=0): no midi note in sprite is within an octave of ${note}`
      );
    }
    const INIT_VOL = 0.4;
    GAIN.gain.value = INIT_VOL;
    const CURRENT_TIME = this.context.currentTime;
    if (duration <= 0) {
      duration = CLOSEST_SPRITE_NOTE.duration;
    } else if (duration > CLOSEST_SPRITE_NOTE.duration) {
      duration = CLOSEST_SPRITE_NOTE.duration;
    }
    // duration multiplier in ENDISH_TIME and setTargetAtTime set by ear
    // tried not to get an audio blip at end
    const ENDISH_TIME = CURRENT_TIME + delay + duration * 0.6;
    GAIN.gain.setValueAtTime(INIT_VOL, ENDISH_TIME);
    GAIN.gain.setTargetAtTime(0, ENDISH_TIME, duration * 0.05);

    BUFFER.start(CURRENT_TIME + delay, CLOSEST_SPRITE_NOTE.start, duration);
    // return the audio buffer and gain, so it can be stopped
    // and the duration in case it was updated and the new duration is needed
    return [BUFFER, GAIN, duration];
  }

  static stopNote([buffer, gain]) {
    const CURRENT_TIME = this.context.currentTime;
    gain.gain.cancelScheduledValues(0);
    gain.gain.setTargetAtTime(0, CURRENT_TIME, 0.05);
    buffer.stop(CURRENT_TIME + 0.25);
  }
}

export { AudioInterface };
