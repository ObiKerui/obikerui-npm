import { Euler, Vector3 } from 'three';
import { tCallbackData } from '../Lib/sharedTypes';
import { BuildingModel } from '../Model/Model';

function calculateAngle(centre: Vector3, mouse: Vector3) {
  return Math.atan2(mouse.z - centre.z, mouse.x - centre.x);
}

class RotateControl {
  buildingModel: BuildingModel | null;
  constructor() {
    this.buildingModel = null;
  }

  setRotation(params: tCallbackData) {
    const { buildingModel } = this;
    const { eventData } = params;
    const { mouseCoords } = eventData;

    if (!buildingModel) {
      return;
    }

    const { rotation } = buildingModel.buildingPlan;

    const angle = calculateAngle(rotation.position, mouseCoords);

    // console.log(
    //   'rotate-pos / mouse / angle is: ',
    //   rotation.position,
    //   mouseCoords,
    //   angle
    // );

    const euler = new Euler(0, angle, 0);
    rotation.rotation.copy(euler.clone());
  }
}

export default RotateControl;
