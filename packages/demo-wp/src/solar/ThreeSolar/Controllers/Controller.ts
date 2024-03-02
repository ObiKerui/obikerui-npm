/* eslint-disable no-console */
import { tCallback, tCallbackData } from '../Lib/sharedTypes';
import { BuildingModel, InteractionMode, Model } from '../Model/Model';
import PositionControl from './PositionControl';
import RotateControl from './RotateControl';

import ScaleControl from './ScaleControl';

class Controller {
  scaleControl: ScaleControl;
  rotateControl: RotateControl;
  positionControl: PositionControl;

  model: Model | null;
  onMouseDown: tCallback;
  onMouseUp: tCallback;
  onMouseMove: tCallback;

  constructor() {
    this.scaleControl = new ScaleControl();
    this.rotateControl = new RotateControl();
    this.positionControl = new PositionControl();
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

    const selectedBuilding = model.SelectedBuilding;

    if (!selectedBuilding) {
      return;
    }

    if (object.name === 'rotate-building') {
      model.interaction = InteractionMode.ROTATE;
      this.rotateControl.setBuilding(selectedBuilding, params);
      console.log('rot - interaction mode... ', model);
      return;
    }

    if (object.name === 'perimeter') {
      model.interaction = InteractionMode.POSITION;
      this.positionControl.setBuilding(selectedBuilding, params);
      console.log('move - interaction mode... ', model);
      return;
    }

    console.log('what is it? ', object);

    if (object.name.startsWith('scale')) {
      model.interaction = InteractionMode.SCALE;
      this.scaleControl.setBuilding(selectedBuilding);
      console.log('scale - interaction mode: ', model);
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
    mouseControls.objects = [
      ...newBuilding.buildingPlan.scaleHandles,
      newBuilding.buildingPlan.perimeter,
    ];

    model.buildings.push(newBuilding);
    model.selectedBuildingIndex = model.buildings.length - 1;
  }
}

export default Controller;
