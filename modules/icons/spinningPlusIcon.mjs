class SpinningPlusIcon {
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
    this.textDiv.style.width = `min( calc(${width}), calc(${height}))`;
    this.textDiv.style.height = `min( calc(${width}), calc(${height}))`;
    this.textDiv.style.top = "50%";
    this.textDiv.style.left = "50%";
    this.textDiv.style.transform = "translate(-50%, -50%)";
    this.textDiv.style.transition = "transform 0.2s ease";
    this.button.appendChild(this.textDiv);

    this.bar1 = document.createElement("div");
    this.bar1.style.position = "absolute";
    this.bar1.style.width = `calc(${this.textDiv.style.width} / 5)`;
    this.bar1.style.height = "100%";
    this.bar1.style.borderRadius = `calc(${this.textDiv.style.width} / 10)`;
    this.bar1.style.left = "50%";
    this.bar1.style.transform = "translateX(-50%)";
    this.bar1.style.backgroundColor = foregroundColor;
    this.textDiv.appendChild(this.bar1);

    this.bar2 = document.createElement("div");
    this.bar2.style.position = "absolute";
    this.bar2.style.width = "100%";
    this.bar2.style.height = `calc(${this.textDiv.style.height} / 5)`;
    this.bar2.style.borderRadius = `calc(${this.textDiv.style.height} / 10)`;
    this.bar2.style.top = "50%";
    this.bar2.style.transform = "translateY(-50%)";
    this.bar2.style.backgroundColor = foregroundColor;
    this.textDiv.appendChild(this.bar2);

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
    this.textDiv.style.transform = "translate(-50%, -50%) rotate(45deg)";
    // 0.2s in this.textDiv.style.transition = 200ms in setTimeout in toggle function
    setTimeout(() => {
      this.textDiv.style.transform = "translate(-50%, -50%)";
    }, 200);
  }

  setColorTheme(foregroundColor, backgroundColor = "transparent") {
    this.button.style.backgroundColor = backgroundColor;
    this.bar1.style.backgroundColor = foregroundColor;
    this.bar2.style.backgroundColor = foregroundColor;
  }
}

export { SpinningPlusIcon };
