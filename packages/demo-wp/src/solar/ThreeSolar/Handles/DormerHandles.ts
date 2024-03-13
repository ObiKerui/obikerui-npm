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

class DormerHandles {
  building: BuildingModel | null;
  topLeft: THREE.Mesh;
  topRight: THREE.Mesh;
  bottomLeft: THREE.Mesh;
  bottomRight: THREE.Mesh;
  topHip: THREE.Mesh;
  bottomHip: THREE.Mesh;
  ridge: THREE.Mesh;
  rotateHandle: THREE.Mesh;

  handlesArray: THREE.Mesh[];

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
  }
}

export default DormerHandles;
