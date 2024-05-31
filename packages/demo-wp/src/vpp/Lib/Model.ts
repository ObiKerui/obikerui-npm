import PowerRouterScene from './Scene';

class VPPModel {
  powerRouterScene: PowerRouterScene;

  constructor() {
    this.powerRouterScene = new PowerRouterScene();
  }
}

function createModel() {
  return new VPPModel();
}

export { VPPModel, createModel };
