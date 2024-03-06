import { Mesh, Vector3 } from 'three';

type tPageElements = {
  plan: HTMLDivElement;
  perspective: HTMLDivElement;
  elevation: HTMLDivElement;
};

type tEventData = {
  mouseCoords: Vector3;
  worldCoords: Vector3;
  object: Mesh | null;
};

type tMouseEvent = (eventObj: tEventData) => void;

type tCallbackData = {
  eventData: tEventData;
  eventName: string;
};

type tCallback = (eventObj: tCallbackData) => void;

export type {
  tEventData,
  tMouseEvent,
  tPageElements,
  tCallback,
  tCallbackData,
};
