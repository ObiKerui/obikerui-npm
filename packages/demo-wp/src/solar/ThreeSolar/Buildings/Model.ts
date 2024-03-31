import * as THREE from 'three';
import BuildingPlan from './Plan';
import BuildingPersp from './Perspective';
import BuildingElev from './Elevation';
import { Istructure } from '../Lib/Structure';
import Geometry from './Geometry';
import { STRUCTURE_TYPE } from '../Lib/sharedTypes';
import BuildingEventControl from './EventControl';

class BuildingModel implements Istructure {
  buildingPlan: BuildingPlan;
  buildingPersp: BuildingPersp;
  buildingElev: BuildingElev;
  id: string;
  structureType: STRUCTURE_TYPE;
  eventMgr: BuildingEventControl;

  constructor(id: string) {
    this.structureType = STRUCTURE_TYPE.BUILDING;
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

    this.buildingPlan = new BuildingPlan(this.id, outline);
    this.buildingPersp = new BuildingPersp(this.id, perspMesh);
    this.buildingElev = new BuildingElev(this.id, elevMesh);

    this.eventMgr = new BuildingEventControl(this);
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
}

export default BuildingModel;
