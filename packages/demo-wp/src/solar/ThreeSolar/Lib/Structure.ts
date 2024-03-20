import { ColorRepresentation, Mesh, Object3D } from 'three';
import StructureBase from './StructureBase';
import { HandleControl } from '../Handles/BuildingHandles';
import { STRUCTURE_TYPE } from './sharedTypes';

interface Iplan {
  get Base(): StructureBase;
  get Locations(): unknown;
  set Colour(color: ColorRepresentation);
  addHandles(handles: HandleControl): void;
  getRoofGeometry(): THREE.Vector3[];
}

interface Ipersp {
  get Base(): StructureBase;
  get AttachPoints(): Object3D[];
}

interface Ielevation {
  get Base(): StructureBase;
}

interface Istructure {
  get Type(): STRUCTURE_TYPE;
  get ID(): string;
  get Handle(): Mesh;
  get Plan(): Iplan;
  get Persp(): Ipersp;
  get Elevation(): Ielevation;
}

export { Iplan as IPlan, Ipersp, Ielevation, Istructure };
