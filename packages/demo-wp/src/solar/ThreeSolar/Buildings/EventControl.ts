/* eslint-disable class-methods-use-this */
import { Vector3 } from 'three';
import { IListener, STRUCTURE_TYPE, USER_EVENT } from '../Lib/sharedTypes';
import { InteractionMode, Model } from '../Model/Model';
import Elevation from '../Scenes/Elevation';
import { Istructure } from '../Lib/Structure';

import PositionControl from '../Controllers/PositionControl';
import PlacementControl from '../Controllers/PlacementControl';
import RotateControl from '../Controllers/RotateControl';
import ScaleControl from '../Controllers/ScaleControl';
import RoofControl from '../Controllers/RoofControl';
import ElevationControl from '../Controllers/ElevationControl';

class EventControl implements IListener {
  position: PositionControl;
  placer: PlacementControl;
  rotate: RotateControl;
  scaler: ScaleControl;
  roof: RoofControl;
  elevation: ElevationControl;

  constructor() {
    this.position = new PositionControl();
    this.placer = new PlacementControl();
    this.rotate = new RotateControl();
    this.scaler = new ScaleControl();
    this.roof = new RoofControl();
    this.elevation = new ElevationControl();
  }

  onUpdate(mouseEvent: USER_EVENT, model: Model) {
    // is this a building

    switch (model.interaction) {
      case InteractionMode.POSITION:
        this.placer.onUpdate(mouseEvent, model);
        this.position.onUpdate(mouseEvent, model);
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
      // case InteractionMode.SELECT_STRUCTURE:
      //     this.elevation.onUpdate(mouseEvent, model);
      //     break;
      default:
        break;
    }
  }
}

export default EventControl;
