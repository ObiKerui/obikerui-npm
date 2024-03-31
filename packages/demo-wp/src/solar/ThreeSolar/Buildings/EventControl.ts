/* eslint-disable class-methods-use-this */
import { USER_EVENT } from '../Lib/sharedTypes';
import { BuildingModel, InteractionMode, Model } from '../Model/Model';
import { IEventMgr } from '../Lib/Structure';

import PositionControl from '../Controllers/PositionControl';
import RotateControl from '../Controllers/RotateControl';
import ScaleControl from '../Controllers/ScaleControl';
import RoofControl from '../Controllers/RoofControl';
import ElevationControl from '../Controllers/ElevationControl';

class BuildingEventControl implements IEventMgr {
  position: PositionControl;
  rotate: RotateControl;
  scaler: ScaleControl;
  roof: RoofControl;
  elevation: ElevationControl;
  buildingModel: BuildingModel;

  constructor(building: BuildingModel) {
    this.buildingModel = building;
    this.position = new PositionControl();
    this.rotate = new RotateControl();
    this.scaler = new ScaleControl();
    this.roof = new RoofControl();
    this.elevation = new ElevationControl();
  }

  onChangePosition(mouseEvent: USER_EVENT, model: Model) {
    this.position.onUpdate(mouseEvent, model);
  }

  onUpdate(mouseEvent: USER_EVENT, model: Model) {
    switch (model.interaction) {
      case InteractionMode.POSITION:
        this.onChangePosition(mouseEvent, model);
        break;
      case InteractionMode.ROTATE:
        this.rotate.onUpdate(mouseEvent, model);
        break;
      case InteractionMode.SCALE:
        this.scaler.onUpdate(mouseEvent, model);
        break;
      case InteractionMode.ADJUST_ROOF:
        this.roof.onUpdate(mouseEvent, model);
        break;
      case InteractionMode.ADJUST_ELEVATION:
        this.elevation.onUpdate(mouseEvent, model);
        break;
      default:
        break;
    }
  }
}

export default BuildingEventControl;
