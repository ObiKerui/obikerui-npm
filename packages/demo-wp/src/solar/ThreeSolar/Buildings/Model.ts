import BuildingPlan from './Plan';
import BuildingPersp from './Perspective';
import BuildingElev from './Elevation';
import Istructure from '../Model/Structure';

class BuildingModel implements Istructure {
  buildingPlan: BuildingPlan;
  buildingPersp: BuildingPersp;
  buildingElev: BuildingElev;
  id: string;

  constructor(id: string) {
    this.id = id;
    this.buildingPlan = new BuildingPlan(this.id);
    this.buildingPersp = new BuildingPersp(this.id);
    this.buildingElev = new BuildingElev(this.id);
  }

  get ID() {
    return this.id;
  }

  get Handle() {
    return this.buildingPlan.perimeter;
  }
}

export default BuildingModel;
