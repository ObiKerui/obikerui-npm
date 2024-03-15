import { Object3D, Vector3 } from 'three';
import Istructure from '../Model/Structure';
import { Model } from '../Model/Model';

enum UI_ACTION {
  SCALE_NW = 'SCALE_NW',
  SCALE_NE = 'SCALE_NE',
  SCALE_SE = 'SCALE_SE',
  SCALE_SW = 'SCALE_SW',
  MOVE_STRUCTURE = 'MOVE_STRUCTURE',
  MOVE_N_HIP = 'MOVE_N_HIP',
  MOVE_S_HIP = 'MOVE_S_HIP',
  MOVE_RIDGE = 'MOVE_RIDGE',
  ROTATE_STRUCTURE = 'ROTATE_STRUCTURE',
  ELEVATE_PEAK = 'ELEVATE_PEAK',
  ELEVATE_BASE = 'ELEVATE_BASE',
  SELECT_NEW = 'SELECT_NEW',
}

enum USER_EVENT {
  MOUSE_DOWN = 'MOUSE_DOWN',
  MOUSE_MOVE = 'MOUSE_MOVE',
  MOUSE_UP = 'MOUSE_UP',
  ELEV_CAM_ZOOM = 'ELEV_CAM_ZOOM',
}

type tPositionData = {
  mouseCoords: Vector3;
  worldCoords: Vector3;
};

type tUIEvent = {
  action: UI_ACTION;
  actionSource: Object3D | null;
  scene: unknown;
  positionData: tPositionData;
  structure: Istructure | null;
};

type tPageElements = {
  plan: HTMLDivElement;
  perspective: HTMLDivElement;
  elevation: HTMLDivElement;
};

type tEventData = {
  mouseCoords: Vector3;
  worldCoords: Vector3;
  object: Object3D | null;
};

interface IListener {
  onUpdate: (userEvent: USER_EVENT, model: Model) => void;
}

// type tMouseEvent = (eventObj: tEventData) => void;

type tCallback = (eventObj: tEventData) => void;

export type { tEventData, tPageElements, tCallback, tUIEvent };

export { UI_ACTION, USER_EVENT, IListener };
