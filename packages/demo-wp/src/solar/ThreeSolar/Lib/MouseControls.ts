/* eslint-disable no-console */
import * as THREE from 'three';
import { tMouseEvent } from './sharedTypes';

class MouseControls {
  objects: THREE.Mesh[];
  camera: THREE.Camera;
  domElement: HTMLElement;
  rayCaster: THREE.Raycaster;
  lastMouseDownObject: THREE.Mesh | null;
  mouseIsDown: boolean;

  constructor(
    objects: THREE.Mesh[],
    camera: THREE.Camera,
    domElement: HTMLElement
  ) {
    this.objects = objects;
    this.camera = camera;
    this.domElement = domElement;
    this.rayCaster = new THREE.Raycaster();
    this.lastMouseDownObject = null;
    this.mouseIsDown = false;
  }

  computeNDCPosition(mouseEvent: MouseEvent) {
    const { domElement: container } = this;

    const bbox = container.getBoundingClientRect();
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const screenX = mouseEvent.clientX;
    const screenY = mouseEvent.clientY;
    const offsetX = screenX - bbox.left;
    const offsetY = screenY - bbox.top;

    const mouse = new THREE.Vector3();
    mouse.x = (offsetX / containerWidth) * 2 - 1;
    mouse.y = -(offsetY / containerHeight) * 2 + 1;
    mouse.z = 0;

    // console.log(
    //   'screen / container / ndc',
    //   offsetX,
    //   offsetY,
    //   containerWidth,
    //   containerHeight,
    //   mouse
    // );
    return mouse;
  }

  findIntersection(mouseCoords: THREE.Vector3) {
    let intersecting = null;
    const { camera, rayCaster, objects, domElement } = this;
    const { x, y } = mouseCoords;
    rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const intersects = rayCaster.intersectObjects(objects);

    if (intersects.length > 0) {
      domElement.style.cursor = 'pointer';
      intersecting = intersects.at(0) ?? null;
    } else {
      domElement.style.cursor = 'auto';
    }
    return intersecting;
  }

  handleMouseOver(mouseEvent: MouseEvent) {
    console.log('mouse event: ', mouseEvent, this.objects);
  }

  handleMouseMove(mouseEvent: MouseEvent, callback: tMouseEvent) {
    const mousePos = this.computeNDCPosition(mouseEvent);
    const worldCoords = mousePos.unproject(this.camera);
    const scenePos = new THREE.Vector3(mousePos.x, 0, mousePos.y);
    const intersectingObj = this.findIntersection(mousePos);

    const obj = intersectingObj?.object ?? null;
    const mesh = obj as THREE.Mesh;

    callback({
      mouseCoords: scenePos,
      worldCoords,
      object: mesh,
    });
  }

  handleMouseDown(mouseEvent: MouseEvent, callback: tMouseEvent) {
    this.handleMouseMove(mouseEvent, ({ mouseCoords, worldCoords, object }) => {
      this.lastMouseDownObject = object;
      this.mouseIsDown = true;
      callback({
        mouseCoords,
        worldCoords,
        object,
      });
    });
  }

  handleMouseUp(mouseEvent: MouseEvent, callback: tMouseEvent) {
    const object = this.lastMouseDownObject;
    this.handleMouseMove(mouseEvent, ({ mouseCoords, worldCoords }) => {
      this.mouseIsDown = false;
      callback({
        mouseCoords,
        worldCoords,
        object,
      });
    });
  }

  addEventListener(eventId: keyof HTMLElementEventMap, callback: tMouseEvent) {
    const { domElement } = this;

    switch (eventId) {
      case 'mouseover':
        domElement.addEventListener(eventId, (event) => {
          this.handleMouseOver(event);
        });
        break;
      case 'mousemove':
        domElement.addEventListener(eventId, (event) => {
          this.handleMouseMove(event, callback);
        });
        break;
      case 'mousedown':
        domElement.addEventListener(eventId, (event) => {
          this.handleMouseDown(event, callback);
        });
        break;
      case 'mouseup':
        domElement.addEventListener(eventId, (event) => {
          this.handleMouseUp(event, callback);
        });
        break;

      default:
        break;
    }
  }
}

export default MouseControls;
