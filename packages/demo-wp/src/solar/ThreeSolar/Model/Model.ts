// eslint-disable-next-line max-classes-per-file
import { Mesh } from 'three';
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

enum InteractionMode {
  NONE = 'NONE',
  POSITION = 'POSITION',
  ROTATE = 'ROTATE',
  SCALE = 'SCALE',
}

class Model {
  planScene: Plan | null;
  perspectiveScene: Perspective | null;
  buildings: BuildingModel[];
  selectedBuildingIndex: number;
  mouseIsDown: boolean;
  selectedMesh: Mesh | null;
  listeners: tListener[];
  interaction: InteractionMode;

  constructor() {
    this.planScene = null;
    this.perspectiveScene = null;
    this.buildings = [];
    this.listeners = [];
    this.selectedBuildingIndex = -1;
    this.mouseIsDown = false;
    this.selectedMesh = null;
    this.interaction = InteractionMode.NONE;
  }

  get SelectedBuilding() {
    const { buildings, selectedBuildingIndex } = this;
    if (
      selectedBuildingIndex < 0 ||
      selectedBuildingIndex >= buildings.length
    ) {
      return null;
    }
    return buildings[selectedBuildingIndex];
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

export { BuildingModel, InteractionMode, Model };
