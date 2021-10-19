import { Container } from "./container.mjs";
import { INSTRUMENT_CONFIGS } from "./instrumentConfigs.mjs";
import { FretboardMultitool } from "./fretboardMultitool.mjs";

class Multitool extends Container {
  constructor(props = {}) {
    super();
    this.container.style.display = "flex";
    this.container.style.flexFlow = "row wrap";

    this.props = { ...props };
    this.tools = new Array();
  }

  addTool(props) {
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
    this.tools.push(tool);
    this.render(tool.container);
  }
}

export { Multitool };
