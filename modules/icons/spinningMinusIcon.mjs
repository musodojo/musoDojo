class SpinningMinusIcon {
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

    this.textDiv = document.createElement("div");
    this.textDiv.style.position = "relative";
    this.textDiv.style.width = `min( calc(${width} * 0.8), calc(${height} * 0.8))`;
    this.textDiv.style.height = `min( calc(${width} * 0.8), calc(${height} * 0.8))`;
    this.textDiv.style.top = "50%";
    this.textDiv.style.left = "50%";
    this.textDiv.style.transform = "translate(-50%, -50%)";
    // 0.2s in this.textDiv.style.transition = 200ms in setTimeout in toggle function
    this.textDiv.style.transition = "transform 0.2s ease";
    this.container.appendChild(this.textDiv);

    this.bar = document.createElement("div");
    this.bar.style.position = "absolute";
    this.bar.style.width = "100%";
    this.bar.style.height = `calc(${this.textDiv.style.height} / 5)`;
    this.bar.style.borderRadius = `calc(${this.textDiv.style.height} / 10)`;
    this.bar.style.top = "50%";
    this.bar.style.transform = "translateY(-50%)";
    this.bar.style.backgroundColor = foregroundColor;
    this.textDiv.appendChild(this.bar);

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
    this.textDiv.style.transform = "translate(-50%, -50%) rotate(-45deg)";
    // 0.2s in this.textDiv.style.transition = 200ms in setTimeout in toggle function
    setTimeout(() => {
      this.textDiv.style.transform = "translate(-50%, -50%)";
    }, 200);
  }

  setColorTheme(foregroundColor, backgroundColor = "transparent") {
    this.container.style.backgroundColor = backgroundColor;
    this.bar.style.backgroundColor = foregroundColor;
  }
}

export { SpinningMinusIcon };
