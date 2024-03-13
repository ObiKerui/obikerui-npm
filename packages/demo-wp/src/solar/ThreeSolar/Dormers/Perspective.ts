import * as THREE from 'three';
import { convertToPoints } from '../Lib/Geometry';
import { HandleControl, Handle } from '../Handles/BuildingHandles';

class DormerPersp {
  doubleHipRoof: THREE.Mesh;
  handles: Handle[];
  perimeter: THREE.Mesh;
  transform: THREE.Mesh;
  rotation: THREE.Mesh;
  anchor: THREE.Mesh;
  scale: THREE.Mesh;
  id: string;
  // xyCursor: THREE.Mesh;

  constructor(id: string, doubleHipRoof: THREE.Mesh) {
    this.id = id;
    this.handles = [];

    const transRotGeom = new THREE.BoxGeometry();
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
    this.doubleHipRoof.castShadow = true;

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

  addHandles(handles: HandleControl) {
    const {
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
      topHip,
      bottomHip,
      ridge,
      rotateHandle,
    } = handles;

    const topLeftPos = new THREE.Vector3(-1, 0.5, -1);
    topLeft.handleObject.position.copy(topLeftPos);
    this.doubleHipRoof.add(topLeft.handleObject);

    const topRightPos = new THREE.Vector3(1, 0.5, -1);
    topRight.handleObject.position.copy(topRightPos);
    this.doubleHipRoof.add(topRight.handleObject);

    const bottomLeftPos = new THREE.Vector3(-1, 0.5, 1);
    bottomLeft.handleObject.position.copy(bottomLeftPos);
    this.doubleHipRoof.add(bottomLeft.handleObject);

    const bottomRightPos = new THREE.Vector3(1, 0.5, 1);
    bottomRight.handleObject.position.copy(bottomRightPos);
    this.doubleHipRoof.add(bottomRight.handleObject);

    const roofGeom = this.getRoofGeometry();
    const topHipVec = roofGeom[9];
    const bottomHipVec = roofGeom[13];

    const topHipPos = new THREE.Vector3(topHipVec.x, 0.5, topHipVec.z);
    topHip.handleObject.position.copy(topHipPos);
    this.doubleHipRoof.add(topHip.handleObject);

    const bottomHipPos = new THREE.Vector3(bottomHipVec.x, 0.5, bottomHipVec.z);
    bottomHip.handleObject.position.copy(bottomHipPos);
    this.doubleHipRoof.add(bottomHip.handleObject);

    const ridgePos = new THREE.Vector3(0, 0.5, 0);
    ridge.handleObject.position.copy(ridgePos);
    this.doubleHipRoof.add(ridge.handleObject);

    const rotatePos = new THREE.Vector3(1.5, 0.5, 0);
    rotateHandle.handleObject.position.copy(rotatePos);
    this.doubleHipRoof.add(rotateHandle.handleObject);

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

  getRoofGeometry() {
    const geometry = this.doubleHipRoof.geometry.getAttribute('position');
    const vectors = convertToPoints(geometry as THREE.BufferAttribute);
    return vectors;
  }

  setRoofGeometry(vectorPoints: THREE.Vector3[]) {
    this.doubleHipRoof.geometry.setFromPoints(vectorPoints);
  }
}

export default DormerPersp;
