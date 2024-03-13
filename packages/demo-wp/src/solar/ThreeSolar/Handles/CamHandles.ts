/* eslint-disable max-classes-per-file */
import * as THREE from 'three';
import { BuildingModel } from '../Model/Model';
import { UI_ACTION } from '../Lib/sharedTypes';

type tDragParams = {
  dimensions?: THREE.Vector3;
  position: THREE.Vector3;
  name: string;
};

class ElevationHandle {
  params: tDragParams;
  handle: THREE.Object3D;
  elevationLine: THREE.LineSegments;

  constructor(dragParams: tDragParams) {
    this.params = dragParams;
    const spriteMat = new THREE.SpriteMaterial({
      side: THREE.DoubleSide,
    });
    this.handle = new THREE.Sprite(spriteMat);
    this.handle.scale.set(1, 0.5, 1);

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
  }
}

class CamHandles {
  camera: THREE.OrthographicCamera | null;
  building: BuildingModel | null;
  roofBottomLevel: ElevationHandle;
  roofTopLevel: ElevationHandle;
  elevationHandles: THREE.Object3D[];

  constructor() {
    this.camera = null;
    this.building = null;

    this.roofBottomLevel = new ElevationHandle({
      dimensions: new THREE.Vector3(0.1, 0.1, 0.2),
      position: new THREE.Vector3(0, 0, 0),
      name: UI_ACTION.ELEVATE_BASE,
    });

    this.roofTopLevel = new ElevationHandle({
      dimensions: new THREE.Vector3(0.1, 0.1, 0.2),
      position: new THREE.Vector3(0, 1, 0),
      name: UI_ACTION.ELEVATE_PEAK,
    });

    this.elevationHandles = [
      this.roofBottomLevel.handle,
      this.roofTopLevel.handle,
    ];
  }
}

export default CamHandles;
