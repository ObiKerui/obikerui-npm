/* eslint-disable prefer-destructuring */
import { Mesh, Vector3 } from 'three';
import { tCallbackData } from '../Lib/sharedTypes';
import { BuildingModel } from '../Model/Model';

class ElevationControl {
  buildingModel: BuildingModel | null;
  handle: Mesh | null;
  vectorsOnStart: Vector3[];
  perspVectorsOnStart: Vector3[];
  elevVectorsOnStart: Vector3[];

  constructor() {
    this.buildingModel = null;
    this.handle = null;
    this.vectorsOnStart = [];
    this.perspVectorsOnStart = [];
    this.elevVectorsOnStart = [];
  }

  setBuilding(buildingModel: BuildingModel, params: tCallbackData) {
    const { object } = params.eventData;
    if (!object) {
      return;
    }
    this.buildingModel = buildingModel;
    this.handle = object;

    const elevVecs = this.buildingModel.buildingElev.getRoofGeometry();
    this.elevVectorsOnStart = elevVecs.map((vec) => vec.clone());

    const vecs = this.buildingModel.buildingPlan.getRoofGeometry();
    this.vectorsOnStart = vecs.map((vec) => vec.clone());

    const persVecs = this.buildingModel.buildingPersp.getRoofGeometry();
    this.perspVectorsOnStart = persVecs.map((vec) => vec.clone());
  }

  setPosition(params: tCallbackData) {
    const { buildingModel, handle } = this;

    if (!buildingModel || !handle) {
      return;
    }

    if (handle.name === 'adjust-roof-top') {
      this.setTopPosition(params);
    }

    if (handle.name === 'adjust-roof-bottom') {
      this.setBottomPosition(params);
    }
  }

  setTopPosition(params: tCallbackData) {
    const { worldCoords } = params.eventData;
    const { buildingModel, handle, elevVectorsOnStart } = this;
    if (!buildingModel || !handle) {
      return;
    }

    const { perimeter } = buildingModel.buildingElev;

    const currPos = handle.position;
    const local = perimeter.worldToLocal(worldCoords.clone());
    handle.position.set(currPos.x, local.y, currPos.z);

    // need to adjust the roof geometry now too 9,11,16
    const vecToTop = elevVectorsOnStart[9];
    const vecToBottom = elevVectorsOnStart[12];

    vecToTop.y = local.y;
    vecToBottom.y = local.y;

    buildingModel.buildingElev.setRoofGeometry(elevVectorsOnStart);
    this.setTopHipPositionPersp(local);
  }

  setTopHipPositionPersp(coords: Vector3) {
    const { perspVectorsOnStart, buildingModel } = this;
    if (!buildingModel) {
      return;
    }

    const vecToTop = perspVectorsOnStart[9];
    const vecToBottom = perspVectorsOnStart[12];

    vecToTop.y = coords.y;
    vecToBottom.y = coords.y;
    buildingModel.buildingPersp.setRoofGeometry(perspVectorsOnStart);
  }

  setBottomPosition(params: tCallbackData) {
    const { worldCoords } = params.eventData;
    const { buildingModel, elevVectorsOnStart } = this;
    if (!buildingModel) {
      return;
    }

    const { handles: elevHandles } = buildingModel.buildingElev;
    const roofBaseHandle = elevHandles[0];
    const roofTopHandle = elevHandles[1];

    const { perimeter } = buildingModel.buildingElev;

    const currPos = roofBaseHandle.position;
    const local = perimeter.worldToLocal(worldCoords.clone());
    roofBaseHandle.position.set(currPos.x, local.y, currPos.z);

    // need to adjust the roof geometry now too 13,15,17
    const veca = elevVectorsOnStart[2];
    const vecb = elevVectorsOnStart[3];
    const vecc = elevVectorsOnStart[6];
    const vecd = elevVectorsOnStart[7];

    const vece = elevVectorsOnStart[8];
    const vecf = elevVectorsOnStart[9];
    const vecg = elevVectorsOnStart[10];
    const vech = elevVectorsOnStart[11];
    const veci = elevVectorsOnStart[12];
    const vecj = elevVectorsOnStart[13];

    veca.y = local.y;
    vecb.y = local.y;
    vecc.y = local.y;
    vecd.y = local.y;

    const roofHeight = vecf.y - vece.y;
    const newRoofHeight = local.y + roofHeight;

    vece.y = local.y;
    vecf.y = newRoofHeight;
    vecg.y = local.y;
    vech.y = local.y;
    veci.y = newRoofHeight;
    vecj.y = local.y;
    roofTopHandle.position.y = newRoofHeight;

    buildingModel.buildingElev.setRoofGeometry(elevVectorsOnStart);
    buildingModel.buildingPersp.setRoofGeometry(elevVectorsOnStart);
  }
}

export default ElevationControl;
