/* eslint-disable no-console */
import { tCallback, tCallbackData } from '../Lib/sharedTypes';
import { BuildingModel, Model } from '../Model/Model';
import PositionControl from './PositionControl';
import RotateControl from './RotateControl';

import ScaleControl from './ScaleControl';

class Controller {
  // scaleControl: GeometryScaleControl;
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
    if (!model) {
      return;
    }
    model.mouseIsDown = true;

    const selectedBuilding = model.SelectedBuilding;
    if (!selectedBuilding) {
      return;
    }
    this.scaleControl.setBuilding(selectedBuilding);
  }

  handleMouseUp() {
    const { model } = this;
    if (!model) {
      return;
    }
    model.mouseIsDown = false;
    console.log('mouse up called: ', model);
    this.scaleControl.recentre();
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

    // console.log('handle mouse move : ', model);

    // const dragHandleName = model.selectedMesh.name;

    // if (dragHandleName.startsWith('scale')) {
    this.scaleControl.setScale(params);
    // } else if (dragHandleName.startsWith('rotat')) {

    // this.rotateControl.buildingModel = building;
    // this.rotateControl.setRotation(params);

    // }

    // this.positionControl.buildingModel = building;
    // this.positionControl.setPosition(params);
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
    newBuilding.buildingPlan.rotation.rotation.set(0, Math.PI / 4, 0);

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
    model.selectedBuildingIndex = model.buildings.length - 1;
  }
}

export default Controller;
