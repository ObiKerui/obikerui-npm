/* eslint-disable class-methods-use-this */
/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */
import * as THREE from 'three';
import { convertToPoints } from '../Lib/Geometry';

const width = 2;
const left = (width / 2) * -1;
const right = (width / 2) * 1;

const depth = 2;
const back = (depth / 2) * -1;
const front = (depth / 2) * 1;

const base = 0;
const height = 0.5;
const roofBase = height - base;
const roofTop = 1.0;

const backHip = -0.75;
const frontHip = 0.75;

// faces
// 0, 1, 2, 0, 2, 3 back
// 0, 4, 7, 0, 7, 3 left
// 4, 5, 6, 4, 6, 7 front
// 1, 5, 6, 1, 6, 2

const walls = [
  new THREE.Vector3(left, base, back), // 0
  new THREE.Vector3(right, base, back), // 1
  new THREE.Vector3(right, roofBase, back), // right top back 2
  new THREE.Vector3(left, roofBase, back), // left top back 3

  new THREE.Vector3(left, base, front), // left bottom front 4
  new THREE.Vector3(right, base, front), // right bottom front 5
  new THREE.Vector3(right, roofBase, front), // right top front 6
  new THREE.Vector3(left, roofBase, front), // left top front 7
];

// [0, 2, 1]
// [0, 3, 4, 0, 4, 1]
// [3, 4, 5]
// [2, 5, 4, 2, 4, 1]

const doubleHipRoof = [
  new THREE.Vector3(left, roofBase, back), // left bottom back 0
  new THREE.Vector3(0, roofTop, backHip), // centre top hip 1
  new THREE.Vector3(right, roofBase, back), // right bottom back 2

  new THREE.Vector3(left, roofBase, front), // left bottom front 3
  new THREE.Vector3(0, roofTop, frontHip), // centre top hip 4
  new THREE.Vector3(right, roofBase, front), // right bottom front 5
];

const allPoints = [...walls, ...doubleHipRoof];

function constructGeometry() {
  const geometry = new THREE.BufferGeometry().setFromPoints(allPoints);
  const backFaces = [0, 1, 2, 0, 2, 3];
  const leftFaces = [0, 4, 7, 0, 7, 3];
  const rightFaces = [1, 5, 6, 1, 6, 2];
  const frontFaces = [4, 5, 6, 4, 6, 7];

  let roofBack = [0, 1, 2];
  let roofLeft = [0, 3, 4, 0, 4, 1];
  let roofFront = [3, 4, 5];
  let roofRight = [2, 5, 4, 2, 4, 1];

  roofBack = roofBack.map((x) => 8 + x);
  roofLeft = roofLeft.map((x) => 8 + x);
  roofFront = roofFront.map((x) => 8 + x);
  roofRight = roofRight.map((x) => 8 + x);

  const all = [
    ...backFaces,
    ...leftFaces,
    ...rightFaces,
    ...frontFaces,
    ...roofBack,
    ...roofLeft,
    ...roofFront,
    ...roofRight,
  ];
  geometry.setIndex(all);
  geometry.computeVertexNormals();

  return geometry;
}

// --------------

const perimeterBase = roofBase;
const perimeter = [
  new THREE.Vector3(left, perimeterBase, back), // top left
  new THREE.Vector3(right, 0, back), // to top right

  new THREE.Vector3(right, perimeterBase, back), // top right
  new THREE.Vector3(right, perimeterBase, front), // to bottom right

  new THREE.Vector3(right, perimeterBase, front), // bottom right
  new THREE.Vector3(left, perimeterBase, front), // to bottom left

  new THREE.Vector3(left, perimeterBase, front), // bottom left
  new THREE.Vector3(left, perimeterBase, back), // to top left
];

