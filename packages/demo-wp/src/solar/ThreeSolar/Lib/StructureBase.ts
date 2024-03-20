import * as THREE from 'three';

class StructureBase {
  id: string;
  structure: THREE.Object3D;
  transform: THREE.Mesh;
  rotation: THREE.Mesh;
  anchor: THREE.Mesh;
  scale: THREE.Mesh;
  perimeter: THREE.Mesh;
  debugging: boolean;

  constructor(id: string, structure: THREE.Object3D, debugging = false) {
    this.id = id;
    this.structure = structure;
    this.debugging = debugging;
    const opacity = this.debugging ? 0.5 : 0.0;

    const transRotGeom = new THREE.BoxGeometry();
    const transRotMat = new THREE.MeshBasicMaterial({
      color: 0x0000dd,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });

    this.transform = new THREE.Mesh(transRotGeom, transRotMat);
    this.rotation = new THREE.Mesh(transRotGeom.clone(), transRotMat.clone());

    const scalingSize = new THREE.Vector3(1, 1, 1);

    const anchorMat = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      wireframe: true,
      transparent: true,
      opacity,
    });

    const anchorGeom = new THREE.BoxGeometry(
      scalingSize.x,
      scalingSize.y,
      scalingSize.z
    );
    this.anchor = new THREE.Mesh(anchorGeom, anchorMat);

    const scaleMat = new THREE.MeshBasicMaterial({
      color: 0x00ccff,
      wireframe: true,
      transparent: true,
      opacity,
    });

    const scaleGeom = new THREE.BoxGeometry(
      scalingSize.x,
      scalingSize.y,
      scalingSize.z
    );
    this.scale = new THREE.Mesh(scaleGeom, scaleMat);

    const perimeterGeom = new THREE.BoxGeometry(2, 0, 2);
    const perimeterMat = new THREE.MeshBasicMaterial({
      color: 0xeeeeee,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    this.perimeter = new THREE.Mesh(perimeterGeom, perimeterMat);
    this.perimeter.name = this.id;

    this.perimeter.add(this.structure);
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
}

export default StructureBase;
