/* eslint-disable class-methods-use-this */
import { USER_EVENT } from '../Lib/sharedTypes';
import { InteractionMode, Model } from '../Model/Model';
import { IEventMgr } from '../Lib/Structure';

import PositionControl from '../Controllers/PositionControl';
import PlacementControl from '../Controllers/PlacementControl';
import RotateControl from '../Controllers/RotateControl';
import ScaleControl from '../Controllers/ScaleControl';
import RoofControl from '../Controllers/RoofControl';
import ElevationControl from '../Controllers/ElevationControl';
import { MountingControl } from '../Lib/Mounting/MountingControl';
import DormerModel from './Model';

class DormerEventControl implements IEventMgr {
  position: PositionControl;
  placer: PlacementControl;
  rotate: RotateControl;
  scaler: ScaleControl;
  roof: RoofControl;
  elevation: ElevationControl;
  dormerModel: DormerModel;
  mountControl: MountingControl;

  constructor(dormer: DormerModel) {
    this.dormerModel = dormer;
    this.position = new PositionControl();
    this.placer = new PlacementControl();
    this.rotate = new RotateControl();
    this.scaler = new ScaleControl();
    this.roof = new RoofControl();
    this.elevation = new ElevationControl();
    this.mountControl = new MountingControl();
  }

  onChangePosition(mouseEvent: USER_EVENT, model: Model) {
    switch (mouseEvent) {
      case USER_EVENT.MOUSE_DOWN:
        this.position.onMouseDown(model);
        this.placer.onMouseDown(model);
        break;
      case USER_EVENT.MOUSE_MOVE:
        this.placer.setPosition(model);
        this.position.setPosition(model);
        break;
      case USER_EVENT.MOUSE_UP:
        this.placer.onMouseUp(model);
        break;
      default:
        break;
    }
  }

  onChangeScale(mouseEvent: USER_EVENT, model: Model) {
    switch (mouseEvent) {
      case USER_EVENT.MOUSE_DOWN:
        this.scaler.onMouseDown(model);
        this.placer.onMouseDown(model);
        break;
      case USER_EVENT.MOUSE_MOVE:
        this.placer.setPosition(model);
        this.scaler.onMouseMove(model);
        break;
      case USER_EVENT.MOUSE_UP:
        this.scaler.onMouseUp(model);
        this.placer.onMouseUp(model);
        break;
      default:
        break;
    }
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
        this.onChangeScale(mouseEvent, model);
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

export default DormerEventControl;
