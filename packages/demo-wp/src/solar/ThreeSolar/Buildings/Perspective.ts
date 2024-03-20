import * as THREE from 'three';
import { convertToPoints } from '../Lib/Geometry';
import StructureBase from '../Lib/StructureBase';
import { Ipersp } from '../Lib/Structure';

class BuildingPersp implements Ipersp {
  doubleHipRoof: THREE.Mesh;
  structureBase: StructureBase;
  handles: THREE.Mesh[];
  id: string;
  // xyCursor: THREE.Mesh;

  constructor(id: string, doubleHipRoof: THREE.Mesh) {
    this.id = id;
    this.handles = [];
    this.doubleHipRoof = doubleHipRoof;
    this.structureBase = new StructureBase(id, doubleHipRoof);
  }

  getRoofGeometry() {
    const geometry = this.doubleHipRoof.geometry.getAttribute('position');
    const vectors = convertToPoints(geometry as THREE.BufferAttribute);
    return vectors;
  }

  setRoofGeometry(vectorPoints: THREE.Vector3[]) {
    this.doubleHipRoof.geometry.setFromPoints(vectorPoints);
  }

  get Base() {
    return this.structureBase;
  }

  // eslint-disable-next-line class-methods-use-this
  get AttachPoints() {
    return [];
  }
}

export default BuildingPersp;
