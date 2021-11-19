const COLOR_THEMES = {
  Dark: {
    background: "#000000",
    midground: "#999999",
    foreground: "#FFFFFF",
  },
  Medium: {
    background: "#CCCCCC",
    midground: "#888888",
    foreground: "#000000",
  },
  Light: {
    background: "#FFFFFF",
    midground: "#888888",
    foreground: "#000000",
  },
};

function getColorThemeNameFromValue(value) {
  const VALUE_STRING = JSON.stringify(value);
  const THEMES = Object.entries(COLOR_THEMES);
  for (const [THEME_NAME, THEME_VALUE] of THEMES) {
    if (JSON.stringify(THEME_VALUE) === VALUE_STRING) {
      return THEME_NAME;
    }
  }
}

function getColorThemeSelect(selected = "Dark") {
  const SELECT = document.createElement("select");
  const LABEL = document.createElement("option");
  LABEL.text = "Theme";
  LABEL.disabled = "disabled";
  SELECT.add(LABEL);
  Object.keys(COLOR_THEMES).forEach((colorTheme) => {
    const OPTION = document.createElement("option");
    OPTION.text = colorTheme;
    SELECT.add(OPTION);
    if (colorTheme === selected) {
      OPTION.selected = true;
    }
  });
  return SELECT;
}

export { COLOR_THEMES, getColorThemeNameFromValue, getColorThemeSelect };
