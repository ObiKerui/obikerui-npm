/* eslint-disable no-console */
import { OrthographicCamera } from 'three';
import {
  UI_ACTION,
  USER_EVENT,
  tCallback,
  tEventData,
  tUIEvent,
} from '../Lib/sharedTypes';
import { InteractionMode, Model } from '../Model/Model';

// const regex = /id-\d+/;

// function extractId(name: string) {
//   const matchArray: RegExpMatchArray | null = name.match(regex);

//   if (matchArray !== null) {
//     const extractedValue: string = matchArray[0];
//     return extractedValue;
//   }
//   return null;
// }

class UIEventControl {
  model: Model | null;
  onMouseDown: tCallback;
  onMouseUp: tCallback;
  onMouseMove: tCallback;
  onCameraChange: (camera: OrthographicCamera) => void;

  constructor() {
    this.model = null;

    this.onMouseDown = (params) => {
      const uiEvent = this.createUIEvent(params);
      if (!uiEvent) {
        return;
      }
      this.handleMouseDown(uiEvent);
    };
    this.onMouseUp = (params) => {
      const uiEvent = this.updateUIEvent(params);
      this.handleMouseUp(uiEvent);
    };
    this.onMouseMove = (params) => {
      if (!this.handleNewEvent()) {
        return;
      }
      const uiEvent = this.updateUIEvent(params);
      this.handleMouseMove(uiEvent);
    };

    this.onCameraChange = () => {
      this.handleElevationCameraChange();
    };
  }

  handleNewEvent() {
    const { model } = this;
    if (!model) {
      throw new Error('Error no model assigned');
    }
    const mouseDown = model.mouseIsDown;
    return mouseDown;
  }

  createUIEvent({ object, mouseCoords, worldCoords }: tEventData) {
    const { model } = this;
    if (!model || !object) {
      console.warn('model or object does not exist!');
      return null;
    }

    let structure = null;
    const { name } = object;
    let uiAction = UI_ACTION[name as keyof typeof UI_ACTION];

    // is this a mouse down on a structure (building, dormer, extention), a handle or what about none?
    // if mouse down on a structure we should update the handles to add to this structure...
    const mouseDownOnStructure = name.startsWith('structure');
    structure = model.structuresMap.get(name);

    if (mouseDownOnStructure) {
      model.selectedStructureId = name;
      uiAction = UI_ACTION.MOVE_STRUCTURE;
    } else {
      structure = model.SelectedStructure;
    }

    const uiEvent: tUIEvent = {
      action: uiAction,
      actionSource: object,
      structure: structure ?? null,
      positionData: {
        mouseCoords,
        worldCoords,
      },
      scene: 'dunno',
    };
    return uiEvent;
  }

  updateUIEvent({ mouseCoords, worldCoords }: tEventData) {
    const { model } = this;
    if (!model) {
      throw new Error('model does not exist!');
    }

    const currentUiEvent = model.uiEvent;
    if (!currentUiEvent) {
      throw new Error('no current UI Event');
    }

    const uiEvent: tUIEvent = {
      ...currentUiEvent,
      positionData: {
        mouseCoords,
        worldCoords,
      },
    };
    return uiEvent;
  }

  handleElevationCameraChange() {
    // be able to get selected object
    const { model } = this;
    if (!model) {
      return;
    }

    model.interaction = InteractionMode.ADJUST_ELEVATION;
    model.notifyListeners(USER_EVENT.ELEV_CAM_ZOOM);
  }

  handleMouseDown(uiEvent: tUIEvent) {
    const { model } = this;
    if (!model) {
      throw new Error('Error - model not assigned');
    }

    model.mouseIsDown = true;
    const { action, structure } = uiEvent;

    if (!structure) {
      throw new Error('structure not assigned!');
    }

    let interaction = InteractionMode.NONE;
    switch (action) {
      case UI_ACTION.MOVE_STRUCTURE:
        interaction = InteractionMode.POSITION;
        break;
      case UI_ACTION.ROTATE_STRUCTURE:
        interaction = InteractionMode.ROTATE;
        break;
      case UI_ACTION.SCALE_NE:
      case UI_ACTION.SCALE_NW:
      case UI_ACTION.SCALE_SE:
      case UI_ACTION.SCALE_SW:
        interaction = InteractionMode.SCALE;
        break;
      case UI_ACTION.MOVE_N_HIP:
      case UI_ACTION.MOVE_S_HIP:
      case UI_ACTION.MOVE_RIDGE:
        interaction = InteractionMode.ADJUST_ROOF;
        break;
      case UI_ACTION.ELEVATE_BASE:
      case UI_ACTION.ELEVATE_PEAK:
        interaction = InteractionMode.ADJUST_ELEVATION;
        break;
      default:
        break;
    }

    model.interaction = interaction;
    model.uiEvent = uiEvent;
    const eventStructure = model.uiEvent.structure;
    if (!eventStructure) {
      throw new Error('No Event Structure');
    }
    eventStructure.EventMgr.onUpdate(USER_EVENT.MOUSE_DOWN, model);
  }

  handleMouseUp(uiEvent: tUIEvent) {
    const { model } = this;
    if (!model) {
      return;
    }
    model.mouseIsDown = false;
    model.uiEvent = uiEvent;
    const eventStructure = model.uiEvent.structure;
    if (!eventStructure) {
      throw new Error('No Event Structure');
    }
    eventStructure.EventMgr.onUpdate(USER_EVENT.MOUSE_UP, model);
    // model.notifyListeners(USER_EVENT.MOUSE_UP);
  }

  handleMouseMove(uiEvent: tUIEvent) {
    const { model } = this;
    if (!model) {
      return;
    }

    model.uiEvent = uiEvent;
    const eventStructure = model.uiEvent.structure;
    if (!eventStructure) {
      throw new Error('No Event Structure');
    }
    eventStructure.EventMgr.onUpdate(USER_EVENT.MOUSE_MOVE, model);
    // model.notifyListeners(USER_EVENT.MOUSE_MOVE);
  }
}

export default UIEventControl;
