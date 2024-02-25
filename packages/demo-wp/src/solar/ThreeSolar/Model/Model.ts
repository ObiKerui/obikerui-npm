// eslint-disable-next-line max-classes-per-file
import BuildingPlan from '../Buildings/Plan';
import Plan from '../Scenes/Plan';
import Perspective from '../Scenes/Perspective';

class BuildingModel {
  buildingPlan: BuildingPlan;
  constructor() {
    this.buildingPlan = new BuildingPlan();
  }
}

type tListener = (newModel: BuildingModel[]) => void;

class Model {
  planScene: Plan | null;
  perspectiveScene: Perspective | null;
  buildings: BuildingModel[];
  listeners: tListener[];

  constructor() {
    // this.planScene = new THREE.Scene();
    this.planScene = null;
    this.perspectiveScene = null;
    this.buildings = [];
    this.listeners = [];
  }

  notifyListeners() {
    this.listeners.forEach((listener) => {
      listener(this.buildings);
    });
  }

  addBuilding() {
    // const newBuilding = new BuildingModel();
    // this.buildings.push(newBuilding);

    // this.planScene.add(newBuilding.buildingPlan.transform);
    // this.planScene.

    // this.perspectiveScene.add(cube);

    this.notifyListeners();
  }
}

export { BuildingModel, Model };
