import * as THREE from 'three';
import Geometry from './Geometry';
import DormerPlan from './Plan';
import DormerPersp from './Perspective';
import DormerElev from './Elevation';
import Istructure from '../Model/Structure';

class DormerModel implements Istructure {
  dormerPlan: DormerPlan;
  dormerPersp: DormerPersp;
  dormerElev: DormerElev;
  id: string;

  constructor(id: string) {
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
  }

  get ID() {
    return this.id;
  }

  get Handle() {
    return this.dormerPlan.perimeter;
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
