/* eslint-disable max-classes-per-file */
import * as THREE from 'three';
import Geometry from './Geometry';
import DormerPlan from './Plan';
import DormerPersp from './Perspective';
import DormerElev from './Elevation';
import { IEventMgr, Istructure } from '../Lib/Structure';
import { STRUCTURE_TYPE } from '../Lib/sharedTypes';
import DormerEventControl from './EventControl';
import { IMountable, IMountableBase } from '../Lib/Mounting/MountingControl';

class Mountable implements IMountableBase {
  dormerModel: Istructure;
  parent: Istructure | null;

  constructor(dormer: Istructure) {
    this.dormerModel = dormer;
    this.parent = null;
  }

  get MountParent(): Istructure | null {
    return this.parent;
  }

  set MountParent(parent: Istructure | null) {
    this.parent = parent;
  }
}

class DormerModel implements Istructure, IMountable {
  dormerPlan: DormerPlan;
  dormerPersp: DormerPersp;
  dormerElev: DormerElev;
  id: string;
  structureType: STRUCTURE_TYPE;
  eventMgr: DormerEventControl;
  mountable: Mountable;

  constructor(id: string) {
    this.structureType = STRUCTURE_TYPE.DORMER;
    this.id = id;
    const geometry = new Geometry();

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

    this.dormerPlan = new DormerPlan(this.id, outline);
    this.dormerPersp = new DormerPersp(this.id, perspMesh);
    this.dormerElev = new DormerElev(this.id, elevMesh);

    this.eventMgr = new DormerEventControl(this);

    this.mountable = new Mountable(this);
  }

  get EventMgr(): IEventMgr {
    return this.eventMgr;
  }

  get MountableBase(): IMountableBase {
    return this.mountable;
  }

  get Type() {
    return this.structureType;
  }

  get ID() {
    return this.id;
  }

  get Handle() {
    return this.dormerPlan.structureBase.perimeter;
  }

  get Plan() {
    return this.dormerPlan;
  }

  get Persp() {
    return this.dormerPersp;
  }

  get Elevation() {
    return this.dormerElev;
  }
}

export default DormerModel;
