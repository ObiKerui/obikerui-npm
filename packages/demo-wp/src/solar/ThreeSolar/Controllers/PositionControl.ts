import { Vector3 } from 'three';
import { tCallbackData } from '../Lib/sharedTypes';
import { BuildingModel } from '../Model/Model';

class PositionControl {
  buildingModel: BuildingModel | null;
  offset: Vector3 | null;
  constructor() {
    this.buildingModel = null;
    this.offset = null;
  }

  setBuilding(buildingModel: BuildingModel, params: tCallbackData) {
    this.buildingModel = buildingModel;
    const { transform } = this.buildingModel.buildingPlan;

    const { worldCoords } = params.eventData;

    // for the offset find difference between mouse click pos and centre of transform
    const transformCentre = new Vector3();
    transform.getWorldPosition(transformCentre);

    this.offset = new Vector3(
      worldCoords.x - transformCentre.x,
      0,
      worldCoords.z - transformCentre.z
    );
  }

  setPosition(params: tCallbackData) {
    const { buildingModel } = this;
    const { eventData } = params;
    const { worldCoords } = eventData;
    const { offset } = this;

    if (!buildingModel || !offset) {
      return;
    }

    const { transform: planTransform } = buildingModel.buildingPlan;
    const { transform: perspTransform } = buildingModel.buildingPersp;

    const newPosition = new Vector3(
      worldCoords.x - offset.x,
      0,
      worldCoords.z - offset.z
    );

    planTransform.position.copy(newPosition);
    perspTransform.position.copy(newPosition);
  }
}

export default PositionControl;
