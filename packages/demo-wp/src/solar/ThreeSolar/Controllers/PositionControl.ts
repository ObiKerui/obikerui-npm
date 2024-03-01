import { tCallbackData } from '../Lib/sharedTypes';
import { BuildingModel } from '../Model/Model';

class PositionControl {
  buildingModel: BuildingModel | null;
  constructor() {
    this.buildingModel = null;
  }

  setPosition(params: tCallbackData) {
    const { buildingModel } = this;
    const { eventData } = params;
    const { mouseCoords, worldCoords } = eventData;

    if (!buildingModel) {
      return;
    }

    const { transform } = buildingModel.buildingPlan;

    // console.log(
    //   'rotate-pos / mouse / angle is: ',
    //   rotation.position,
    //   mouseCoords,
    //   angle
    // );

    console.log('world coords: ', worldCoords);

    transform.position.copy(worldCoords.clone());
  }
}

export default PositionControl;
