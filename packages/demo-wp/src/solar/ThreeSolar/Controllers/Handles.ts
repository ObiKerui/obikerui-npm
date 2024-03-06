/* eslint-disable max-classes-per-file */
import * as THREE from 'three';
import { BuildingModel } from '../Model/Model';

type tDragParams = {
  dimensions?: THREE.Vector3;
  position: THREE.Vector3;
  name: string;
};

function constructHandle(params: tDragParams) {
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
  square.name = params.name;
  return square;
}

class ElevationHandle {
  params: tDragParams;
  handle: THREE.Mesh;
  elevationLine: THREE.LineSegments;
  // mesh: THREE.Mesh;

  constructor(dragParams: tDragParams) {
    this.params = dragParams;
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
    this.handle.name = this.params.name;
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

class Handles {
  building: BuildingModel | null;
  topLeft: THREE.Mesh;
  topRight: THREE.Mesh;
  bottomLeft: THREE.Mesh;
  bottomRight: THREE.Mesh;
  topHip: THREE.Mesh;
  bottomHip: THREE.Mesh;
  ridge: THREE.Mesh;
  rotateHandle: THREE.Mesh;
  roofBottomLevel: ElevationHandle;
  roofTopLevel: ElevationHandle;

  handlesArray: THREE.Mesh[];
  elevationHandles: THREE.Mesh[];

  constructor() {
    this.building = null;

    this.topLeft = constructHandle({
      position: new THREE.Vector3(-1, 0.5, -1),
      name: 'scale-topleft',
    });

    this.topRight = constructHandle({
      position: new THREE.Vector3(1, 0.5, -1),
      name: 'scale-topright',
    });

    this.bottomLeft = constructHandle({
      position: new THREE.Vector3(-1, 0.5, 1),
      name: 'scale-bottomleft',
    });

    this.bottomRight = constructHandle({
      position: new THREE.Vector3(1, 0.5, 1),
      name: 'scale-bottomright',
    });

    this.topHip = constructHandle({
      position: new THREE.Vector3(0, 0.5, -0.75),
      name: 'move-tophip',
    });

    this.bottomHip = constructHandle({
      position: new THREE.Vector3(0, 0.5, 0.75),
      name: 'move-bottomhip',
    });

    this.ridge = constructHandle({
      position: new THREE.Vector3(0, 0.5, 0),
      name: 'move-ridgeline',
    });

    this.rotateHandle = constructHandle({
      dimensions: new THREE.Vector3(0.2, 0, 0.2),
      position: new THREE.Vector3(1.5, 0.5, 0),
      name: 'rotate-building',
    });

    this.roofBottomLevel = new ElevationHandle({
      dimensions: new THREE.Vector3(0.1, 0.1, 0.2),
      position: new THREE.Vector3(0, 0, 0),
      name: 'adjust-roof-bottom',
    });

    this.roofTopLevel = new ElevationHandle({
      dimensions: new THREE.Vector3(0.1, 0.1, 0.2),
      position: new THREE.Vector3(0, 1, 0),
      name: 'adjust-roof-top',
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

    this.elevationHandles = [
      this.roofBottomLevel.handle,
      this.roofTopLevel.handle,
    ];
  }
}

export default Handles;
