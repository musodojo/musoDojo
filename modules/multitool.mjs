import { Container } from "./container.mjs";
import { INSTRUMENT_CONFIGS } from "./data/instrumentConfigs.mjs";
import { FretboardMultitool } from "./fretboardMultitool.mjs";

class Multitool extends Container {
  constructor(props = {}) {
    super();
    this.container.style.display = "flex";
    this.container.style.flexFlow = "row wrap";
    this.props = { ...props };
    this.container.addEventListener("addtool", (event) => {
      // event.detail contains Fretboard.props of the fretboard to be cloned
      this.addTool(event.detail);
    });
    this.container.addEventListener("removetool", (event) => {
      const TOOL = event.target;
      // fade out
      TOOL.style.opacity = "0.25";
      // 200ms is same as css transition time in spinningMinusIcon
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
          ...INSTRUMENT_CONFIGS.instruments[PROPS.instrument],
          ...PROPS,
        });
        break;
      case "Bass":
        tool = new FretboardMultitool({
          ...INSTRUMENT_CONFIGS.instruments[PROPS.instrument],
          ...PROPS,
        });
        break;
      case "Violin":
        tool = new FretboardMultitool({
          ...INSTRUMENT_CONFIGS.instruments[PROPS.instrument],
          ...PROPS,
        });
        break;
      case "Ukulele":
        tool = new FretboardMultitool({
          ...INSTRUMENT_CONFIGS.instruments[PROPS.instrument],
          ...PROPS,
        });
        break;
      default:
        tool = new FretboardMultitool(PROPS);
    }
    tool.container.style.margin = "1em";
    // 200ms is same as css transition time in spinningMinusIcon
    tool.container.style.opacity = "0.25";
    tool.container.style.transition = "opacity 0.2s linear";
    this.render(tool.container);
    // needs a small delay before resetting css opacity
    // otherwise it doesn't transition
    setTimeout(() => {
      tool.container.style.opacity = "1";
    }, 20);
  }
}

export { Multitool };
