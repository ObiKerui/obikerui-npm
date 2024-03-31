interface IMountable {
  get ID(): string;
}

interface IMountParent {
  get ID(): string;
}

class MountingControl {
  mountParent: IMountParent | null;
  constructor() {
    this.mountParent = null;
  }
}

export { IMountable, IMountParent, MountingControl };
