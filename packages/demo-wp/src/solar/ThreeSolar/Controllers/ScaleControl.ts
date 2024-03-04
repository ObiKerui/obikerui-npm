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

  setBuilding(buildingModel: BuildingModel) {
    this.buildingModel = buildingModel;
    const { anchor, scale, doubleHipRoof } = this.buildingModel.buildingPlan;

    const { anchor: perspAnchor, doubleHipRoof: perspRoof } =
      this.buildingModel.buildingPersp;

    const xShift = scale.scale.x;
    const zShift = scale.scale.z;

    const anchorShift = new Vector3(-xShift, 0, zShift);
    const anchorShiftInverse = new Vector3(1, 0, -1);

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

    const { worldCoords } = params.eventData;
    // console.log('mouse / world coords: ', mouseCoords, worldCoords);

    // const newWorldCoords = worldCoords.clone();
    const newWorldCoords = new Vector3(worldCoords.x, 0, worldCoords.z);
    anchor.worldToLocal(newWorldCoords);

    const newScale = new Vector3(
      newWorldCoords.x / 2,
      1,
      Math.abs(newWorldCoords.z / 2)
    );

    const newInverseScale = new Vector3(1 / newScale.x, 1, 1 / newScale.z);

    scale.scale.copy(newScale);

    scaleHandles.forEach((handle) => {
      handle.scale.copy(newInverseScale.clone());
    });

    scalePersp.scale.copy(newScale);
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
