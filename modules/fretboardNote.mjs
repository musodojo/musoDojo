import { Container } from "./container.mjs";

class FretboardNote extends Container {
  constructor(
    size, // a percentage to be applied to parent div's width and height e.g. 90%
    parentWidth, // include units e.g. 50px, 1em
    parentHeight, // include units e.g. 50px, 1em
    colorTheme,
    backgroundColor,
    label = ""
  ) {
    super();
    this.size = size;
    this.backgroundColor = backgroundColor;
    this.fontColor = colorTheme.foreground;
    this.label = label;
    this.container.style.zIndex = "2";
    this.container.style.fontSize = `min( calc(${parentHeight} / 2), calc(${parentWidth} / 3) )`;
    this.container.style.fontWeight = "bold";
    this.container.style.textShadow = `-1px 1px 2px ${colorTheme.background}, 1px 1px 2px ${colorTheme.background}, 1px -1px 2px ${colorTheme.background}, -1px -1px 2px ${colorTheme.background}`;
    this.container.style.border = `1px solid ${colorTheme.foreground}`;
    this.container.style.borderRadius = "20%";
    this.container.style.pointerEvents = "none";
    this.container.style.display = "flex";
    this.container.style.justifyContent = "center";
    this.container.style.alignItems = "center";
  }

  get size() {
    return this.container.style.width;
  }

  set size(size) {
    this.container.style.width = size;
    this.container.style.height = size;
  }

  get backgroundColor() {
    return this.container.style.backgroundColor;
  }

  set backgroundColor(color) {
    this.container.style.backgroundColor = color;
  }

  set fontColor(color) {
    this.container.style.color = color;
  }

  get fontColor() {
    return this.container.style.color;
  }

  set label(label) {
    this.container.innerText = label;
  }

  get label() {
    return this.container.innerText;
  }
}

export { FretboardNote };
