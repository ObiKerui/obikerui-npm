/* eslint-disable no-console */
import { BuildingModel, Model } from '../Model/Model';
// import CamHandles from '../Handles/CamHandles';
import ElevationControl from './ElevationControl';
import { HandleControl } from '../Handles/BuildingHandles';
import PositionControl from './PositionControl';
import RoofControl from './RoofControl';
import RotateControl from './RotateControl';
import ScaleControl from './ScaleControl';
import DormerModel from '../Dormers/Model';

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
  // elevationHandles: CamHandles;
  handleControl: HandleControl;
  elevationControl: ElevationControl;

  model: Model | null;
  constructor() {
    this.scaleControl = new ScaleControl();
    this.rotateControl = new RotateControl();
    this.positionControl = new PositionControl();
    this.roofControl = new RoofControl();
    this.handleControl = new HandleControl();
    // this.elevationHandles = new CamHandles();
    this.elevationControl = new ElevationControl();
    this.model = null;
  }

  // willBeSelectBuilding(buildingId: string) {
  // willBeSelectBuilding() {
  //   const { model, elevationHandles } = this;
  //   if (!model) {
  //     return;
  //   }

  //   const { elevationScene } = model;
  //   if (!elevationScene) {
  //     return;
  //   }

  //   // model.selectedBuildingId = buildingId;
  //   // const selected = model.SelectedBuilding;

  //   // if (!selected) {
  //   //   return;
  //   // }

  //   // set the selected building to the index
  //   // selected.buildingPlan.addHandles(this.handleControl);

  //   // elevationHandles.building = selected;
  //   // elevationHandles.camera = elevationScene.camera;
  //   // selected.buildingElev.camHandles = elevationHandles;
  //   // selected.buildingElev.addCamHandles(elevationHandles);

  //   elevationScene.hudScene.add(elevationHandles.roofTopLevel.handle);
  //   elevationScene.hudScene.add(elevationHandles.roofBottomLevel.handle);

  //   // add elevation scene mouse controls
  //   const { mouseControls } = elevationScene;
  //   if (!mouseControls) {
  //     return;
  //   }

  //   mouseControls.objects = [
  //     elevationHandles.roofBottomLevel.handle,
  //     elevationHandles.roofTopLevel.handle,
  //   ];
  // }

  addBuilding() {
    // :TODO need to add in the placer logic
    const { model, handleControl } = this;

    if (!model) {
      throw new Error('Model not assigned!');
    }

    const { elevationHandles } = model;

    const { planScene, perspectiveScene, elevationScene } = model;
    if (!planScene || !perspectiveScene || !elevationScene) {
      throw new Error('Scenes not assigned!');
    }

    // add to model
    const nth = model.structuresMap.size;
    const structureId = `structure-${nth}`;
    const newBuilding = new BuildingModel(structureId);
    model.structuresMap.set(structureId, newBuilding);
    model.selectedStructureId = structureId;

    // add the object plan to the scene
    newBuilding.buildingPlan.addHandles(handleControl);
    planScene.scene.add(newBuilding.buildingPlan.transform);

    // add the object elevation to the scene
    elevationHandles.building = newBuilding;
    elevationHandles.camera = elevationScene.camera;
    newBuilding.buildingElev.camHandles = elevationHandles;
    newBuilding.buildingElev.addCamHandles(elevationHandles);
    elevationScene.scene.add(newBuilding.buildingElev.transform);
    elevationScene.hudScene.add(elevationHandles.roofTopLevel.handle);
    elevationScene.hudScene.add(elevationHandles.roofBottomLevel.handle);

    // add the object perspective to the scene
    perspectiveScene.scene.add(newBuilding.buildingPersp.transform);

    // add plan scene mouse controls
    const { mouseControls } = planScene;
    if (!mouseControls) {
      throw new Error('Plan scene has no Mouse Controls!');
    }

    const structures = Array.from(model.structuresMap.values());
    const structureHandles = structures.map(({ Handle }) => Handle);

    const handles = handleControl.handlesArray.map(
      ({ handleObject }) => handleObject
    );

    mouseControls.objects = [...handles, ...structureHandles];

    // add the elevation sceen mouse controls
    const { mouseControls: elevControls } = elevationScene;
    if (!elevControls) {
      throw new Error('Elevation scene has no mouse controls!');
    }

    elevControls.objects = [
      elevationHandles.roofBottomLevel.handle,
      elevationHandles.roofTopLevel.handle,
    ];
  }

  addDormer() {
    const { model, handleControl } = this;
    if (!model) {
      throw new Error('Model Not Defined');
    }
    const { planScene, perspectiveScene, elevationScene } = model;
    if (!planScene || !perspectiveScene || !elevationScene) {
      throw new Error('Scenes Not Defined');
    }

    // how many buildings
    const nth = model.structuresMap.size;
    const structureId = `structure-${nth}`;
    const newDormer = new DormerModel(structureId);

    newDormer.dormerPlan.addHandles(this.handleControl);

    planScene.scene.add(newDormer.dormerPlan.transform);
    perspectiveScene.scene.add(newDormer.dormerPersp.transform);
    elevationScene.scene.add(newDormer.dormerElev.transform);

    model.structuresMap.set(structureId, newDormer);
    // model.selectedBuildingId = buildingId;

    // this.willBeSelectBuilding(newBuilding.id);

    // add plan scene mouse controls
    const { mouseControls } = planScene;
    if (!mouseControls) {
      return;
    }

    const structures = Array.from(model.structuresMap.values());
    const structureHandles = structures.map(({ Handle }) => Handle);

    const handles = handleControl.handlesArray.map(
      ({ handleObject }) => handleObject
    );

    mouseControls.objects = [...handles, ...structureHandles];
  }
}

export default Controller;
