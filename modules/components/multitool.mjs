import { FretboardMultitool } from "./fretboard/fretboardMultitool.mjs";
import { FRETBOARD_INSTRUMENTS_PROPS } from "../data/fretboardInstrumentsProps.mjs";

class Multitool {
  constructor(props = {}) {
    this.multitool = document.createElement("div");
    this.multitool.style.display = "flex";
    this.multitool.style.flexFlow = "row wrap";
    this.multitool.style.gap = "1em";

    this.props = { ...props };
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
    let tool;
    const PROPS = { ...this.props, ...props };
    switch (PROPS.instrument) {
      case "Guitar":
        tool = new FretboardMultitool({
          ...FRETBOARD_INSTRUMENTS_PROPS.instruments[PROPS.instrument],
          ...PROPS,
        });
        break;
      case "Bass":
        tool = new FretboardMultitool({
          ...FRETBOARD_INSTRUMENTS_PROPS.instruments[PROPS.instrument],
          ...PROPS,
        });
        break;
      case "Violin":
        tool = new FretboardMultitool({
          ...FRETBOARD_INSTRUMENTS_PROPS.instruments[PROPS.instrument],
          ...PROPS,
        });
        break;
      case "Ukulele":
        tool = new FretboardMultitool({
          ...FRETBOARD_INSTRUMENTS_PROPS.instruments[PROPS.instrument],
          ...PROPS,
        });
        break;
      default:
        tool = new FretboardMultitool(PROPS);
    }
    // 200ms is same as css transition time in spinningMinusIcon
    tool.fretboardMultitool.style.opacity = "0.25";
    tool.fretboardMultitool.style.transition = "opacity 0.2s linear";
    this.multitool.appendChild(tool.fretboardMultitool);
    // needs a small delay before resetting css opacity
    // otherwise it doesn't transition
    setTimeout(() => {
      tool.fretboardMultitool.style.opacity = "1";
    }, 20);
  }
}

export { Multitool };
