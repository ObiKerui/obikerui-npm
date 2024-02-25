/* eslint-disable no-console */
import * as THREE from 'three';
import { tMouseEvent } from './sharedTypes';

class MouseControls {
  objects: THREE.Mesh[];
  camera: THREE.Camera;
  domElement: HTMLElement;
  rayCaster: THREE.Raycaster;

  constructor(
    objects: THREE.Mesh[],
    camera: THREE.Camera,
    domElement: HTMLElement
  ) {
    this.objects = objects;
    this.camera = camera;
    this.domElement = domElement;
    this.rayCaster = new THREE.Raycaster();
  }

  computeMousePosition(mouseEvent: MouseEvent) {
    const { domElement: container } = this;

    const bbox = container.getBoundingClientRect();
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const screenX = mouseEvent.clientX;
    const screenY = mouseEvent.clientY;
    const offsetX = screenX - bbox.left;
    const offsetY = screenY - bbox.top;

    const mouse = new THREE.Vector2();
    mouse.x = (offsetX / containerWidth) * 2 - 1;
    mouse.y = -(offsetY / containerHeight) * 2 + 1;

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

  findIntersection(mouseCoords: THREE.Vector2) {
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
    const mousePos = this.computeMousePosition(mouseEvent);
    const scenePos = new THREE.Vector3(mousePos.x, 0, mousePos.y);
    const intersectingObj = this.findIntersection(mousePos);

    const obj = intersectingObj?.object ?? null;
    const mesh = obj as THREE.Mesh;

    callback({
      mouseCoords: scenePos,
      object: mesh,
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
      default:
        break;
    }
  }
}

export default MouseControls;
