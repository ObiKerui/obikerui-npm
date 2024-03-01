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

// function constructBuilding() {
//   const geometry = new THREE.BufferGeometry().setFromPoints(perimeter);
//   geometry.computeVertexNormals();
//   const material = new THREE.LineBasicMaterial({
//     color: 0x00ff00,
//   });
//   const cube = new THREE.LineLoop(geometry, material);

//   return cube;
// }

function constructRoof() {
  const geometry = new THREE.BufferGeometry().setFromPoints(allPoints);

  const material = new THREE.LineBasicMaterial({
    color: 0x00ff00,
  });

  const cube = new THREE.LineSegments(geometry, material);
  return cube;
}

type tDragParams = {
  position: THREE.Vector3;
  name: string;
};

function constructScaleHandle(params: tDragParams) {
  // Create a box geometry with no height
  const geometry = new THREE.BoxGeometry(0.2, 0, 0.1);

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
  xyCursor: THREE.Mesh;

  constructor() {
    this.doubleHipRoof = constructRoof();

    const topLeft = constructScaleHandle({
      position: new THREE.Vector3(-1, 0, -1),
      name: 'scale-topleft',
    });

    const topRight = constructScaleHandle({
      position: new THREE.Vector3(1, 0, -1),
      name: 'scale-topright',
    });

    const bottomLeft = constructScaleHandle({
      position: new THREE.Vector3(-1, 0, 1),
      name: 'scale-bottomleft',
    });

    const bottomRight = constructScaleHandle({
      position: new THREE.Vector3(1, 0, 1),
      name: 'scale-bottomright',
    });

    const topHip = constructScaleHandle({
      position: new THREE.Vector3(0, 0, -0.75),
      name: 'move-tophip',
    });

    const bottomHip = constructScaleHandle({
      position: new THREE.Vector3(0, 0, 0.75),
      name: 'move-bottomhip',
    });

    const ridgeLine = constructScaleHandle({
      position: new THREE.Vector3(0, 0, 0),
      name: 'move-ridgeline',
    });

    const rotateHandle = constructScaleHandle({
      position: new THREE.Vector3(1.5, 0, 0),
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
      color: 0x000000,
      wireframe: true,
      opacity: 0,
    });

    // Create a mesh with the geometry and material
    this.transform = new THREE.Mesh(transRotGeom, transRotMat);
    this.rotation = new THREE.Mesh(transRotGeom.clone(), transRotMat.clone());

    const anchorMat = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      wireframe: true,
    });

    const anchorGeom = new THREE.BoxGeometry(4, 4, 4);
    this.anchor = new THREE.Mesh(anchorGeom, anchorMat);

    const scaleMat = new THREE.MeshBasicMaterial({
      color: 0x00ccff,
      wireframe: true,
    });

    const scaleGeom = new THREE.BoxGeometry(4, 4, 4);
    this.scale = new THREE.Mesh(scaleGeom, scaleMat);

    const perimeterGeom = new THREE.BoxGeometry(1, 1, 1);
    const perimeterMat = new THREE.MeshBasicMaterial({
      color: 0x777777,
      wireframe: true,
    });
    this.perimeter = new THREE.Mesh(perimeterGeom, perimeterMat);

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

    const circleGeom = new THREE.CircleGeometry(0.1);
    const circleMat = new THREE.MeshBasicMaterial({
      color: 0xdddddd,
      wireframe: true,
    });
    this.xyCursor = new THREE.Mesh(circleGeom, circleMat);
    this.xyCursor.rotation.set(Math.PI / 2, 0, 0);
    this.transform.add(this.xyCursor);
  }
}

export default BuildingPlan;
