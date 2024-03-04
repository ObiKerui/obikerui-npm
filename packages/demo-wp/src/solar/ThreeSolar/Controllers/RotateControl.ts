import { Euler, Vector3 } from 'three';
import { tCallbackData } from '../Lib/sharedTypes';
import { BuildingModel } from '../Model/Model';

function calculateAngle(centre: Vector3, mouse: Vector3) {
  return -Math.atan2(mouse.z - centre.z, mouse.x - centre.x);
}

class RotateControl {
  buildingModel: BuildingModel | null;
  constructor() {
    this.buildingModel = null;
  }

  setBuilding(buildingModel: BuildingModel, _params: tCallbackData) {
    this.buildingModel = buildingModel;
  }

  setRotation(params: tCallbackData) {
    const { buildingModel } = this;
    const { eventData } = params;
    const { worldCoords } = eventData;

    if (!buildingModel) {
      return;
    }

    const { rotation: planRotation, transform } = buildingModel.buildingPlan;
    const { rotation: perspRotation } = buildingModel.buildingPersp;

    // const angle = calculateAngle(rotation.position, mouseCoords);
    const angle = calculateAngle(transform.position, worldCoords);

    const euler = new Euler(0, angle, 0);
    planRotation.rotation.copy(euler);
    perspRotation.rotation.copy(euler);
  }
}

export default RotateControl;
