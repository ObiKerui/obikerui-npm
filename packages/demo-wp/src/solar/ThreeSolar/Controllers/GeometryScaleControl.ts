import { Euler, Vector3 } from 'three';
import { tCallbackData } from '../Lib/sharedTypes';
import { BuildingModel } from '../Model/Model';

function convertToVectors(arr: Float32Array, chunkSize: number) {
  const toRet: Vector3[] = [];

  if (arr.length % chunkSize !== 0) {
    return null;
  }

  // Loop through the floatArray and create Vector3 objects
  for (let i = 0; i < arr.length; i += chunkSize) {
    const x = arr[i];
    const y = arr[i + 1];
    const z = arr[i + 2];
    const vector3 = new Vector3(x, y, z);
    toRet.push(vector3);
  }

  return toRet;
}

class GeometryScaleControl {
  buildingModel: BuildingModel | null;
  startingVectors: Vector3[];
  width: number;
  height: number;
  ridgeWidth: number;
  midRatio: number;
  topHipHeight: number;
  topHipRatio: number;
  bottomHipHeight: number;
  bottomHipRatio: number;

  constructor() {
    this.buildingModel = null;
    this.startingVectors = [];
    this.width = 0;
    this.height = 0;
    this.ridgeWidth = 0;
    this.midRatio = 0;
    this.topHipHeight = 0;
    this.topHipRatio = 0;
    this.bottomHipHeight = 0;
    this.bottomHipRatio = 0;
  }

  setBuilding(buildingModel: BuildingModel) {
    this.buildingModel = buildingModel;
    const { doubleHipRoof, rotation } = buildingModel.buildingPlan;

    const currGeom = doubleHipRoof.geometry.getAttribute('position');
    const startingVecs = convertToVectors(
      currGeom.array as Float32Array,
      currGeom.itemSize
    );

    if (!startingVecs) {
      return;
    }
    this.startingVectors = [];
    this.startingVectors = startingVecs.map((vec) => vec.clone());

    // calculate the starting width of the roof and ridge
    const leftX = this.startingVectors[0].x;
    const rightX = this.startingVectors[1].x;
    const topZ = 0;
    const bottomZ = 0;
    const ridge = this.startingVectors[9].x;

    this.width = rightX - leftX;
    this.ridgeWidth = ridge - leftX;
    this.midRatio = this.ridgeWidth / this.width;

    this.height = 0;
    this.topHipHeight = 0;
    this.topHipRatio = 0;
    this.bottomHipHeight = 0;
    this.bottomHipRatio = 0;
  }

  recentre() {
    const { buildingModel } = this;
    if (!buildingModel) {
      return;
    }
    const { transform, rotation, scale, doubleHipRoof } =
      buildingModel.buildingPlan;

    // what's the current pos of the geometry
    const beforeCurrPos = doubleHipRoof.position.clone();
    const beforeCurrPosWorld = doubleHipRoof.localToWorld(beforeCurrPos);

    // compute the centre of the geometry
    doubleHipRoof.geometry.computeBoundingBox();
    const centre = new Vector3();
    doubleHipRoof.geometry.boundingBox?.getCenter(centre);

    const newCentre = centre.clone();
    doubleHipRoof.localToWorld(centre);
    const worldCentre = centre.clone();

    const geometryShift = new Vector3(-newCentre.x, -newCentre.y, -newCentre.z);
    transform.position.copy(centre.clone());
    rotation.position.copy(new Vector3(0, 0, 0));
    scale.position.copy(new Vector3(0, 0, 0));
    doubleHipRoof.position.copy(new Vector3(0, 0, 0));

    // what's the current pos of the geometry
    const afterCurrPos = doubleHipRoof.position.clone();
    const afterCurrPosWorld = doubleHipRoof.localToWorld(afterCurrPos);

    console.log(
      'curr position local / world ',
      beforeCurrPos,
      beforeCurrPosWorld
    );
    console.log(
      'curr position local / world after ',
      afterCurrPos,
      afterCurrPosWorld
    );
  }

