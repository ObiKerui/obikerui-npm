import { Mesh } from 'three';

interface Istructure {
  get ID(): string;
  get Handle(): Mesh;
  get Plan(): unknown;
  get Persp(): unknown;
  get Elevation(): unknown;
}

export default Istructure;
