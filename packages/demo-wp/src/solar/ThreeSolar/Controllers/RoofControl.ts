/* eslint-disable prefer-destructuring */
import { Mesh, Vector3 } from 'three';
import { tCallbackData } from '../Lib/sharedTypes';
import { BuildingModel } from '../Model/Model';

class RoofControl {
  buildingModel: BuildingModel | null;
  handle: Mesh | null;
  vectorsOnStart: Vector3[];

  constructor() {
    this.buildingModel = null;
    this.handle = null;
    this.vectorsOnStart = [];
  }

  setBuilding(buildingModel: BuildingModel, params: tCallbackData) {
    const { object } = params.eventData;
    if (!object) {
      return;
    }
    this.buildingModel = buildingModel;
    this.handle = object;

    const vecs = this.buildingModel.buildingPlan.getRoofGeometry();
    this.vectorsOnStart = vecs.map((vec) => vec.clone());
  }

  setPosition(params: tCallbackData) {
    const { buildingModel, handle } = this;

    if (!buildingModel || !handle) {
      return;
    }

    if (handle.name === 'move-tophip') {
      this.setTopHipPosition(params);
    }

    if (handle.name === 'move-bottomhip') {
      this.setBottomHipPosition(params);
    }

    if (handle.name === 'move-ridgeline') {
      this.setRidgePosition(params);
    }
  }

  setTopHipPosition(params: tCallbackData) {
    const { worldCoords } = params.eventData;
    const { buildingModel, handle, vectorsOnStart } = this;
    if (!buildingModel || !handle) {
      return;
    }

    const { perimeter } = buildingModel.buildingPlan;

    const currPos = handle.position;
    const local = perimeter.worldToLocal(worldCoords.clone());
    handle.position.set(currPos.x, currPos.y, local.z);

    // need to adjust the roof geometry now too 9,11,16
    const vecFromLeftToTop = vectorsOnStart[9];
    const vecFromRightToTop = vectorsOnStart[11];
    const vecFromRidgeToTop = vectorsOnStart[16];

    vecFromLeftToTop.z = local.z;
    vecFromRightToTop.z = local.z;
    vecFromRidgeToTop.z = local.z;

    buildingModel.buildingPlan.setRoofGeometry(vectorsOnStart);
  }

  setBottomHipPosition(params: tCallbackData) {
    const { worldCoords } = params.eventData;
    const { buildingModel, handle, vectorsOnStart } = this;
    if (!buildingModel || !handle) {
      return;
    }

    const { perimeter } = buildingModel.buildingPlan;

    const currPos = handle.position;
    const local = perimeter.worldToLocal(worldCoords.clone());
    handle.position.set(currPos.x, currPos.y, local.z);

    // need to adjust the roof geometry now too 13,15,17
    const vecFromLeftToBottom = vectorsOnStart[13];
    const vecFromRightToBottom = vectorsOnStart[15];
    const vecFromRidgeToBottom = vectorsOnStart[17];

    vecFromLeftToBottom.z = local.z;
    vecFromRightToBottom.z = local.z;
    vecFromRidgeToBottom.z = local.z;

    buildingModel.buildingPlan.setRoofGeometry(vectorsOnStart);
  }

  setRidgePosition(params: tCallbackData) {
    const { worldCoords } = params.eventData;
    const { buildingModel, handle, vectorsOnStart } = this;
    if (!buildingModel || !handle) {
      return;
    }

    const { handles } = buildingModel.buildingPlan;

    // TODO as expecteed issue now moved handles!
    const topHip = handles[4];
    const bottomHip = handles[5];

    const { perimeter } = buildingModel.buildingPlan;

    const currPos = handle.position;
    const local = perimeter.worldToLocal(worldCoords.clone());
    handle.position.set(local.x, currPos.y, currPos.z);
    topHip.position.set(local.x, topHip.position.y, topHip.position.z);
    bottomHip.position.set(local.x, bottomHip.position.y, bottomHip.position.z);

    const vecFromLeftToTop = vectorsOnStart[9];
    const vecFromRightToTop = vectorsOnStart[11];
    const vecFromRidgeToTop = vectorsOnStart[16];

    const vecFromLeftToBottom = vectorsOnStart[13];
    const vecFromRightToBottom = vectorsOnStart[15];
    const vecFromRidgeToBottom = vectorsOnStart[17];

    vecFromLeftToTop.x = local.x;
    vecFromRightToTop.x = local.x;
    vecFromRidgeToTop.x = local.x;

    vecFromLeftToBottom.x = local.x;
    vecFromRightToBottom.x = local.x;
    vecFromRidgeToBottom.x = local.x;

    buildingModel.buildingPlan.setRoofGeometry(vectorsOnStart);
  }
}

export default RoofControl;
