class SpinningMinusButton {
  constructor(
    foregroundColor = "#000000",
    backgroundColor = "transparent",
    width = "1.5em",
    height = "1.5em"
  ) {
    this.button = document.createElement("button");
    this.button.style.position = "relative";
    this.button.style.border = "0";
    this.button.style.cursor = "pointer";
    this.button.style.width = width;
    this.button.style.height = height;
    this.button.style.backgroundColor = backgroundColor;

    this.textDiv = document.createElement("div");
    this.textDiv.style.position = "relative";
    this.textDiv.style.width = `min( ${width}, ${height})`;
    this.textDiv.style.height = `min( ${width}, ${height})`;
    this.textDiv.style.top = "50%";
    this.textDiv.style.left = "50%";
    this.textDiv.style.transform = "translate(-50%, -50%)";
    // 0.2s in this.textDiv.style.transition = 200ms in setTimeout in toggle function
    this.textDiv.style.transition = "transform 0.2s ease";
    this.button.appendChild(this.textDiv);

    this.bar = document.createElement("div");
    this.bar.style.position = "absolute";
    this.bar.style.width = "100%";
    this.bar.style.height = `calc(${this.textDiv.style.height} / 5)`;
    this.bar.style.borderRadius = `calc(${this.textDiv.style.height} / 10)`;
    this.bar.style.top = "50%";
    this.bar.style.transform = "translateY(-50%)";
    this.bar.style.backgroundColor = foregroundColor;
    this.textDiv.appendChild(this.bar);

    this.button.addEventListener(
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
    this.button.style.backgroundColor = backgroundColor;
    this.bar.style.backgroundColor = foregroundColor;
  }
}

export { SpinningMinusButton };
