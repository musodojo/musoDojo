class SquashyMenuIcon {
  // include units in width and height e.g. "20px", "2em"
  constructor(
    width,
    height,
    foregroundColor = "#000000",
    backgroundColor = "transparent"
  ) {
    this.container = document.createElement("div");
    this.container.style.display = "inline-block";
    this.container.style.cursor = "pointer";
    this.container.style.width = width;
    this.container.style.height = height;
    this.container.style.backgroundColor = backgroundColor;

    this.container.addEventListener(
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

    this.container.appendChild(this.bar1);
    this.container.appendChild(this.bar2);
    this.container.appendChild(this.bar3);
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
    this.container.style.backgroundColor = backgroundColor;
    this.bar1.style.backgroundColor = foregroundColor;
    this.bar2.style.backgroundColor = foregroundColor;
    this.bar3.style.backgroundColor = foregroundColor;
  }
}

export { SquashyMenuIcon };