  setScale(params: tCallbackData) {
    const { buildingModel } = this;
    const { eventData } = params;
    const { mouseCoords, worldCoords } = eventData;

    if (!buildingModel) {
      return;
    }
    const { scale, doubleHipRoof, scaleHandles } = buildingModel.buildingPlan;

    const currGeom = doubleHipRoof.geometry.getAttribute('position');
    const vecs = convertToVectors(
      currGeom.array as Float32Array,
      currGeom.itemSize
    );

    if (!vecs) {
      return;
    }

    const local = doubleHipRoof.worldToLocal(worldCoords.clone());
    const newX = local.x;
    const newZ = local.z;
    const startX = this.startingVectors[1].x;
    const startZ = this.startingVectors[1].z;
    const left = this.startingVectors[0].x;
    const middle = this.startingVectors[16].x;
    const newWidth = newX - startX;
    const newMidPoint = this.midRatio * newWidth;

    // update the perimeter
    vecs[0] = new Vector3(vecs[0].x, vecs[0].y, local.z);
    vecs[1] = local.clone();
    vecs[2] = local.clone();
    vecs[3] = new Vector3(local.x, vecs[3].y, vecs[3].z);
    vecs[4] = new Vector3(local.x, vecs[4].y, vecs[4].z);
    vecs[7] = new Vector3(vecs[8].x, vecs[8].y, local.z);
    vecs[8] = new Vector3(vecs[8].x, vecs[8].y, local.z);

    // update the ridge and hip lines
    vecs[9] = new Vector3(newMidPoint, vecs[9].y, vecs[9].z);
    vecs[10] = local.clone();
    vecs[11] = new Vector3(newMidPoint, vecs[11].y, vecs[11].z);
    vecs[13] = new Vector3(newMidPoint, vecs[13].y, vecs[13].z);
    vecs[14] = new Vector3(local.x, vecs[12].y, vecs[12].z);
    vecs[15] = new Vector3(newMidPoint, vecs[15].y, vecs[15].z);
    vecs[16] = new Vector3(newMidPoint, vecs[16].y, vecs[16].z);
    vecs[17] = new Vector3(newMidPoint, vecs[17].y, vecs[17].z);

    doubleHipRoof.geometry.setFromPoints(vecs);
  }

  //   setScale(params: tCallbackData) {
  //     const { buildingModel } = this;
  //     const { eventData } = params;
  //     const { mouseCoords, worldCoords } = eventData;

  //     if (!buildingModel) {
  //       return;
  //     }
  //     const { scale, doubleHipRoof, scaleHandles } = buildingModel.buildingPlan;
  //     const localCoords = doubleHipRoof.worldToLocal(mouseCoords.clone());

  //     const currGeom = doubleHipRoof.geometry.getAttribute('position');
  //     const vecs = convertToVectors(
  //       currGeom.array as Float32Array,
  //       currGeom.itemSize
  //     );

  //     if (!vecs) {
  //       return;
  //     }

  //     // const local = doubleHipRoof.worldToLocal(worldCoords.clone());
  //     const newX = worldCoords.x;
  //     const newZ = worldCoords.z;
  //     const startX = this.startingVectors[1].x;
  //     const startZ = this.startingVectors[1].z;
  //     const left = this.startingVectors[0].x;
  //     const middle = this.startingVectors[16].x;
  //     const newWidth = newX - startX;
  //     const newMidPoint = this.midRatio * newWidth;

  //     // update the perimeter
  //     vecs[0] = new Vector3(vecs[0].x, vecs[0].y, worldCoords.z);
  //     vecs[1] = worldCoords.clone();
  //     vecs[2] = worldCoords.clone();
  //     vecs[3] = new Vector3(worldCoords.x, vecs[3].y, vecs[3].z);
  //     vecs[4] = new Vector3(worldCoords.x, vecs[4].y, vecs[4].z);
  //     vecs[7] = new Vector3(vecs[8].x, vecs[8].y, worldCoords.z);
  //     vecs[8] = new Vector3(vecs[8].x, vecs[8].y, worldCoords.z);

  //     // update the ridge and hip lines
  //     vecs[9] = new Vector3(newMidPoint, vecs[9].y, vecs[9].z);
  //     vecs[10] = worldCoords.clone();
  //     vecs[11] = new Vector3(newMidPoint, vecs[11].y, vecs[11].z);
  //     vecs[13] = new Vector3(newMidPoint, vecs[13].y, vecs[13].z);
  //     vecs[14] = new Vector3(worldCoords.x, vecs[12].y, vecs[12].z);
  //     vecs[15] = new Vector3(newMidPoint, vecs[15].y, vecs[15].z);
  //     vecs[16] = new Vector3(newMidPoint, vecs[16].y, vecs[16].z);
  //     vecs[17] = new Vector3(newMidPoint, vecs[17].y, vecs[17].z);

  //     doubleHipRoof.geometry.setFromPoints(vecs);
  //   }
}

export default GeometryScaleControl;
