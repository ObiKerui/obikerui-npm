/* eslint-disable prefer-destructuring */
import { Mesh, OrthographicCamera, Vector3 } from 'three';
import { tCallbackData } from '../Lib/sharedTypes';
import { BuildingModel } from '../Model/Model';

class ElevationControl {
  buildingModel: BuildingModel | null;
  handle: Mesh | null;
  vectorsOnStart: Vector3[];
  perspVectorsOnStart: Vector3[];
  elevVectorsOnStart: Vector3[];
  camera: OrthographicCamera | null;

  constructor() {
    this.buildingModel = null;
    this.handle = null;
    this.vectorsOnStart = [];
    this.perspVectorsOnStart = [];
    this.elevVectorsOnStart = [];
    this.camera = null;
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
    const { buildingModel, handle, elevVectorsOnStart, camera } = this;
    if (!buildingModel || !handle || !camera) {
      return;
    }

    const { perimeter } = buildingModel.buildingElev;

    const currPos = handle.position;
    const local = perimeter.worldToLocal(worldCoords.clone());
    const newYPosition = local.y;
    handle.position.set(currPos.x, newYPosition, currPos.z);

    // need to adjust the roof geometry now too 9,11,16
    const vecToTop = elevVectorsOnStart[9];
    const vecToBottom = elevVectorsOnStart[12];

    vecToTop.y = newYPosition / camera.zoom;
    vecToBottom.y = newYPosition / camera.zoom;

    buildingModel.buildingElev.setRoofGeometry(elevVectorsOnStart);
    this.setTopHipPositionPersp(local);
  }

  setTopHipPositionPersp(coords: Vector3) {
    const { perspVectorsOnStart, buildingModel, camera } = this;
    if (!buildingModel || !camera) {
      return;
    }

    const vecToTop = perspVectorsOnStart[9];
    const vecToBottom = perspVectorsOnStart[12];

    vecToTop.y = coords.y / camera.zoom;
    vecToBottom.y = coords.y / camera.zoom;
    buildingModel.buildingPersp.setRoofGeometry(perspVectorsOnStart);
  }

  setBottomPosition(params: tCallbackData) {
    const { worldCoords } = params.eventData;
    const { buildingModel, elevVectorsOnStart, camera } = this;
    if (!buildingModel || !camera) {
      return;
    }

    const { camHandles: elevHandles } = buildingModel.buildingElev;
    const roofBaseHandle = elevHandles?.roofBottomLevel.handle;
    const roofTopHandle = elevHandles?.roofTopLevel.handle;
    if (!roofBaseHandle || !roofTopHandle) {
      return;
    }

    const { perimeter } = buildingModel.buildingElev;

    const currPos = roofBaseHandle.position;
    const local = perimeter.worldToLocal(worldCoords.clone());
    const newBaseYPosition = local.y;
    roofBaseHandle.position.set(currPos.x, newBaseYPosition, currPos.z);

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

    const scaledYPosition = newBaseYPosition / camera.zoom;
    veca.y = scaledYPosition;
    vecb.y = scaledYPosition;
    vecc.y = scaledYPosition;
    vecd.y = scaledYPosition;

    const roofHeight = vecf.y - vece.y;
    const newRoofHeight = scaledYPosition + roofHeight;

    vece.y = scaledYPosition;
    vecf.y = newRoofHeight;
    vecg.y = scaledYPosition;
    vech.y = scaledYPosition;
    veci.y = newRoofHeight;
    vecj.y = scaledYPosition;
    roofTopHandle.position.y = newRoofHeight * camera.zoom;

    buildingModel.buildingElev.setRoofGeometry(elevVectorsOnStart);
    buildingModel.buildingPersp.setRoofGeometry(elevVectorsOnStart);
  }
}

export default ElevationControl;
