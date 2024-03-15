import * as THREE from 'three';
import { convertToPoints } from '../Lib/Geometry';
import { HandleControl, Handle } from '../Handles/BuildingHandles';
import StructureBase from '../Lib/StructureBase';

class DormerPlan {
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
  }

  addHandles(handles: HandleControl) {
    const { topLeft, topRight, bottomLeft, bottomRight } = handles;

    // TODO: What about if the roof height exceeds this?
    // the handle needs to always be on top
    const handleHeight = 1.8;
    const left = -0.25;
    const right = 0.25;
    const back = -0.25;
    const front = 0.25;

    const topLeftPos = new THREE.Vector3(left, handleHeight, back);
    topLeft.handleObject.position.copy(topLeftPos);
    this.doubleHipRoof.add(topLeft.handleObject);

    const topRightPos = new THREE.Vector3(right, handleHeight, back);
    topRight.handleObject.position.copy(topRightPos);
    this.doubleHipRoof.add(topRight.handleObject);

    const bottomLeftPos = new THREE.Vector3(left, handleHeight, front);
    bottomLeft.handleObject.position.copy(bottomLeftPos);
    this.doubleHipRoof.add(bottomLeft.handleObject);

    const bottomRightPos = new THREE.Vector3(right, handleHeight, front);
    bottomRight.handleObject.position.copy(bottomRightPos);
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
}

export default DormerPlan;
