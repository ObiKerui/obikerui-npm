/* eslint-disable no-console */
import { BuildingModel, Model } from '../Model/Model';
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
  model: Model | null;

  constructor() {
    this.model = null;
  }

  addBuilding() {
    // :TODO need to add in the placer logic
    const { model } = this;

    if (!model) {
      throw new Error('Model not assigned!');
    }

    const { elevationHandles, handleControl } = model;

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
    planScene.scene.add(newBuilding.buildingPlan.structureBase.transform);

    // add the object elevation to the scene
    elevationHandles.building = newBuilding;
    elevationHandles.camera = elevationScene.camera;
    newBuilding.buildingElev.camHandles = elevationHandles;
    newBuilding.buildingElev.addCamHandles(elevationHandles);
    elevationScene.scene.add(newBuilding.buildingElev.structureBase.transform);
    elevationScene.hudScene.add(elevationHandles.roofTopLevel.handle);
    elevationScene.hudScene.add(elevationHandles.roofBottomLevel.handle);

    // add the object perspective to the scene
    perspectiveScene.scene.add(
      newBuilding.buildingPersp.structureBase.transform
    );

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
    const { model } = this;

    console.log('create dormer...');

    if (!model) {
      throw new Error('Model Not Defined');
    }
    const { planScene, perspectiveScene, elevationScene, handleControl } =
      model;
    if (!planScene || !perspectiveScene || !elevationScene) {
      throw new Error('Scenes Not Defined');
    }

    // how many buildings
    const nth = model.structuresMap.size;
    const structureId = `structure-${nth}`;
    const newDormer = new DormerModel(structureId);
    model.structuresMap.set(structureId, newDormer);
    model.selectedStructureId = structureId;

    newDormer.dormerPlan.addHandles(handleControl);

    planScene.scene.add(newDormer.dormerPlan.structureBase.transform);
    perspectiveScene.scene.add(newDormer.dormerPersp.structureBase.transform);
    elevationScene.scene.add(newDormer.dormerElev.structureBase.transform);

    model.structuresMap.set(structureId, newDormer);
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

    console.log('create dormer done...');
  }
}

export default Controller;
