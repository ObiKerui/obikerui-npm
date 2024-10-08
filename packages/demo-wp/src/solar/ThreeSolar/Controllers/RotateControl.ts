import { Euler, Vector3 } from 'three';
import { IListener, USER_EVENT } from '../Lib/sharedTypes';
import { InteractionMode, Model } from '../Model/Model';

function calculateAngle(centre: Vector3, mouse: Vector3) {
  return -Math.atan2(mouse.z - centre.z, mouse.x - centre.x);
}

class RotateControl implements IListener {
  onUpdate(mouseEvent: USER_EVENT, model: Model) {
    if (model.interaction !== InteractionMode.ROTATE) {
      return;
    }

    switch (mouseEvent) {
      case USER_EVENT.MOUSE_MOVE:
        this.setRotation(model);
        break;
      default:
        break;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  setRotation(model: Model) {
    const { SelectedStructure, uiEvent } = model;
    if (!SelectedStructure || !uiEvent) {
      throw new Error('Structure not selected or no ui event!');
    }

    const { worldCoords } = uiEvent.positionData;

    const structureModel = SelectedStructure;
    const { rotation: planRotation, transform } = structureModel.Plan.Base;
    const { rotation: perspRotation } = structureModel.Persp.Base;

    const angle = calculateAngle(transform.position, worldCoords);

    const euler = new Euler(0, angle, 0);
    planRotation.rotation.copy(euler);
    perspRotation.rotation.copy(euler);
  }
}

export default RotateControl;
