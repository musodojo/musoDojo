class SpinningPlusIcon {
  // include units in width and height e.g. "20px", "2em"
  constructor(
    width,
    height,
    foregroundColor = "#000000",
    backgroundColor = "transparent"
  ) {
    this.container = document.createElement("div");
    this.container.style.position = "relative";
    this.container.style.display = "inline-block";
    this.container.style.cursor = "pointer";
    this.container.style.width = width;
    this.container.style.height = height;
    this.container.style.backgroundColor = backgroundColor;
    this.container.style.color = foregroundColor;

    this.textDiv = document.createElement("div");
    this.textDiv.style.position = "relative";
    this.textDiv.style.width = `min( calc(${width} * 0.8), calc(${height} * 0.8))`;
    this.textDiv.style.height = `min( calc(${width} * 0.8), calc(${height} * 0.8))`;
    this.textDiv.style.top = "50%";
    this.textDiv.style.left = "50%";
    this.textDiv.style.transform = "translate(-50%, -50%)";
    this.textDiv.style.transition = "transform 0.2s ease";
    this.textDiv.addEventListener("transitionend", () => {
      this.textDiv.style.transform = "translate(-50%, -50%)";
    });
    this.container.appendChild(this.textDiv);

    this.bar1 = document.createElement("div");
    this.bar1.style.position = "absolute";
    this.bar1.style.width = `calc(${this.textDiv.style.width} / 5)`;
    this.bar1.style.height = "100%";
    this.bar1.style.left = "50%";
    this.bar1.style.transform = "translateX(-50%)";
    this.bar1.style.backgroundColor = foregroundColor;
    this.textDiv.appendChild(this.bar1);

    this.bar2 = document.createElement("div");
    this.bar2.style.position = "absolute";
    this.bar2.style.width = "100%";
    this.bar2.style.height = `calc(${this.textDiv.style.height} / 5)`;
    this.bar2.style.top = "50%";
    this.bar2.style.transform = "translateY(-50%)";
    this.bar2.style.backgroundColor = foregroundColor;
    this.textDiv.appendChild(this.bar2);

    this.container.addEventListener(
      "pointerdown",
      () => {
        this.toggle();
      },
      {
        capture: true,
      }
    );
  }

  toggle() {
    this.textDiv.style.transform = "translate(-50%, -50%) rotate(45deg)";
  }

  setColorTheme(foregroundColor, backgroundColor = "transparent") {
    this.container.style.backgroundColor = backgroundColor;
    this.bar1.style.backgroundColor = foregroundColor;
    this.bar2.style.backgroundColor = foregroundColor;
  }
}

export { SpinningPlusIcon };
