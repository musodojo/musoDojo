class MenuButton {
  constructor(
    foregroundColor = "#000000",
    backgroundColor = "transparent",
    width = "1.7em",
    height = "1.5em"
  ) {
    this.menuButton = document.createElement("div");
    this.menuButton.style.position = "relative";
    this.menuButton.style.border = "0";
    this.menuButton.style.cursor = "pointer";
    this.menuButton.style.width = width;
    this.menuButton.style.height = height;
    this.menuButton.style.backgroundColor = backgroundColor;

    this.menuButton.addEventListener(
      "pointerdown",
      () => {
        this.toggle();
      },
      {
        capture: true,
      }
    );

    // each bar is 1/7th of height and each margin is 1/7th
    // because there are 7 margins + bars in total
    // note: margins don't sum in between bars
    // the bar backgroundColor is to actually be the text color!
    const BAR_STYLE = {
      width: `calc(${width})`,
      height: `calc(${height} / 5)`,
      "border-radius": `calc(${height} / 10)`,
      "background-color": foregroundColor,
      transition: "transform 0.2s ease",
    };

    this.bar1 = document.createElement("div");
    Object.assign(this.bar1.style, BAR_STYLE);
    this.bar1.style.marginBottom = `calc(${height} / 5)`;
    this.bar2 = document.createElement("div");
    Object.assign(this.bar2.style, BAR_STYLE);
    this.bar2.style.marginBottom = `calc(${height} / 5)`;
    this.bar3 = document.createElement("div");
    Object.assign(this.bar3.style, BAR_STYLE);

    this.menuButton.appendChild(this.bar1);
    this.menuButton.appendChild(this.bar2);
    this.menuButton.appendChild(this.bar3);
  }

  toggle() {
    // check if transform proprty exists
    if (this.bar2.style.transform) {
      Object.assign(this.bar2.style, { transform: "" });
      Object.assign(this.bar3.style, { transform: "" });
    } else {
      const DIST = this.bar1.style.height;
      Object.assign(this.bar2.style, {
        transform: `translateY(calc(-2 * (${DIST})))`,
      });
      Object.assign(this.bar3.style, {
        transform: `translateY(calc(-4 * (${DIST})))`,
      });
    }
  }

  setColorTheme(foregroundColor, backgroundColor = "transparent") {
    this.menuButton.style.backgroundColor = backgroundColor;
    this.bar1.style.backgroundColor = foregroundColor;
    this.bar2.style.backgroundColor = foregroundColor;
    this.bar3.style.backgroundColor = foregroundColor;
  }
}

export { MenuButton };
