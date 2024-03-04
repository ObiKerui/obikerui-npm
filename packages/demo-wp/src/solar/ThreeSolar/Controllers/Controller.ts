/* eslint-disable no-console */
import { tCallback, tCallbackData } from '../Lib/sharedTypes';
import { BuildingModel, InteractionMode, Model } from '../Model/Model';
import Handles from './Handles';
import PositionControl from './PositionControl';
import RoofControl from './RoofControl';
import RotateControl from './RotateControl';
import ScaleControl from './ScaleControl';

const regex = /id-\d+/;

function extractId(name: string) {
  const matchArray: RegExpMatchArray | null = name.match(regex);

  if (matchArray !== null) {
    const extractedValue: string = matchArray[0];
    return extractedValue;
  }
  return null;
}

class Controller {
  scaleControl: ScaleControl;
  rotateControl: RotateControl;
  positionControl: PositionControl;
  roofControl: RoofControl;
  handleControl: Handles;

  model: Model | null;
  onMouseDown: tCallback;
  onMouseUp: tCallback;
  onMouseMove: tCallback;

  constructor() {
    this.scaleControl = new ScaleControl();
    this.rotateControl = new RotateControl();
    this.positionControl = new PositionControl();
    this.roofControl = new RoofControl();
    this.handleControl = new Handles();
    this.model = null;

    this.onMouseDown = (params) => {
      this.handleMouseDown(params);
    };
    this.onMouseUp = () => {
      this.handleMouseUp();
    };
    this.onMouseMove = (params) => {
      this.handleMouseMove(params);
    };
  }

  handleMouseDown(params: tCallbackData) {
    const { model } = this;
    const { object } = params.eventData;
    if (!model || !object) {
      return;
    }
    model.mouseIsDown = true;

    const { name } = object;

    if (name.startsWith('perimeter')) {
      const id = extractId(name);
      if (!id) {
        return;
      }
      this.selectBuilding(id);
    }

    // set the selected building
    const selectedBuilding = model.SelectedBuilding;

    if (!selectedBuilding) {
      return;
    }

    if (object.name === 'rotate-building') {
      model.interaction = InteractionMode.ROTATE;
      this.rotateControl.setBuilding(selectedBuilding, params);
      return;
    }

    if (object.name.startsWith('perimeter')) {
      model.interaction = InteractionMode.POSITION;
      this.positionControl.setBuilding(selectedBuilding, params);
      return;
    }

    if (object.name.startsWith('scale')) {
      model.interaction = InteractionMode.SCALE;
      this.scaleControl.setBuilding(selectedBuilding);
      return;
    }

    if (object.name.startsWith('move')) {
      model.interaction = InteractionMode.ADJUST_ROOF;
      this.roofControl.setBuilding(selectedBuilding, params);
    }
  }

  handleMouseUp() {
    const { model } = this;
    if (!model) {
      return;
    }
    model.mouseIsDown = false;

    if (model.interaction === InteractionMode.SCALE) {
      this.scaleControl.recentre();
    }
    model.interaction = InteractionMode.NONE;
  }

  handleMouseMove(params: tCallbackData) {
    const { model } = this;

    if (!model) {
      return;
    }
    const building = model.SelectedBuilding;
    if (!building || !model.mouseIsDown) {
      return;
    }

    if (model.interaction === InteractionMode.POSITION) {
      this.positionControl.setPosition(params);
      return;
    }

    if (model.interaction === InteractionMode.ROTATE) {
      this.rotateControl.setRotation(params);
      return;
    }

    if (model.interaction === InteractionMode.SCALE) {
      this.scaleControl.setScale(params);
    }

    if (model.interaction === InteractionMode.ADJUST_ROOF) {
      this.roofControl.setPosition(params);
    }
  }

  selectBuilding(buildingId: string) {
    const { model } = this;

    if (!model) {
      return;
    }

    model.selectedBuildingId = buildingId;
    const selected = model.SelectedBuilding;

    if (!selected) {
      return;
    }

    // set the selected building to the index
    selected.buildingPlan.addHandles(this.handleControl);
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

    // how many buildings
    const nth = model.buildingsMap.size;
    const buildingId = `id-${nth}`;
    const newBuilding = new BuildingModel(buildingId);

    newBuilding.buildingPlan.addHandles(this.handleControl);

    planScene.scene.add(newBuilding.buildingPlan.transform);
    perspectiveScene.scene.add(newBuilding.buildingPersp.transform);

    const { mouseControls } = planScene;
    if (!mouseControls) {
      return;
    }

    model.buildingsMap.set(buildingId, newBuilding);
    model.selectedBuildingId = buildingId;

    const buildings = Array.from(model.buildingsMap.values());
    const perimeters = buildings.map(
      (building) => building.buildingPlan.perimeter
    );

    mouseControls.objects = [...this.handleControl.handlesArray, ...perimeters];
  }
}

export default Controller;
