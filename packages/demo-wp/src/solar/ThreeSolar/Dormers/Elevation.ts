import * as THREE from 'three';
import { convertToPoints } from '../Lib/Geometry';
import CamHandles from '../Handles/CamHandles';
import StructureBase from '../Lib/StructureBase';

class DormerElev {
  doubleHipRoof: THREE.Mesh;
  structureBase: StructureBase;
  camHandles: CamHandles | null;
  id: string;
  // xyCursor: THREE.Mesh;

  constructor(id: string, doubleHipRoof: THREE.Mesh) {
    this.id = id;
    this.camHandles = null;
    this.doubleHipRoof = doubleHipRoof;
    this.structureBase = new StructureBase(id, doubleHipRoof);
  }

  addCamHandles(handles: CamHandles) {
    let { camHandles } = this;

    camHandles = handles;

    // position right in front of the camera but at the correct heights.
    const cam = camHandles.camera;
    if (!cam) {
      return;
    }

    const roofBaseHeight = 1;
    const zoomedBaseHeight = cam.zoom * roofBaseHeight;
    const roofBaseHandle = handles.elevationHandles[0];
    roofBaseHandle.position.copy(new THREE.Vector3(3, zoomedBaseHeight, 9));

    const roofTopHeight = 1.5;
    const zoomedTopHeight = cam.zoom * roofTopHeight;
    const roofTopHandle = handles.elevationHandles[1];
    roofTopHandle.position.copy(new THREE.Vector3(3, zoomedTopHeight, 9));
  }

  updateHandles() {
    const { camHandles } = this;
    if (!camHandles) {
      return;
    }

    const { camera } = camHandles;
    if (!camera) {
      return;
    }

    const geom = this.getRoofGeometry();
    const roofBaseHeight = geom[2].y;
    const roofTopHeight = geom[9].y;

    const zoomedBaseHeight = camera.zoom * roofBaseHeight;
    const roofBaseHandle = camHandles.roofBottomLevel.handle;
    roofBaseHandle.position.copy(new THREE.Vector3(3, zoomedBaseHeight, 9));

    const zoomedTopHeight = camera.zoom * roofTopHeight;
    const roofTopHandle = camHandles.roofTopLevel.handle;
    roofTopHandle.position.copy(new THREE.Vector3(3, zoomedTopHeight, 9));
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

export default DormerElev;
