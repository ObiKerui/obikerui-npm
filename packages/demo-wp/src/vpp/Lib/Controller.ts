import { createModel, VPPModel } from './Model';
import { PowerRouterD3 } from './PowerRouterD3/PowerRouter';

class Controller {
  model: VPPModel;
  powerRouter: PowerRouterD3;
  notify: ((model: VPPModel) => void) | null;

  constructor() {
    this.model = createModel();
    this.powerRouter = new PowerRouterD3(this.model);
    this.notify = null;
  }

  update() {
    const newModel = this.powerRouter.d3Model;
    this.powerRouter.update(newModel);
  }

  setHTMLRef(ref: HTMLDivElement) {
    const oldModel = this.powerRouter.d3Model;
    const updated = {
      ...oldModel,
      container: ref,
    };
    this.powerRouter.update(updated);
    if (this.notify) this.notify(this.model);
  }
}

export { Controller };
