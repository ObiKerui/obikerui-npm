import * as THREE from 'three';

const perimeter = [
  new THREE.Vector3(-1, 0, -1), // top left
  new THREE.Vector3(1, 0, -1), // to top right

  new THREE.Vector3(1, 0, -1), // top right
  new THREE.Vector3(1, 0, 1), // to bottom right

  new THREE.Vector3(1, 0, 1), // bottom right
  new THREE.Vector3(-1, 0, 1), // to bottom left

  new THREE.Vector3(-1, 0, 1), // bottom left
  new THREE.Vector3(-1, 0, -1), // to top left
];

const doubleHipRoof = [
  new THREE.Vector3(-1, 0, -1), // top left
  new THREE.Vector3(0, 0, -0.75), // to top hip
  new THREE.Vector3(1, 0, -1), // top right
  new THREE.Vector3(0, 0, -0.75), // to top hip

  new THREE.Vector3(-1, 0, 1), // bottom left
  new THREE.Vector3(0, 0, 0.75), // to bottom hip
  new THREE.Vector3(1, 0, 1), // bottom right
  new THREE.Vector3(0, 0, 0.75), // to bottom hip

  new THREE.Vector3(0, 0, -0.75), // top ridge
  new THREE.Vector3(0, 0, 0.75), // to bottom ridge
];

const allPoints = [...perimeter, ...doubleHipRoof];

function constructRoof() {
  const geometry = new THREE.BufferGeometry().setFromPoints(allPoints);

  const material = new THREE.LineBasicMaterial({
    color: 0x00ff00,
  });

  const cube = new THREE.LineSegments(geometry, material);
  return cube;
}

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

class BuildingPlan {
  doubleHipRoof: THREE.LineSegments;
  scaleHandles: THREE.Mesh[];
  perimeter: THREE.Mesh;
  transform: THREE.Mesh;
  rotation: THREE.Mesh;
  anchor: THREE.Mesh;
  scale: THREE.Mesh;
  // xyCursor: THREE.Mesh;

  constructor() {
    const topLeft = constructHandle({
      position: new THREE.Vector3(-1, 0.5, -1),
      name: 'scale-topleft',
    });

    const topRight = constructHandle({
      position: new THREE.Vector3(1, 0.5, -1),
      name: 'scale-topright',
    });

    const bottomLeft = constructHandle({
      position: new THREE.Vector3(-1, 0.5, 1),
      name: 'scale-bottomleft',
    });

    const bottomRight = constructHandle({
      position: new THREE.Vector3(1, 0.5, 1),
      name: 'scale-bottomright',
    });

    const topHip = constructHandle({
      position: new THREE.Vector3(0, 0.5, -0.75),
      name: 'move-tophip',
    });

    const bottomHip = constructHandle({
      position: new THREE.Vector3(0, 0.5, 0.75),
      name: 'move-bottomhip',
    });

    const ridgeLine = constructHandle({
      position: new THREE.Vector3(0, 0.5, 0),
      name: 'move-ridgeline',
    });

    const rotateHandle = constructHandle({
      dimensions: new THREE.Vector3(0.2, 0, 0.2),
      position: new THREE.Vector3(1.5, 0.5, 0),
      name: 'rotate-building',
    });

    this.scaleHandles = [
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
      topHip,
      bottomHip,
      ridgeLine,
      rotateHandle,
    ];

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

    const perimeterGeom = new THREE.BoxGeometry(2, 2, 2);
    const perimeterMat = new THREE.MeshBasicMaterial({
      color: 0xeeeeee,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    this.perimeter = new THREE.Mesh(perimeterGeom, perimeterMat);
    this.perimeter.name = 'perimeter';

    this.doubleHipRoof = constructRoof();

    this.doubleHipRoof.add(topLeft);
    this.doubleHipRoof.add(topRight);
    this.doubleHipRoof.add(bottomLeft);
    this.doubleHipRoof.add(bottomRight);
    this.doubleHipRoof.add(topHip);
    this.doubleHipRoof.add(bottomHip);
    this.doubleHipRoof.add(ridgeLine);
    this.doubleHipRoof.add(rotateHandle);

    this.perimeter.add(this.doubleHipRoof);
    this.scale.add(this.perimeter);
    this.anchor.add(this.scale);
    this.rotation.add(this.anchor);
    this.transform.add(this.rotation);

    // const circleGeom = new THREE.CircleGeometry(0.1);
    // const circleMat = new THREE.MeshBasicMaterial({
    //   color: 0xdddddd,
    //   wireframe: true,
    // });
    // this.xyCursor = new THREE.Mesh(circleGeom, circleMat);
    // this.xyCursor.rotation.set(Math.PI / 2, 0, 0);
    // this.transform.add(this.xyCursor);
  }
}

export default BuildingPlan;
