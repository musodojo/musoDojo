import { FretboardMultitool } from "./fretboard/fretboardMultitool.mjs";

class Multitool {
  constructor() {
    this.multitool = document.createElement("div");
    this.multitool.style.display = "flex";
    this.multitool.style.flexFlow = "row wrap";
    this.multitool.style.gap = "1em";

    this.multitool.addEventListener("addtool", (event) => {
      // event.detail contains Fretboard.props of the fretboard to be cloned
      this.addTool(event.detail);
    });
    this.multitool.addEventListener("removetool", (event) => {
      const TOOL = event.target;
      // fade out
      TOOL.style.opacity = "0.25";
      // 200ms is same as css transition time in spinningMinusButton
      setTimeout(() => {
        TOOL.remove();
      }, 200);
    });
  }

  addTool(props = {}) {
    // if props is empty, defaults are applied in the FretboardMultitool constructor
    const TOOL = new FretboardMultitool(props);
    // 200ms is same as css transition time in spinningMinusIcon
    TOOL.fretboardMultitool.style.opacity = "0.25";
    TOOL.fretboardMultitool.style.transition = "opacity 0.2s linear";
    this.multitool.appendChild(TOOL.fretboardMultitool);
    // needs a small delay before resetting css opacity
    // otherwise it doesn't transition
    setTimeout(() => {
      TOOL.fretboardMultitool.style.opacity = "1";
    }, 20);
  }
}

export { Multitool };
