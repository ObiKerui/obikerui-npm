import { VPPModel } from './Model';

class PowerRouter {
  model: VPPModel;
  constructor(model: VPPModel) {
    this.model = model;
  }

  update() {
    console.log('update the power router...', this.model);
  }
}

export { PowerRouter };
