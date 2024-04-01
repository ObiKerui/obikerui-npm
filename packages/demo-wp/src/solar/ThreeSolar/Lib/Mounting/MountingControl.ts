import { Object3D } from 'three';
import { Istructure } from '../Structure';

interface IMountBase {
  get Plan(): Object3D;
  get Persp(): Object3D;
  get Elevation(): Object3D;
}

interface IMount {
  get MountBase(): IMountBase;
}

interface IMountableBase {
  get MountParent(): Istructure | null;
  set MountParent(parent: Istructure | null);
}

interface IMountable {
  get MountableBase(): IMountableBase;
}

class MountingControl {
  mountParent: IMount | null;
  constructor() {
    this.mountParent = null;
  }
}

export { IMountable, IMountableBase, IMount, IMountBase, MountingControl };
