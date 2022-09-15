class ResizeButton {
  constructor(
    foregroundColor = "#000000",
    backgroundColor = "transparent",
    width = "1.5em",
    height = "1.5em"
  ) {
    this.resizeButton = document.createElement("div");
    this.resizeButton.style.position = "relative";
    this.resizeButton.style.border = "0";
    this.resizeButton.style.cursor = "pointer";
    this.resizeButton.style.width = width;
    this.resizeButton.style.height = height;
    this.resizeButton.style.backgroundColor = backgroundColor;

    this.textDiv = document.createElement("div");
    this.textDiv.style.position = "relative";
    this.textDiv.style.width = `min( calc(${width}), calc(${height}))`;
    this.textDiv.style.height = `min( calc(${width}), calc(${height}))`;
    this.textDiv.style.top = "50%";
    this.textDiv.style.left = "50%";
    this.textDiv.style.transform = "translate(-50%, -50%)";
    this.textDiv.style.transition = "transform 0.2s ease";
    this.resizeButton.appendChild(this.textDiv);

    this.bar = document.createElement("div");
    this.bar.style.position = "absolute";
    this.bar.style.width = "100%";
    this.bar.style.height = `calc(${this.textDiv.style.height} / 5)`;
    this.bar.style.borderRadius = `calc(${this.textDiv.style.height} / 10)`;
    this.bar.style.top = "50%";
    this.bar.style.transform = "translateY(-50%) rotate(45deg)";
    this.bar.style.backgroundColor = foregroundColor;
    this.textDiv.appendChild(this.bar);

    // bottom right arrow head
    this.arrow1 = document.createElement("div");
    this.arrow1.style.position = "absolute";
    this.arrow1.style.width = "0";
    this.arrow1.style.height = "0";
    this.arrow1.style.borderTop = `calc(${this.textDiv.style.height} / 3.5) solid transparent`;
    this.arrow1.style.borderBottom = `calc(${this.textDiv.style.height} / 3.5) solid transparent`;
    this.arrow1.style.borderLeft = `calc(${this.textDiv.style.height} / 3.5) solid ${foregroundColor}`;
    this.arrow1.style.bottom = "0";
    this.arrow1.style.right = "0";
    this.arrow1.style.transform = "translateY(25%) rotate(45deg)";
    this.textDiv.appendChild(this.arrow1);

    // top left arrow head
    this.arrow2 = document.createElement("div");
    this.arrow2.style.position = "absolute";
    this.arrow2.style.width = "0";
    this.arrow2.style.height = "0";
    this.arrow2.style.borderTop = `calc(${this.textDiv.style.height} / 3.5) solid transparent`;
    this.arrow2.style.borderBottom = `calc(${this.textDiv.style.height} / 3.5) solid transparent`;
    this.arrow2.style.borderRight = `calc(${this.textDiv.style.height} / 3.5) solid ${foregroundColor}`;
    this.arrow2.style.top = "0";
    this.arrow2.style.left = "0";
    this.arrow2.style.transform = "translateY(-25%) rotate(45deg)";
    this.textDiv.appendChild(this.arrow2);

    this.resizeButton.addEventListener(
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
    this.textDiv.style.transform === "translate(-50%, -50%)"
      ? (this.textDiv.style.transform = "translate(-50%, -50%) scale(0.5)")
      : (this.textDiv.style.transform = "translate(-50%, -50%)");
  }

  setColorTheme(foregroundColor, backgroundColor = "transparent") {
    this.resizeButton.style.backgroundColor = backgroundColor;
    this.bar.style.backgroundColor = foregroundColor;
    this.arrow1.style.borderLeft = `calc(${this.textDiv.style.height} / 4) solid ${foregroundColor}`;
    this.arrow2.style.borderRight = `calc(${this.textDiv.style.height} / 4) solid ${foregroundColor}`;
  }
}

export { ResizeButton };
