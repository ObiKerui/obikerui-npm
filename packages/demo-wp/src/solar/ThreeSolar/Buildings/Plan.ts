import * as THREE from 'three';

const perimeter = [
  new THREE.Vector3(-1, 0, -1), // bottom left
  new THREE.Vector3(1, 0, -1), // bottom right back

  new THREE.Vector3(1, 0, -1), // bottom right back
  new THREE.Vector3(1, 0, 1), // bottom right back

  new THREE.Vector3(1, 0, 1), // top right back
  new THREE.Vector3(-1, 0, 1), // top left back

  new THREE.Vector3(-1, 0, 1), // bottom right back
  new THREE.Vector3(-1, 0, -1), // bottom right back
];

const doubleHipRoof = [
  new THREE.Vector3(-1, 0, -1), // bottom left
  new THREE.Vector3(0, 0, -0.75), // bottom right back
  new THREE.Vector3(1, 0, -1), // top right back
  new THREE.Vector3(0, 0, -0.75), // top left back

  new THREE.Vector3(-1, 0, 1), // top left
  new THREE.Vector3(0, 0, 0.75), // top left middle
  new THREE.Vector3(1, 0, 1), // top right
  new THREE.Vector3(0, 0, 0.75), // top right middle

  new THREE.Vector3(0, 0, -0.75), // top left
  new THREE.Vector3(0, 0, 0.75), // top left middle
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

function constructScaleHandle(position: THREE.Vector3) {
  // Create a box geometry with no height
  const geometry = new THREE.BoxGeometry(0.2, 0, 0.1);

  // Create a material with white color
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // Create a mesh with the geometry and material
  const square = new THREE.Mesh(geometry, material);
  square.position.copy(position);
  return square;
}

class BuildingPlan {
  doubleHipRoof: THREE.LineSegments;
  scaleHandles: THREE.Mesh[];
  transform: THREE.Mesh;

  constructor() {
    this.doubleHipRoof = constructRoof();
    const topLeft = constructScaleHandle(new THREE.Vector3(-1, 0, -1));
    const topRight = constructScaleHandle(new THREE.Vector3(1, 0, -1));
    const bottomLeft = constructScaleHandle(new THREE.Vector3(-1, 0, 1));
    const bottomRight = constructScaleHandle(new THREE.Vector3(1, 0, 1));

    const topHip = constructScaleHandle(new THREE.Vector3(0, 0, -0.75));
    const bottomHip = constructScaleHandle(new THREE.Vector3(0, 0, 0.75));
    const ridgeLine = constructScaleHandle(new THREE.Vector3(0, 0, 0));

    const rotateHandle = constructScaleHandle(new THREE.Vector3(1.5, 0, 0));

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

    const geometry = new THREE.BoxGeometry();
    // Create a material with white color
    const material = new THREE.MeshBasicMaterial({
      color: 0x444444,
      wireframe: true,
    });

    // Create a mesh with the geometry and material
    this.transform = new THREE.Mesh(geometry, material);
    this.transform.add(this.doubleHipRoof);
    this.transform.add(topLeft);
    this.transform.add(topRight);
    this.transform.add(bottomLeft);
    this.transform.add(bottomRight);
    this.transform.add(topHip);
    this.transform.add(bottomHip);
    this.transform.add(ridgeLine);
    this.transform.add(rotateHandle);
  }
}

export default BuildingPlan;
