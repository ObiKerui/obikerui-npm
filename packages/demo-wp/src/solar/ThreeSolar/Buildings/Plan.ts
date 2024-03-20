import * as THREE from 'three';
import { convertToPoints } from '../Lib/Geometry';
import StructureBase from '../Lib/StructureBase';
import { HandleControl, Handle } from '../Handles/BuildingHandles';
import { IPlan } from '../Lib/Structure';

class BuildingPlan implements IPlan {
  doubleHipRoof: THREE.LineSegments;
  structureBase: StructureBase;
  handles: Handle[];
  id: string;
  // xyCursor: THREE.Mesh;

  constructor(id: string, doubleHipRoof: THREE.LineSegments) {
    this.id = id;
    this.handles = [];
    this.doubleHipRoof = doubleHipRoof;
    this.structureBase = new StructureBase(id, doubleHipRoof);
  }

  addHandles(handles: HandleControl) {
    const {
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
      topHip,
      bottomHip,
      ridge,
      rotateHandle,
    } = handles;

    const { scale } = this.structureBase.scale;
    const invScale = new THREE.Vector3(1 / scale.x, 1, 1 / scale.z);

    // TODO: What about if the roof height exceeds this?
    // the handle needs to always be on top
    const handleHeight = 1.8;
    const topLeftPos = new THREE.Vector3(-1, handleHeight, -1);
    topLeft.handleObject.position.copy(topLeftPos);
    topLeft.handleObject.scale.copy(invScale);
    this.doubleHipRoof.add(topLeft.handleObject);

    const topRightPos = new THREE.Vector3(1, handleHeight, -1);
    topRight.handleObject.position.copy(topRightPos);
    topRight.handleObject.scale.copy(invScale);
    this.doubleHipRoof.add(topRight.handleObject);

    const bottomLeftPos = new THREE.Vector3(-1, handleHeight, 1);
    bottomLeft.handleObject.position.copy(bottomLeftPos);
    bottomLeft.handleObject.scale.copy(invScale);
    this.doubleHipRoof.add(bottomLeft.handleObject);

    const bottomRightPos = new THREE.Vector3(1, handleHeight, 1);
    bottomRight.handleObject.position.copy(bottomRightPos);
    bottomRight.handleObject.scale.copy(invScale);
    this.doubleHipRoof.add(bottomRight.handleObject);

    const roofGeom = this.getRoofGeometry();
    const topHipVec = roofGeom[9];
    const bottomHipVec = roofGeom[13];

    const topHipPos = new THREE.Vector3(topHipVec.x, handleHeight, topHipVec.z);
    topHip.handleObject.position.copy(topHipPos);
    topHip.handleObject.scale.copy(invScale);
    this.doubleHipRoof.add(topHip.handleObject);

    const bottomHipPos = new THREE.Vector3(
      bottomHipVec.x,
      handleHeight,
      bottomHipVec.z
    );
    bottomHip.handleObject.position.copy(bottomHipPos);
    bottomHip.handleObject.scale.copy(invScale);
    this.doubleHipRoof.add(bottomHip.handleObject);

    const ridgePos = new THREE.Vector3(0, handleHeight, 0);
    ridge.handleObject.position.copy(ridgePos);
    ridge.handleObject.scale.copy(invScale);
    this.doubleHipRoof.add(ridge.handleObject);

    const rotatePos = new THREE.Vector3(1.5, handleHeight, 0);
    rotateHandle.handleObject.position.copy(rotatePos);
    rotateHandle.handleObject.scale.copy(invScale);
    this.doubleHipRoof.add(rotateHandle.handleObject);

    // WARN careful of this - could cause a bug down the line when handles
    // are switched to another mesh object
    // currently accessed by the RoofControl when moving ridge and
    // the ScaleControl when applying inverse scaling
    this.handles = [
      handles.topLeft,
      handles.topRight,
      handles.bottomLeft,
      handles.bottomRight,
      handles.topHip,
      handles.bottomHip,
      handles.ridge,
      handles.rotateHandle,
    ];
  }

  getRoofGeometry() {
    const geometry = this.doubleHipRoof.geometry.getAttribute('position');
    const vectors = convertToPoints(geometry as THREE.BufferAttribute);
    return vectors;
  }

  // north face
  // 0, 1, 2 -> 8, 9, 10
  // west face
  // 0, 1, 5, 6 -> 8, 9, 13, 14
  // south face
  // 4, 5, 6 -> 12, 13, 14
  // east face
  // 2, 3, 5, 4 -> 10, 11, 13, 12
  getRoofPlatforms() {
    const { doubleHipRoof } = this;
    const geometry = doubleHipRoof.geometry.getAttribute('position');
    const localVectors = convertToPoints(geometry as THREE.BufferAttribute);

    const vectors = localVectors.map((v) =>
      v.clone().applyMatrix4(doubleHipRoof.matrixWorld)
    );

    const platforms = {
      north: [vectors[8], vectors[9], vectors[10]],
      east: [vectors[8], vectors[9], vectors[13], vectors[12]],
      south: [vectors[12], vectors[13], vectors[14]],
      west: [vectors[10], vectors[11], vectors[13], vectors[14]],
    };
    return platforms;
  }

  setRoofGeometry(vectorPoints: THREE.Vector3[]) {
    this.doubleHipRoof.geometry.setFromPoints(vectorPoints);
  }

  get Base() {
    return this.structureBase;
  }

  get Locations() {
    return this.doubleHipRoof;
  }

  set Colour(newColor: THREE.ColorRepresentation) {
    const { doubleHipRoof } = this;
    const mat = doubleHipRoof.material as THREE.LineBasicMaterial;
    mat.color.set(newColor);
  }
}

export default BuildingPlan;
