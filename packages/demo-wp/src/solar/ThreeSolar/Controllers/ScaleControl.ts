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

    // console.log(
    //   'scales: ',
    //   transform.scale,
    //   rotation.scale,
    //   anchor.scale,
    //   scale.scale,
    //   perimeter.scale,
    //   doubleHipRoof.scale
    // );

    // const xShift = (scale.scale.x * 2) / 2;
    // const zShift = (scale.scale.z * 2) / 2;
    const xShift = scale.scale.x;
    const zShift = scale.scale.z;

    const anchorShift = new Vector3(-xShift, 0, zShift);
    const anchorShiftInverse = new Vector3(1, 0, -1);

    anchor.position.copy(anchorShift);
    doubleHipRoof.position.copy(anchorShiftInverse);
  }

  setScale(params: tCallbackData) {
    // console.log('params: ', params);
    if (!this.buildingModel) {
      return;
    }
    const { anchor, scale, scaleHandles } = this.buildingModel.buildingPlan;
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
  }

  recentre() {
    if (!this.buildingModel) {
      return;
    }

    const { transform, rotation, anchor, scale, perimeter, doubleHipRoof } =
      this.buildingModel.buildingPlan;

    // what's the current pos of the geometry
    // const beforeCurrPos = doubleHipRoof.position.clone();
    // const beforeCurrPosWorld = doubleHipRoof.localToWorld(beforeCurrPos);

    // compute the centre of the geometry
    // const centre = getCenterPoint(perimeter);
    const worldPos = new Vector3();
    doubleHipRoof.getWorldPosition(worldPos);

    transform.position.copy(worldPos.clone());
    rotation.position.set(0, 0, 0);
    anchor.position.set(0, 0, 0);
    scale.position.set(0, 0, 0);
    perimeter.position.set(0, 0, 0);
    doubleHipRoof.position.set(0, 0, 0);
  }
}

export default ScaleControl;
