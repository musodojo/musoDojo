const NOTE_COLORS = {
  "Muso Dojo": [
    "#ED2929",
    "#9F000F",
    "#78C7C7",
    "#00008B",
    "#FF9933",
    "#EBEB19",
    "#286704",
    "#99CC33",
    "#660099",
    "#CC00FF",
    "#BF6A1F",
    "#FF9EE6",
  ],
  Boomwhackers: [
    "#E21C48",
    "#F26622",
    "#F99D1C",
    "#FFCC33",
    "#FFF32B",
    "#BCD85F",
    "#62BC47",
    "#009C95",
    "#0071BB",
    "#5E50A1",
    "#8D5BA6",
    "#CF3E96",
  ],
  White: [
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
  ],
  Gray: [
    "#888888",
    "#888888",
    "#888888",
    "#888888",
    "#888888",
    "#888888",
    "#888888",
    "#888888",
    "#888888",
    "#888888",
    "#888888",
    "#888888",
  ],
  Black: [
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
  ],
};

const isColorValid = (color) => {
  // ^          -> match beginning
  // #          -> a hash symbol
  // [0-9A-F]   -> any integer from 0 to 9 and any letter from A to F
  // {3}){1,2}  -> 3 characters, 1 or 2 times. (3 or 6 letter values)
  // $          -> match end
  // i          -> ignore case
  return /^#([0-9A-F]{3}){1,2}$/i.test(color) ? true : false;
};

const getNoteColorsNameFromValue = (value) => {
  const VALUE_STRING = JSON.stringify(value);
  const COLORS = Object.entries(NOTE_COLORS);
  for (const [COLORS_NAME, COLORS_VALUE] of COLORS) {
    if (JSON.stringify(COLORS_VALUE) === VALUE_STRING) {
      return COLORS_NAME;
    }
  }
};

const getNoteColorsSelect = (selected = "Muso Dojo") => {
  const SELECT = document.createElement("select");
  const LABEL = document.createElement("option");
  LABEL.text = "Note Colors";
  LABEL.disabled = "disabled";
  SELECT.add(LABEL);
  Object.keys(NOTE_COLORS).forEach((colorsOption) => {
    const OPTION = document.createElement("option");
    OPTION.text = colorsOption;
    SELECT.add(OPTION);
    if (colorsOption === selected) {
      OPTION.selected = true;
    }
  });
  return SELECT;
};

export {
  NOTE_COLORS,
  isColorValid,
  getNoteColorsNameFromValue,
  getNoteColorsSelect,
};
