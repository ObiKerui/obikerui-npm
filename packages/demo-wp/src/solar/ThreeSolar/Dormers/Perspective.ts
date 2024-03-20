import * as THREE from 'three';
import { convertToPoints } from '../Lib/Geometry';
import { HandleControl, Handle } from '../Handles/BuildingHandles';
import StructureBase from '../Lib/StructureBase';
import { Ipersp } from '../Lib/Structure';

class DormerPersp implements Ipersp {
  doubleHipRoof: THREE.Mesh;
  structureBase: StructureBase;
  handles: Handle[];
  id: string;
  attachPoints: THREE.Object3D[];
  // xyCursor: THREE.Mesh;

  constructor(id: string, doubleHipRoof: THREE.Mesh) {
    this.id = id;
    this.handles = [];
    this.doubleHipRoof = doubleHipRoof;
    this.structureBase = new StructureBase(id, doubleHipRoof);
    this.structureBase.scale.scale.copy(new THREE.Vector3(0.25, 0.25, 0.25));
    this.attachPoints = [];
    this.addAttachPoints();
  }

  addAttachPoints() {
    const bottomLeftPos = new THREE.Vector3(-1, 0, -1);
    const bottomLeftAP = new THREE.Object3D();
    bottomLeftAP.position.copy(bottomLeftPos);
    this.doubleHipRoof.add(bottomLeftAP);

    const bottomRightPos = new THREE.Vector3(1, 0, -1);
    const bottomRightAP = new THREE.Object3D();
    bottomLeftAP.position.copy(bottomRightPos);
    this.doubleHipRoof.add(bottomRightAP);

    this.attachPoints = [bottomLeftAP, bottomRightAP];
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

    const topLeftPos = new THREE.Vector3(-1, 0.5, -1);
    topLeft.handleObject.position.copy(topLeftPos);
    this.doubleHipRoof.add(topLeft.handleObject);

    const topRightPos = new THREE.Vector3(1, 0.5, -1);
    topRight.handleObject.position.copy(topRightPos);
    this.doubleHipRoof.add(topRight.handleObject);

    const bottomLeftPos = new THREE.Vector3(-1, 0.5, 1);
    bottomLeft.handleObject.position.copy(bottomLeftPos);
    this.doubleHipRoof.add(bottomLeft.handleObject);

    const bottomRightPos = new THREE.Vector3(1, 0.5, 1);
    bottomRight.handleObject.position.copy(bottomRightPos);
    this.doubleHipRoof.add(bottomRight.handleObject);

    const roofGeom = this.getRoofGeometry();
    const topHipVec = roofGeom[9];
    const bottomHipVec = roofGeom[13];

    const topHipPos = new THREE.Vector3(topHipVec.x, 0.5, topHipVec.z);
    topHip.handleObject.position.copy(topHipPos);
    this.doubleHipRoof.add(topHip.handleObject);

    const bottomHipPos = new THREE.Vector3(bottomHipVec.x, 0.5, bottomHipVec.z);
    bottomHip.handleObject.position.copy(bottomHipPos);
    this.doubleHipRoof.add(bottomHip.handleObject);

    const ridgePos = new THREE.Vector3(0, 0.5, 0);
    ridge.handleObject.position.copy(ridgePos);
    this.doubleHipRoof.add(ridge.handleObject);

    const rotatePos = new THREE.Vector3(1.5, 0.5, 0);
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

  get Base() {
    return this.structureBase;
  }

  get AttachPoints() {
    return this.attachPoints;
  }
}

export default DormerPersp;
