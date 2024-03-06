import { Vector3 } from 'three';
import { tCallbackData } from '../Lib/sharedTypes';
import { BuildingModel } from '../Model/Model';

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

class ScaleControl {
  buildingModel: BuildingModel | null;

  constructor() {
    this.buildingModel = null;
  }

  setBuilding(buildingModel: BuildingModel, params: tCallbackData) {
    this.buildingModel = buildingModel;
    const { anchor, scale, doubleHipRoof } = this.buildingModel.buildingPlan;

    const { anchor: perspAnchor, doubleHipRoof: perspRoof } =
      this.buildingModel.buildingPersp;

    const { object } = params.eventData;
    if (!object) {
      return;
    }

    const objName = object.name;

    let xShift = scale.scale.x;
    let xInvShift = 1;
    let zShift = scale.scale.z;
    let zInvShift = -1;

    if (objName.endsWith('left')) {
      xShift = -xShift;
      xInvShift = -1;
    }
    if (objName.endsWith('bottomleft') || objName.endsWith('bottomright')) {
      zShift = -zShift;
      zInvShift = 1;
    }

    const anchorShift = new Vector3(-xShift, 0, zShift);
    const anchorShiftInverse = new Vector3(xInvShift, 0, zInvShift);

    anchor.position.copy(anchorShift);
    doubleHipRoof.position.copy(anchorShiftInverse);

    perspAnchor.position.copy(anchorShift);
    perspRoof.position.copy(anchorShiftInverse);
  }

  setScale(params: tCallbackData) {
    // console.log('params: ', params);
    if (!this.buildingModel) {
      return;
    }
    const {
      anchor,
      scale,
      handles: scaleHandles,
    } = this.buildingModel.buildingPlan;

    const { scale: scalePersp } = this.buildingModel.buildingPersp;
    const { scale: scaleElev } = this.buildingModel.buildingElev;

    const { worldCoords } = params.eventData;

    const newWorldCoords = new Vector3(worldCoords.x, 0, worldCoords.z);
    anchor.worldToLocal(newWorldCoords);

    const newXScale = Math.abs(newWorldCoords.x / 2);
    const newZScale = Math.abs(newWorldCoords.z / 2);
    const newScale = new Vector3(newXScale, 1, newZScale);

    const newInverseScale = new Vector3(1 / newScale.x, 1, 1 / newScale.z);

    scale.scale.copy(newScale);

    scaleHandles.forEach((handle) => {
      handle.scale.copy(newInverseScale.clone());
    });

    scalePersp.scale.copy(newScale);
    scaleElev.scale.copy(newScale);
  }

  recentre() {
    if (!this.buildingModel) {
      return;
    }

    const { transform, rotation, anchor, scale, perimeter, doubleHipRoof } =
      this.buildingModel.buildingPlan;

    const {
      transform: tPersp,
      rotation: rPersp,
      anchor: aPersp,
      scale: sPersp,
      perimeter: pPersp,
      doubleHipRoof: roofPersp,
    } = this.buildingModel.buildingPersp;

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
