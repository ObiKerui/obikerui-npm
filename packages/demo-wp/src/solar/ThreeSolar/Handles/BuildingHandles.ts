/* eslint-disable max-classes-per-file */
import * as THREE from 'three';
import { BuildingModel } from '../Model/Model';
import { UI_ACTION } from '../Lib/sharedTypes';

type tHandleParams = {
  dimensions?: THREE.Vector3;
  position: THREE.Vector3;
  id: UI_ACTION;
};

function constructHandle(params: tHandleParams) {
  // Create a box geometry with no height
  let dims = new THREE.Vector3(0.2, 0, 0.1);
  if (params.dimensions) {
    dims = params.dimensions;
  }
  const geometry = new THREE.BoxGeometry(dims.x, dims.y, dims.z);

  // Create a material with white color
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // Create a mesh with the geometry and material
  const square = new THREE.Mesh(geometry, material);
  square.position.copy(params.position);
  square.name = params.id;
  return square;
}

class ElevationHandle {
  attrs: tHandleParams;
  handle: THREE.Mesh;
  elevationLine: THREE.LineSegments;

  constructor(attrs: tHandleParams) {
    this.attrs = attrs;
    const handleGeom = new THREE.BoxGeometry(0.1, 0.1, 0.2);
    const handleMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    this.handle = new THREE.Mesh(handleGeom, handleMat);

    const lineGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 50),
      new THREE.Vector3(0, 0, -50),
    ]);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xff000000,
      transparent: true,
      opacity: 0.1,
    });
    this.elevationLine = new THREE.LineSegments(lineGeom, lineMat);
    this.handle.name = this.attrs.id;
    this.handle.add(this.elevationLine);

    // const transformMat = new THREE.MeshBasicMaterial({
    //   color: 0x00ccff,
    //   wireframe: true,
    //   transparent: true,
    //   opacity: 0,
    // });

    // const transformGeom = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    // this.mesh = new THREE.Mesh(transformGeom, transformMat);
    // this.mesh.add(this.elevationLine);
    // this.mesh.add(this.handle);
  }
}

class Handle {
  handleObject: THREE.Mesh;
  attrs: tHandleParams;
  constructor(attrs: tHandleParams) {
    this.attrs = attrs;
    this.handleObject = constructHandle(attrs);
  }

  onMouseDown() {
    console.log('handle mouse down');
  }

  onMouseUp() {
    console.log('handle mouse up');
  }
}

// these could be sprites and not meshes in future
class HandleControl {
  building: BuildingModel | null;
  topLeft: Handle;
  topRight: Handle;
  bottomLeft: Handle;
  bottomRight: Handle;
  topHip: Handle;
  bottomHip: Handle;
  ridge: Handle;
  rotateHandle: Handle;
  roofBottomLevel: ElevationHandle;
  roofTopLevel: ElevationHandle;

  handlesArray: Handle[];
  elevationHandles: ElevationHandle[];

  constructor() {
    this.building = null;

    this.topLeft = new Handle({
      position: new THREE.Vector3(-1, 0.5, -1),
      id: UI_ACTION.SCALE_NW,
    });

    this.topRight = new Handle({
      position: new THREE.Vector3(1, 0.5, -1),
      id: UI_ACTION.SCALE_NE,
    });

    this.bottomLeft = new Handle({
      position: new THREE.Vector3(-1, 0.5, 1),
      id: UI_ACTION.SCALE_SW,
    });

    this.bottomRight = new Handle({
      position: new THREE.Vector3(1, 0.5, 1),
      id: UI_ACTION.SCALE_SE,
    });

    this.topHip = new Handle({
      position: new THREE.Vector3(0, 0.5, -0.75),
      id: UI_ACTION.MOVE_N_HIP,
    });

    this.bottomHip = new Handle({
      position: new THREE.Vector3(0, 0.5, 0.75),
      id: UI_ACTION.MOVE_S_HIP,
    });

    this.ridge = new Handle({
      position: new THREE.Vector3(0, 0.5, 0),
      id: UI_ACTION.MOVE_RIDGE,
    });

    this.rotateHandle = new Handle({
      dimensions: new THREE.Vector3(0.2, 0, 0.2),
      position: new THREE.Vector3(1.5, 0.5, 0),
      id: UI_ACTION.ROTATE_STRUCTURE,
    });

    this.roofBottomLevel = new ElevationHandle({
      dimensions: new THREE.Vector3(0.1, 0.1, 0.2),
      position: new THREE.Vector3(0, 0, 0),
      id: UI_ACTION.ELEVATE_BASE,
    });

    this.roofTopLevel = new ElevationHandle({
      dimensions: new THREE.Vector3(0.1, 0.1, 0.2),
      position: new THREE.Vector3(0, 1, 0),
      id: UI_ACTION.ELEVATE_PEAK,
    });

    this.handlesArray = [
      this.topLeft,
      this.topRight,
      this.bottomLeft,
      this.bottomRight,
      this.topHip,
      this.bottomHip,
      this.ridge,
      this.rotateHandle,
    ];

    this.elevationHandles = [this.roofBottomLevel, this.roofTopLevel];
  }

  removeFromScene() {
    this.topLeft.handleObject.removeFromParent();
    this.topRight.handleObject.removeFromParent();
    this.bottomLeft.handleObject.removeFromParent();
    this.bottomRight.handleObject.removeFromParent();
    this.topHip.handleObject.removeFromParent();
    this.bottomHip.handleObject.removeFromParent();
    this.ridge.handleObject.removeFromParent();
    this.rotateHandle.handleObject.removeFromParent();
  }
}

export { HandleControl, Handle };
