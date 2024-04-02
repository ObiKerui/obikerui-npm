/* eslint-disable max-classes-per-file */
import * as THREE from 'three';
import BuildingPlan from './Plan';
import BuildingPersp from './Perspective';
import BuildingElev from './Elevation';
import { Istructure } from '../Lib/Structure';
import { Geometry, GeometryModifier } from './Geometry';
import { STRUCTURE_TYPE } from '../Lib/sharedTypes';
import BuildingEventControl from './EventControl';
import { IMount, IMountBase } from '../Lib/Mounting/MountingControl';

class Mounting implements IMountBase {
  buildingModel: Istructure;
  planBase: THREE.Object3D;
  perspBase: THREE.Object3D;
  elevBase: THREE.Object3D;

  constructor(buildingModel: Istructure) {
    this.buildingModel = buildingModel;
    const eavesHeight = 0.5; // need to figure this out
    const position = new THREE.Vector3(0, eavesHeight, 0);

    this.planBase = new THREE.Object3D();
    this.planBase.position.copy(position);
    const { Base: planBase } = this.buildingModel.Plan;
    planBase.rotation.add(this.planBase);

    this.perspBase = new THREE.Object3D();
    this.perspBase.position.copy(position);
    const { Base: perspBase } = this.buildingModel.Persp;
    perspBase.rotation.add(this.perspBase);

    this.elevBase = new THREE.Object3D();
    this.elevBase.position.copy(position);
    const { Base: elevBase } = this.buildingModel.Elevation;
    elevBase.rotation.add(this.elevBase);
  }

  get Plan() {
    return this.planBase;
  }
  get Persp() {
    return this.perspBase;
  }
  get Elevation() {
    return this.elevBase;
  }
}

class BuildingModel implements Istructure, IMount {
  buildingPlan: BuildingPlan;
  buildingPersp: BuildingPersp;
  buildingElev: BuildingElev;
  id: string;
  structureType: STRUCTURE_TYPE;
  eventMgr: BuildingEventControl;
  mountBase: IMountBase;
  geometryModifier: GeometryModifier;

  constructor(id: string) {
    this.structureType = STRUCTURE_TYPE.BUILDING;
    this.id = id;

    const geometry = new Geometry();
    this.geometryModifier = geometry.modifier;

    const perspMat = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      flatShading: true,
    });

    const perspMesh = new THREE.Mesh(geometry.building, perspMat);

    const elevMat = new THREE.MeshNormalMaterial({
      side: THREE.DoubleSide,
      flatShading: true,
    });

    const elevMesh = new THREE.Mesh(geometry.building, elevMat);

    const outlineMat = new THREE.LineBasicMaterial({
      color: 0x00ff00,
    });
    const outline = new THREE.LineSegments(geometry.outline, outlineMat);

    this.buildingPlan = new BuildingPlan(this.id, outline);
    this.buildingPersp = new BuildingPersp(this.id, perspMesh);
    this.buildingElev = new BuildingElev(this.id, elevMesh);

    this.eventMgr = new BuildingEventControl(this);
    this.mountBase = new Mounting(this);
  }

  get Type() {
    return this.structureType;
  }

  get ID() {
    return this.id;
  }

  get Handle() {
    return this.buildingPlan.structureBase.perimeter;
  }

  get Plan() {
    return this.buildingPlan;
  }

  get Persp() {
    return this.buildingPersp;
  }

  get Elevation() {
    return this.buildingElev;
  }

  get EventMgr() {
    return this.eventMgr;
  }

  get MountBase(): IMountBase {
    return this.mountBase;
  }
}

export default BuildingModel;
