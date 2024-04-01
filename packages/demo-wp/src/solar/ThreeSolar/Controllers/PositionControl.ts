/* eslint-disable class-methods-use-this */
import { Vector3 } from 'three';
import { IListener, STRUCTURE_TYPE, USER_EVENT } from '../Lib/sharedTypes';
import { InteractionMode, Model } from '../Model/Model';
import Elevation from '../Scenes/Elevation';
import { Istructure } from '../Lib/Structure';

import PlacementControl from './PlacementControl';

class PositionControl implements IListener {
  offset: Vector3 | null;
  placer: PlacementControl;
  constructor() {
    this.offset = null;
    this.placer = new PlacementControl();
  }

  onUpdate(mouseEvent: USER_EVENT, model: Model) {
    if (model.interaction !== InteractionMode.POSITION) {
      return;
    }

    switch (mouseEvent) {
      case USER_EVENT.MOUSE_DOWN:
        this.onMouseDown(model);
        break;
      case USER_EVENT.MOUSE_MOVE:
        this.setPosition(model);
        break;
      case USER_EVENT.MOUSE_UP:
        break;
      default:
        break;
    }
  }

  updateElevationSceneObject(structure: Istructure, elevationScene: Elevation) {
    // remove all from elevation scene and add this if its a building?
    const { children } = elevationScene.scene;
    children.forEach((child) => {
      child.removeFromParent();
    });

    // Check if this is mountable (dormer) or building
    // if its a building add it to the scene
    // if its a dormer:
    // if the dormer is attached to a building add the buiding to the scene
    // if it is not attached to anything don't add it
    if (structure.Type === STRUCTURE_TYPE.BUILDING) {
      console.log('add structure to building: ', structure);
      elevationScene.scene.add(structure.Elevation.Base.transform);
    }
  }

  onMouseDown(model: Model) {
    const { SelectedStructure, uiEvent, handleControl, elevationScene } = model;
    if (!SelectedStructure || !uiEvent || !elevationScene) {
      throw new Error('Structure not selected or no ui event!');
    }

    const structureModel = SelectedStructure;
    const { transform } = structureModel.Plan.Base;
    const { worldCoords } = uiEvent.positionData;

    // this.updateElevationSceneObject(structureModel, elevationScene);

    handleControl.removeFromScene();
    structureModel.Plan.addHandles(handleControl);

    // for the offset find difference between mouse click pos and centre of transform
    const transformCentre = new Vector3();
    transform.getWorldPosition(transformCentre);

    this.offset = new Vector3(
      worldCoords.x - transformCentre.x,
      0,
      worldCoords.z - transformCentre.z
    );
  }

  setPosition(model: Model) {
    const { SelectedStructure, uiEvent } = model;
    if (!SelectedStructure || !uiEvent) {
      throw new Error('Structure not selected or no ui event!');
    }

    const { worldCoords } = uiEvent.positionData;
    const { offset } = this;
    if (!offset) {
      throw new Error('Error offset has not been set!');
    }

    const structureModel = SelectedStructure;

    const { transform: planTransform } = structureModel.Plan.Base;
    const { transform: perspTransform } = structureModel.Persp.Base;

    const newPosition = new Vector3(
      worldCoords.x - offset.x,
      perspTransform.position.y,
      worldCoords.z - offset.z
    );

    planTransform.position.copy(newPosition);
    perspTransform.position.copy(newPosition);
  }
}

export default PositionControl;
