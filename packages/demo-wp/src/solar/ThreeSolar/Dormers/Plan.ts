import * as THREE from 'three';
import { convertToPoints } from '../Lib/Geometry';
import { HandleControl, Handle } from '../Handles/BuildingHandles';
import StructureBase from '../Lib/StructureBase';
import { IPlan } from '../Lib/Structure';

class DormerPlan implements IPlan {
  doubleHipRoof: THREE.LineSegments;
  handles: Handle[];
  structureBase: StructureBase;
  id: string;
  // xyCursor: THREE.Mesh;

  constructor(id: string, doubleHipRoof: THREE.LineSegments) {
    this.id = id;
    this.handles = [];
    this.doubleHipRoof = doubleHipRoof;
    this.structureBase = new StructureBase(id, doubleHipRoof);
    this.structureBase.scale.scale.copy(new THREE.Vector3(0.25, 1, 0.25));
  }

  addHandles(handles: HandleControl) {
    const { topLeft, topRight, bottomLeft, bottomRight } = handles;

    const { scale } = this.structureBase.scale;
    const invScale = new THREE.Vector3(1 / scale.x, 1, 1 / scale.z);

    // TODO: What about if the roof height exceeds this?
    // the handle needs to always be on top
    const handleHeight = 1.8;
    const left = -1;
    const right = 1;
    const back = -1;
    const front = 1;

    const topLeftPos = new THREE.Vector3(left, handleHeight, back);
    topLeft.handleObject.position.copy(topLeftPos);
    topLeft.handleObject.scale.copy(invScale);
    this.doubleHipRoof.add(topLeft.handleObject);

    const topRightPos = new THREE.Vector3(right, handleHeight, back);
    topRight.handleObject.position.copy(topRightPos);
    topRight.handleObject.scale.copy(invScale);
    this.doubleHipRoof.add(topRight.handleObject);

    const bottomLeftPos = new THREE.Vector3(left, handleHeight, front);
    bottomLeft.handleObject.position.copy(bottomLeftPos);
    bottomLeft.handleObject.scale.copy(invScale);
    this.doubleHipRoof.add(bottomLeft.handleObject);

    const bottomRightPos = new THREE.Vector3(right, handleHeight, front);
    bottomRight.handleObject.position.copy(bottomRightPos);
    bottomRight.handleObject.scale.copy(invScale);
    this.doubleHipRoof.add(bottomRight.handleObject);

    const roofGeom = this.getRoofGeometry();
    const topHipVec = roofGeom[9];
    const bottomHipVec = roofGeom[13];

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

  setRoofGeometry(vectorPoints: THREE.Vector3[]) {
    this.doubleHipRoof.geometry.setFromPoints(vectorPoints);
  }

  get Base() {
    return this.structureBase;
  }

  get Locations() {
    return this.doubleHipRoof;
  }

  get Colour() {
    const { doubleHipRoof } = this;
    const mat = doubleHipRoof.material as THREE.LineBasicMaterial;
    return mat.color;
  }

  set Colour(newColor: THREE.ColorRepresentation) {
    const { doubleHipRoof } = this;
    const mat = doubleHipRoof.material as THREE.LineBasicMaterial;
    mat.color.set(newColor);
  }
}

export default DormerPlan;
