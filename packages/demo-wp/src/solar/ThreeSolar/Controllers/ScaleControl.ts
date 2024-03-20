/* eslint-disable class-methods-use-this */
import { Vector3 } from 'three';
import { IListener, UI_ACTION, USER_EVENT } from '../Lib/sharedTypes';
import { InteractionMode, Model } from '../Model/Model';

// function getCenterPoint(mesh: Mesh) {
//   const { geometry } = mesh;
//   geometry.computeBoundingBox();
//   const bbox = geometry.boundingBox;
//   if (!bbox) {
//     return null;
//   }
//   const centre = new Vector3();
//   bbox.getCenter(centre);
//   // mesh.localToWorld(centre);
//   // centre.z = 2;
//   return centre;
// }

class ScaleControl implements IListener {
  onUpdate(mouseEvent: USER_EVENT, model: Model) {
    if (model.interaction !== InteractionMode.SCALE) {
      return;
    }

    switch (mouseEvent) {
      case USER_EVENT.MOUSE_DOWN:
        this.onMouseDown(model);
        break;
      case USER_EVENT.MOUSE_MOVE:
        this.onMouseMove(model);
        break;
      case USER_EVENT.MOUSE_UP:
        this.onMouseUp(model);
        break;
      default:
        break;
    }
  }

  onMouseDown(model: Model) {
    const { SelectedStructure, uiEvent } = model;
    if (!SelectedStructure || !uiEvent) {
      throw new Error('Structure not selected or no ui event!');
    }

    const structureModel = SelectedStructure;
    const {
      anchor,
      scale,
      structure: doubleHipRoof,
    } = structureModel.Plan.Base;

    const { anchor: perspAnchor, structure: perspRoof } =
      structureModel.Persp.Base;

    const { action } = uiEvent;

    let xShift = scale.scale.x;
    let xInvShift = 1;
    let zShift = scale.scale.z;
    let zInvShift = -1;

    if (action === UI_ACTION.SCALE_NW || action === UI_ACTION.SCALE_SW) {
      xShift = -xShift;
      xInvShift = -1;
    }
    if (action === UI_ACTION.SCALE_SW || action === UI_ACTION.SCALE_SE) {
      zShift = -zShift;
      zInvShift = 1;
    }

    const anchorShift = new Vector3(-xShift, 0, zShift);
    const anchorShiftInverse = new Vector3(xInvShift, 0, zInvShift);

    console.log('anchor shift / inverse: ', anchorShift, anchorShiftInverse);

    anchor.position.copy(anchorShift);
    doubleHipRoof.position.copy(anchorShiftInverse);

    perspAnchor.position.copy(anchorShift);
    perspRoof.position.copy(anchorShiftInverse);
  }

  onMouseMove(model: Model) {
    const { SelectedStructure, uiEvent, handleControl } = model;
    if (!SelectedStructure || !uiEvent) {
      throw new Error('Structure not selected or no ui event!');
    }

    const structureModel = SelectedStructure;
    const { anchor, scale } = structureModel.Plan.Base;
    const { scale: scalePersp } = structureModel.Persp.Base;
    const { scale: scaleElev } = structureModel.Elevation.Base;

    const { worldCoords } = uiEvent.positionData;

    const newWorldCoords = new Vector3(worldCoords.x, 0, worldCoords.z);
    anchor.worldToLocal(newWorldCoords);

    const newXScale = Math.abs(newWorldCoords.x / 2);
    const newZScale = Math.abs(newWorldCoords.z / 2);
    const newScale = new Vector3(newXScale, 1, newZScale);

    const newInverseScale = new Vector3(1 / newScale.x, 1, 1 / newScale.z);

    scale.scale.copy(newScale);

    const scaleHandles = handleControl.handlesArray;

    scaleHandles.forEach(({ handleObject }) => {
      handleObject.scale.copy(newInverseScale.clone());
    });

    scalePersp.scale.copy(newScale);
    scaleElev.scale.copy(newScale);
  }

  onMouseUp(model: Model) {
    const { SelectedStructure, uiEvent } = model;
    if (!SelectedStructure || !uiEvent) {
      throw new Error('Structure not selected or no ui event!');
    }

    const structureModel = SelectedStructure;

    const {
      transform,
      rotation,
      anchor,
      scale,
      perimeter,
      structure: doubleHipRoof,
    } = structureModel.Plan.Base;

    const {
      transform: tPersp,
      rotation: rPersp,
      anchor: aPersp,
      scale: sPersp,
      perimeter: pPersp,
      structure: roofPersp,
    } = structureModel.Persp.Base;

    const worldPos = new Vector3();
    doubleHipRoof.getWorldPosition(worldPos);

    transform.position.copy(worldPos.clone());
    rotation.position.set(0, 0, 0);
    anchor.position.set(0, 0, 0);
    scale.position.set(0, 0, 0);
    perimeter.position.set(0, 0, 0);
    doubleHipRoof.position.set(0, 0, 0);

    tPersp.position.copy(worldPos.clone());
    rPersp.position.set(0, 0, 0);
    aPersp.position.set(0, 0, 0);
    sPersp.position.set(0, 0, 0);
    pPersp.position.set(0, 0, 0);
    roofPersp.position.set(0, 0, 0);
  }
}

export default ScaleControl;
