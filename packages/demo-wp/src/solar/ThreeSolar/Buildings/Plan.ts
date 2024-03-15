import * as THREE from 'three';
import { convertToPoints } from '../Lib/Geometry';
import StructureBase from '../Lib/StructureBase';
import { HandleControl, Handle } from '../Handles/BuildingHandles';

class BuildingPlan {
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
    // TODO: What about if the roof height exceeds this?
    // the handle needs to always be on top
    const handleHeight = 1.8;
    const topLeftPos = new THREE.Vector3(-1, handleHeight, -1);
    topLeft.handleObject.position.copy(topLeftPos);
    this.doubleHipRoof.add(topLeft.handleObject);

    const topRightPos = new THREE.Vector3(1, handleHeight, -1);
    topRight.handleObject.position.copy(topRightPos);
    this.doubleHipRoof.add(topRight.handleObject);

    const bottomLeftPos = new THREE.Vector3(-1, handleHeight, 1);
    bottomLeft.handleObject.position.copy(bottomLeftPos);
    this.doubleHipRoof.add(bottomLeft.handleObject);

    const bottomRightPos = new THREE.Vector3(1, handleHeight, 1);
    bottomRight.handleObject.position.copy(bottomRightPos);
    this.doubleHipRoof.add(bottomRight.handleObject);

    const roofGeom = this.getRoofGeometry();
    const topHipVec = roofGeom[9];
    const bottomHipVec = roofGeom[13];

    const topHipPos = new THREE.Vector3(topHipVec.x, handleHeight, topHipVec.z);
    topHip.handleObject.position.copy(topHipPos);
    this.doubleHipRoof.add(topHip.handleObject);

    const bottomHipPos = new THREE.Vector3(
      bottomHipVec.x,
      handleHeight,
      bottomHipVec.z
    );
    bottomHip.handleObject.position.copy(bottomHipPos);
    this.doubleHipRoof.add(bottomHip.handleObject);

    const ridgePos = new THREE.Vector3(0, handleHeight, 0);
    ridge.handleObject.position.copy(ridgePos);
    this.doubleHipRoof.add(ridge.handleObject);

    const rotatePos = new THREE.Vector3(1.5, handleHeight, 0);
    rotateHandle.handleObject.position.copy(rotatePos);
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

  setRoofGeometry(vectorPoints: THREE.Vector3[]) {
    this.doubleHipRoof.geometry.setFromPoints(vectorPoints);
  }
}

export default BuildingPlan;
