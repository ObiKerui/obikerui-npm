import { ColorRepresentation, Mesh, Object3D } from 'three';
import StructureBase from './StructureBase';
import { HandleControl } from '../Handles/BuildingHandles';
import { STRUCTURE_TYPE, USER_EVENT } from './sharedTypes';
import { Model } from '../Model/Model';

interface Iplan {
  get Base(): StructureBase;
  get Locations(): unknown;
  set Colour(color: ColorRepresentation);
  get Colour(): ColorRepresentation;
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

interface IEventMgr {
  onUpdate(user_event: USER_EVENT, model: Model): void;
}

interface Istructure {
  get Type(): STRUCTURE_TYPE;
  get ID(): string;
  get Handle(): Mesh;
  get Plan(): Iplan;
  get Persp(): Ipersp;
  get Elevation(): Ielevation;
  get EventMgr(): IEventMgr;
}

export { Iplan as IPlan, Ipersp, Ielevation, Istructure, IEventMgr };
