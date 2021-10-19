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

const getColorThemeSelect = (selected = "Dark") => {
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
};

export { COLOR_THEMES, getColorThemeSelect };