const roofOutline = [
  new THREE.Vector3(left, roofBase, back), // top left
  new THREE.Vector3(0, roofTop, backHip), // to top hip
  new THREE.Vector3(right, roofBase, back), // top right
  new THREE.Vector3(0, roofTop, backHip), // to top hip

  new THREE.Vector3(left, roofBase, front), // bottom left
  new THREE.Vector3(0, roofTop, frontHip), // to bottom hip
  new THREE.Vector3(right, roofBase, front), // bottom right
  new THREE.Vector3(0, roofTop, frontHip), // to bottom hip

  new THREE.Vector3(0, roofTop, backHip), // top ridge
  new THREE.Vector3(0, roofTop, frontHip), // to bottom ridge
];

const allPointsPlan = [...perimeter, ...roofOutline];

function constructOutline() {
  const geometry = new THREE.BufferGeometry().setFromPoints(allPointsPlan);
  return geometry;
}

class GeometryModifier {
  geometry: Geometry;
  constructor(geometry: Geometry) {
    this.geometry = geometry;
  }

  getGeometry() {
    const { geometry } = this;
    const positionGeometry = geometry.building.getAttribute('position');
    const vectors = convertToPoints(positionGeometry as THREE.BufferAttribute);
    return vectors;
  }

  setRoofGeometry(vectorPoints: THREE.Vector3[]) {
    const { geometry } = this;
    geometry.building.setFromPoints(vectorPoints);
  }

  getEavesHeightFromGround(vectors: THREE.Vector3[]) {
    const eavePointIndex = 2;
    const eavesHeight = vectors[eavePointIndex].y;
    return eavesHeight;
  }

  getRoofHeightFromGround(vectors: THREE.Vector3[]) {
    const roofPointIndex = 9;
    const roofHeight = vectors[roofPointIndex].y;
    return roofHeight;
  }

  getRoofHeightFromEaves(vectors: THREE.Vector3[]) {
    const eavePointIndex = 2;
    const roofPointIndex = 9;
    const eavesHeight = vectors[eavePointIndex].y;
    const roofHeight = vectors[roofPointIndex].y;
    return roofHeight - eavesHeight;
  }

  setRoofHeightFromGround(vectors: THREE.Vector3[], newRoofHeight: number) {
    const rootHipPoint1 = 9;
    const rootHipPoint2 = 12;

    const vecToTop = vectors[rootHipPoint1];
    const vecToBottom = vectors[rootHipPoint2];

    vecToTop.y = newRoofHeight;
    vecToBottom.y = newRoofHeight;

    return vectors;
  }

  // setRoofHeightFromEaves(newRoofHeight: number) {}

  setEavesHeightFromGround(vectors: THREE.Vector3[], newEavesHeight: number) {
    const veca = vectors[2];
    const vecb = vectors[3];
    const vecc = vectors[6];
    const vecd = vectors[7];

    const vece = vectors[8];
    const vecf = vectors[9];
    const vecg = vectors[10];
    const vech = vectors[11];
    const veci = vectors[12];
    const vecj = vectors[13];

    const scaledYPosition = newEavesHeight;
    veca.y = scaledYPosition;
    vecb.y = scaledYPosition;
    vecc.y = scaledYPosition;
    vecd.y = scaledYPosition;

    // const roofHeight = this.getRoofHeightFromEaves(vectors);
    const roofHeight = vecf.y - vece.y;
    const newRoofHeight = scaledYPosition + roofHeight;

    vece.y = scaledYPosition;
    vecf.y = newRoofHeight;
    vecg.y = scaledYPosition;
    vech.y = scaledYPosition;
    veci.y = newRoofHeight;
    vecj.y = scaledYPosition;

    return vectors;
  }
}

// --------------
class Geometry {
  building: THREE.BufferGeometry;
  outline: THREE.BufferGeometry;
  modifier: GeometryModifier;
  constructor() {
    this.building = constructGeometry();
    this.outline = constructOutline();
    this.modifier = new GeometryModifier(this);
  }
}

export { Geometry, GeometryModifier };
