import * as THREE from 'three';
import { convertToPoints } from '../Lib/Geometry';
import Handles from '../Controllers/Handles';

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
  new THREE.Vector3(-1, 1, -1), // top left
  new THREE.Vector3(0, 1.5, -0.75), // to top hip
  new THREE.Vector3(1, 1, -1), // top right
  new THREE.Vector3(0, 1.5, -0.75), // to top hip

  new THREE.Vector3(-1, 1, 1), // bottom left
  new THREE.Vector3(0, 1.5, 0.75), // to bottom hip
  new THREE.Vector3(1, 1, 1), // bottom right
  new THREE.Vector3(0, 1.5, 0.75), // to bottom hip

  new THREE.Vector3(0, 1.5, -0.75), // top ridge
  new THREE.Vector3(0, 1.5, 0.75), // to bottom ridge
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

class BuildingPlan {
  doubleHipRoof: THREE.LineSegments;
  handles: THREE.Mesh[];
  perimeter: THREE.Mesh;
  transform: THREE.Mesh;
  rotation: THREE.Mesh;
  anchor: THREE.Mesh;
  scale: THREE.Mesh;
  id: string;
  // xyCursor: THREE.Mesh;

  constructor(id: string) {
    this.id = id;
    this.handles = [];

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
      color: 0xeeeeee,
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

    // const circleGeom = new THREE.CircleGeometry(0.1);
    // const circleMat = new THREE.MeshBasicMaterial({
    //   color: 0xdddddd,
    //   wireframe: true,
    // });
    // this.xyCursor = new THREE.Mesh(circleGeom, circleMat);
    // this.xyCursor.rotation.set(Math.PI / 2, 0, 0);
    // this.transform.add(this.xyCursor);
  }

  addHandles(handles: Handles) {
    // TODO: What about if the roof height exceeds this?
    // the handle needs to always be on top
    const handleHeight = 1.8;
    const topLeftPos = new THREE.Vector3(-1, handleHeight, -1);
    handles.topLeft.position.copy(topLeftPos);
    this.doubleHipRoof.add(handles.topLeft);

    const topRightPos = new THREE.Vector3(1, handleHeight, -1);
    handles.topRight.position.copy(topRightPos);
    this.doubleHipRoof.add(handles.topRight);

    const bottomLeftPos = new THREE.Vector3(-1, handleHeight, 1);
    handles.bottomLeft.position.copy(bottomLeftPos);
    this.doubleHipRoof.add(handles.bottomLeft);

    const bottomRightPos = new THREE.Vector3(1, handleHeight, 1);
    handles.bottomRight.position.copy(bottomRightPos);
    this.doubleHipRoof.add(handles.bottomRight);

    const roofGeom = this.getRoofGeometry();
    const topHipVec = roofGeom[9];
    const bottomHipVec = roofGeom[13];

    const topHipPos = new THREE.Vector3(topHipVec.x, handleHeight, topHipVec.z);
    handles.topHip.position.copy(topHipPos);
    this.doubleHipRoof.add(handles.topHip);

    const bottomHipPos = new THREE.Vector3(
      bottomHipVec.x,
      handleHeight,
      bottomHipVec.z
    );
    handles.bottomHip.position.copy(bottomHipPos);
    this.doubleHipRoof.add(handles.bottomHip);

    const ridgePos = new THREE.Vector3(0, handleHeight, 0);
    handles.ridge.position.copy(ridgePos);
    this.doubleHipRoof.add(handles.ridge);

    const rotatePos = new THREE.Vector3(1.5, handleHeight, 0);
    handles.rotateHandle.position.copy(rotatePos);
    this.doubleHipRoof.add(handles.rotateHandle);

    // WARN careful of this - could cause a bug down the line when handles
    // are switched to another mesh object
    // currently accessed by the RoofControl when moving ridge and
    // the ScaleControl when applying inverse scaling
    this.handles = [
      handles.topLeft,
      handles.topRight,
      handles.bottomLeft,
      handles.bottomRight,
      handles.topHip,
      handles.bottomHip,
      handles.ridge,
      handles.rotateHandle,
    ];
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

export default BuildingPlan;
