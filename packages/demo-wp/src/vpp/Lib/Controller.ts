import {
  VPPModel,
  tPowerNode,
  darkThemedNode,
  lightThemedNode,
  lightThemedLine,
  darkThemedLine,
} from './PowerRouterD3/Model';
import { PowerRouterD3 } from './PowerRouterD3/PowerRouter';

class ThemeController {
  model: VPPModel;
  constructor(model: VPPModel) {
    this.model = model;
  }

  update() {
    const { theme, powerNodeMap, powerLines } = this.model.modelData;

    const nodes = powerNodeMap;
    Array.from(nodes.keys()).forEach((key) => {
      const node = nodes.get(key);
      const updatedNode = {
        ...node,
        ...(theme === 'light' ? lightThemedNode : darkThemedNode),
      } as tPowerNode;
      nodes.set(key, updatedNode);
    });

    const newLines = powerLines.map((line) => {
      const updated = {
        ...line,
        ...(theme === 'light' ? lightThemedLine : darkThemedLine),
      };
      return updated;
    });
    this.model.modelData.powerLines = newLines;
  }

  updateTheme(theme: 'light' | 'dark') {
    const { modelData } = this.model;
    modelData.theme = theme;
  }
}

class Controller {
  model: VPPModel;
  themeController: ThemeController;
  powerRouter: PowerRouterD3;
  notify: ((model: VPPModel) => void) | null;

  constructor() {
    this.model = new VPPModel();
    this.themeController = new ThemeController(this.model);
    this.powerRouter = new PowerRouterD3(this.model);
    this.notify = null;
  }

  update() {
    this.themeController.update();
    this.powerRouter.update();
  }

  setHTMLRef(ref: HTMLDivElement) {
    const oldModel = this.model.modelData;
    const updated = {
      ...oldModel,
      container: ref,
    };
    this.model.modelData = updated;

    if (this.notify) this.notify(this.model);
  }
}

export { Controller };
