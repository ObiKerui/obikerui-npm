/* eslint-disable no-console */
import { BuildingModel, Model } from './Model';

class Controller {
  model: Model | null;

  constructor() {
    this.model = null;
  }

  addBuilding() {
    // :TODO need to add in the placer logic

    const { model } = this;

    if (!model || !model.planScene || !model.perspectiveScene) {
      return;
    }

    const { planScene, perspectiveScene } = model;
    if (!planScene || !perspectiveScene) {
      return;
    }

    const newBuilding = new BuildingModel();
    planScene.scene.add(newBuilding.buildingPlan.transform);

    const { mouseControls } = planScene;
    if (!mouseControls) {
      return;
    }

    // this should be more like set active handles - only 1 set of drag-handles active at any one
    // time, that of the selected building plan
    // - but we still need to be able to click on a building plan and select that one
    mouseControls.objects = newBuilding.buildingPlan.scaleHandles;
    console.log('mouse controls objs: ', mouseControls);

    model.buildings.push(newBuilding);
  }
}

export default Controller;
