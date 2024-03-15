import { Vector3 } from 'three';
import { IListener, USER_EVENT } from '../Lib/sharedTypes';
import { BuildingModel, InteractionMode, Model } from '../Model/Model';

class PositionControl implements IListener {
  offset: Vector3 | null;
  constructor() {
    this.offset = null;
  }

  onUpdate(mouseEvent: USER_EVENT, model: Model) {
    if (model.interaction !== InteractionMode.POSITION) {
      return;
    }

    switch (mouseEvent) {
      case USER_EVENT.MOUSE_DOWN:
        this.onMouseDown(model);
        break;
      case USER_EVENT.MOUSE_MOVE:
        this.setPosition(model);
        break;
      default:
        break;
    }
  }

  onMouseDown(model: Model) {
    const { SelectedStructure, uiEvent, handleControl } = model;
    if (!SelectedStructure || !uiEvent) {
      throw new Error('Structure not selected or no ui event!');
    }

    const buildingModel = SelectedStructure as BuildingModel;
    const { transform } = buildingModel.Plan;
    const { worldCoords } = uiEvent.positionData;

    buildingModel.Plan.addHandles(handleControl);

    // for the offset find difference between mouse click pos and centre of transform
    const transformCentre = new Vector3();
    transform.getWorldPosition(transformCentre);

    this.offset = new Vector3(
      worldCoords.x - transformCentre.x,
      0,
      worldCoords.z - transformCentre.z
    );
  }

  setPosition(model: Model) {
    const { SelectedStructure, uiEvent } = model;
    if (!SelectedStructure || !uiEvent) {
      throw new Error('Structure not selected or no ui event!');
    }

    const { worldCoords } = uiEvent.positionData;
    const { offset } = this;

    const buildingModel = SelectedStructure as BuildingModel;
    if (!buildingModel || !offset) {
      return;
    }

    const { transform: planTransform } = buildingModel.Plan;
    const { transform: perspTransform } = buildingModel.Persp;

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
