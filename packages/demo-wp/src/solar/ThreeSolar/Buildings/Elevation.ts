import * as THREE from 'three';
import { convertToPoints } from '../Lib/Geometry';
import CamHandles from '../Handles/CamHandles';

class BuildingElev {
  doubleHipRoof: THREE.Mesh;
  camHandles: CamHandles | null;
  perimeter: THREE.Mesh;
  transform: THREE.Mesh;
  rotation: THREE.Mesh;
  anchor: THREE.Mesh;
  scale: THREE.Mesh;
  id: string;
  xyCursor: THREE.Mesh;

  constructor(id: string, doubleHipRoof: THREE.Mesh) {
    this.id = id;
    this.camHandles = null;

    const transRotGeom = new THREE.BoxGeometry();
    // Create a material with white color
    const transRotMat = new THREE.MeshBasicMaterial({
      color: 0x0000dd,
      wireframe: true,
      transparent: true,
      opacity: 0.0,
    });

    // Create a mesh with the geometry and material
    this.transform = new THREE.Mesh(transRotGeom, transRotMat);
    this.rotation = new THREE.Mesh(transRotGeom.clone(), transRotMat.clone());

    const anchorMat = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });

    const anchorGeom = new THREE.BoxGeometry(4, 4, 4);
    this.anchor = new THREE.Mesh(anchorGeom, anchorMat);

    const scaleMat = new THREE.MeshBasicMaterial({
      color: 0x00ccff,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });

    const scaleGeom = new THREE.BoxGeometry(4, 4, 4);
    this.scale = new THREE.Mesh(scaleGeom, scaleMat);

    const perimeterGeom = new THREE.BoxGeometry(2, 0, 2);
    const perimeterMat = new THREE.MeshBasicMaterial({
      color: 0xff000000,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    this.perimeter = new THREE.Mesh(perimeterGeom, perimeterMat);
    this.perimeter.name = `perimeter-${this.id}`;

    this.doubleHipRoof = doubleHipRoof;

    this.perimeter.add(this.doubleHipRoof);
    this.scale.add(this.perimeter);
    this.anchor.add(this.scale);
    this.rotation.add(this.anchor);
    this.transform.add(this.rotation);

    const circleGeom = new THREE.CircleGeometry(0.1);
    const circleMat = new THREE.MeshBasicMaterial({
      color: 0xdddddd,
      wireframe: true,
      side: THREE.DoubleSide,
    });
    this.xyCursor = new THREE.Mesh(circleGeom, circleMat);
    this.xyCursor.rotation.set(0, Math.PI / 2, 0);
    this.xyCursor.position.set(2, 1, 0);
    this.transform.add(this.xyCursor);
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

    // const vec = new THREE.Vector3();
    // cam.getWorldDirection(vec);
    // vec.multiplyScalar(dist);
    // vec.add(cam.position);
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

export default BuildingElev;
