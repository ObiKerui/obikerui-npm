import * as THREE from 'three';
import { convertToPoints } from '../Lib/Geometry';
import CamHandles from '../Handles/CamHandles';

// 0, 1, 2, 0, 2, 3 back
// 0, 4, 7, 0, 7, 3 left
// 4, 5, 6, 4, 6, 7 front
// 1, 5, 6, 1, 6, 2

const perimeter = [
  new THREE.Vector3(-1, 0, -1), // left bottom back 0
  new THREE.Vector3(1, 0, -1), // right bottom back 1
  new THREE.Vector3(1, 1, -1), // right top back 2
  new THREE.Vector3(-1, 1, -1), // left top back 3

  new THREE.Vector3(-1, 0, 1), // left bottom front 4
  new THREE.Vector3(1, 0, 1), // right bottom front 5
  new THREE.Vector3(1, 1, 1), // right top front 6
  new THREE.Vector3(-1, 1, 1), // left top front 7
];

// [0, 2, 1]
// [0, 3, 4, 0, 4, 1]
// [3, 4, 5]
// [2, 5, 4, 2, 4, 1]

const doubleHipRoof = [
  new THREE.Vector3(-1, 1, -1), // left bottom back 8
  new THREE.Vector3(0, 1.5, -0.75), // centre top hip 9
  new THREE.Vector3(1, 1, -1), // right bottom back 10

  new THREE.Vector3(-1, 1, 1), // left bottom front 11
  new THREE.Vector3(0, 1.5, 0.75), // centre top hip 12
  new THREE.Vector3(1, 1, 1), // right bottom front 13
];

const allPoints = [...perimeter, ...doubleHipRoof];

function constructRoof() {
  const geometry = new THREE.BufferGeometry().setFromPoints(allPoints);
  const back = [0, 1, 2, 0, 2, 3];
  const left = [0, 4, 7, 0, 7, 3];
  const right = [1, 5, 6, 1, 6, 2];
  const front = [4, 5, 6, 4, 6, 7];

  let roofBack = [0, 1, 2];
  let roofLeft = [0, 3, 4, 0, 4, 1];
  let roofFront = [3, 4, 5];
  let roofRight = [2, 5, 4, 2, 4, 1];

  roofBack = roofBack.map((x) => 8 + x);
  roofLeft = roofLeft.map((x) => 8 + x);
  roofFront = roofFront.map((x) => 8 + x);
  roofRight = roofRight.map((x) => 8 + x);

  const all = [
    ...back,
    ...left,
    ...right,
    ...front,
    ...roofBack,
    ...roofLeft,
    ...roofFront,
    ...roofRight,
  ];
  geometry.setIndex(all);
  geometry.computeVertexNormals();

  const material = new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide,
    flatShading: true,
  });

  const cube = new THREE.Mesh(geometry, material);
  return cube;
}

type tDragParams = {
  dimensions?: THREE.Vector3;
  position: THREE.Vector3;
  name: string;
};

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

  constructor(id: string) {
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

    this.doubleHipRoof = constructRoof();

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

  // addHandles(handles: Handles) {
  //   const roofBottomPos = new THREE.Vector3(1, 1, 1.5);
  //   const roofBottomMesh = handles.roofBottomLevel.handle;
  //   roofBottomMesh.position.copy(roofBottomPos);
  //   this.doubleHipRoof.add(roofBottomMesh);

  //   const roofTopPos = new THREE.Vector3(1, 1.5, 1.5);
  //   const roofTopMesh = handles.roofTopLevel.handle;
  //   roofTopMesh.position.copy(roofTopPos);
  //   this.doubleHipRoof.add(roofTopMesh);
  // }

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
    console.log('update handles start: ', this);
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

  // currently nothing needs to be done here - when adding meshes to different
  // meshes as children - ie. building trans/rot/scale/ meshs then object added is
  // removed from any other parent mesh - but may change in future
  removeHandles() {}

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
