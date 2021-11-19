const FRETBOARD_TUNINGS = {
  // tuning is an array of the fretboard's open strings' midi notes
  // listed from lowest string to highest
  Guitar: [40, 45, 50, 55, 59, 64], // EADGBE
  "Guitar DADGAD": [38, 45, 50, 55, 57, 62], // DADGAD
  "Guitar DADGBE": [38, 45, 50, 55, 59, 64], // Drop D
  Bass: [28, 33, 38, 43], // EADG
  Violin: [55, 62, 69, 76], // GDAE
  Ukulele: [55, 60, 64, 69], // GCEA
  Mandolin: [55, 62, 69, 76], // GDAE
  //DADGBD: [38, 45, 50, 55, 59, 62], // Double Drop D
  //EbAbDbGbBbEb: [39, 44, 49, 54, 58, 63], // Half Step Down
  //DGCFAD: [38, 43, 48, 53, 57, 62], // Whole Step Down
  //DGDGBD: [38, 43, 50, 55, 59, 62], // Open G
  //DGDGBbD: [38, 43, 50, 55, 58, 62], // Open G minor
  //"DADF#AD": [38, 45, 50, 54, 57, 62], // Open D
  //DADFAD: [38, 45, 50, 53, 57, 62], // Open D minor
};

function getFretboardTuningNameFromValue(value) {
  const VALUE_STRING = JSON.stringify(value);
  const TUNINGS = Object.entries(FRETBOARD_TUNINGS);
  for (const [TUNING_NAME, TUNING_VALUE] of TUNINGS) {
    if (JSON.stringify(TUNING_VALUE) === VALUE_STRING) {
      return TUNING_NAME;
    }
  }
}

function getFretboardTuningSelect(selected = "Guitar") {
  const SELECT = document.createElement("select");
  const LABEL = document.createElement("option");
  LABEL.text = "Instrument";
  LABEL.disabled = "disabled";
  SELECT.add(LABEL);
  Object.keys(FRETBOARD_TUNINGS).forEach((instrument) => {
    const OPTION = document.createElement("option");
    OPTION.text = instrument;
    SELECT.add(OPTION);
    if (instrument === selected) {
      OPTION.selected = true;
    }
  });
  return SELECT;
}

export {
  FRETBOARD_TUNINGS,
  getFretboardTuningNameFromValue,
  getFretboardTuningSelect,
};
