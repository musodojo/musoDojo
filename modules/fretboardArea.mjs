import { Container } from "./container.mjs";

class FretboardArea extends Container {
  // include units in width and height e.g. "20px", "2em"
  constructor(width, height) {
    super();
    this.container.style.position = "absolute";
    this.container.style.width = width;
    this.container.style.height = height;
    this.container.style.display = "flex";
    this.container.style.justifyContent = "center";
    this.container.style.alignItems = "center";

    this.backgroundDiv = document.createElement("div");
    this.backgroundDiv.style.position = "absolute";
    this.backgroundDiv.style.zIndex = "1";
    this.backgroundDiv.style.width = "99%";
    this.backgroundDiv.style.height = "99%";
    this.backgroundDiv.style.borderRadius = "20%";
    this.render(this.backgroundDiv);
  }

  set backgroundDivColor(color) {
    this.backgroundDiv.style.backgroundColor = color;
  }
}

export { FretboardArea };
