import { Mesh, Vector3 } from 'three';

type tPageElements = { plan: HTMLDivElement; perspective: HTMLDivElement };

type tEventData = {
  mouseCoords: Vector3;
  object: Mesh | null;
};

type tMouseEvent = (eventObj: tEventData) => void;

export type { tEventData, tMouseEvent, tPageElements };
