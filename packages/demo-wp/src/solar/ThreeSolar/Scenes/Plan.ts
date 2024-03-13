/* eslint-disable no-console */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { DragControls } from 'three/examples/jsm/controls/DragControls';
import MouseControls from '../Lib/MouseControls';
import { tCallback } from '../Lib/sharedTypes';

class Plan {
  scene: THREE.Scene;
  camera: THREE.Camera | null;
  renderer: THREE.Renderer | null;
  container: HTMLDivElement | null;
  orbitControls: OrbitControls | null;
  mouseControls: MouseControls | null;
  onMouseDown: tCallback | null;
  onMouseUp: tCallback | null;
  onMouseMove: tCallback | null;

  constructor() {
    this.scene = new THREE.Scene();
    this.container = null;
    this.camera = null;
    this.renderer = null;
    this.orbitControls = null;
    this.mouseControls = null;

    this.onMouseDown = null;
    this.onMouseUp = null;
    this.onMouseMove = null;
  }

  load() {
    if (this.camera) {
      return;
    }
    if (!this.container) {
      return;
    }

    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;

    const viewSize = height;
    const aspectRatio = width / height;

    // const viewport = {
    //   viewSize,
    //   aspectRatio,
    //   left: (-aspectRatio * viewSize) / 2,
    //   right: (aspectRatio * viewSize) / 2,
    //   top: viewSize / 2,
    //   bottom: -viewSize / 2,
    //   near: -100,
    //   far: 100,
    // };

    const viewport = {
      viewSize,
      aspectRatio,
      left: -10,
      right: 10,
      top: 10,
      bottom: -10,
      near: -100,
      far: 100,
    };

    // const orthoLeft = width / -2;
    // const orthoRight = width / 2;
    // const orthoTop = height / 2;
    // const orthoBottom = height / -2;

    // this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10);

    this.camera = new THREE.OrthographicCamera(
      viewport.left,
      viewport.right,
      viewport.top,
      viewport.bottom,
      viewport.near,
      viewport.far
    );

    this.camera.position.set(0, 4, 0);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.container.appendChild(this.renderer.domElement);

    // this.dragControls = new DragControls()

    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.mouseControls = new MouseControls(
      [],
      this.camera,
      this.renderer.domElement
    );

    this.addControls();
  }

  addControls() {
    const { mouseControls, orbitControls } = this;
    if (!mouseControls || !orbitControls) {
      return;
    }

    mouseControls.addEventListener('mouseover', () => {
      // console.log('mouse over event: ', data);
    });

    mouseControls.addEventListener('mousedown', (data) => {
      orbitControls.enabled = false;
      // console.log('mouse down event: ', data);
      if (this.onMouseDown) {
        this.onMouseDown(data);
      }
    });

    mouseControls.addEventListener('mouseup', (data) => {
      orbitControls.enabled = true;
      // console.log('mouse up event: ', data);
      if (this.onMouseUp) {
        this.onMouseUp(data);
      }
    });

    mouseControls.addEventListener('mousemove', (data) => {
      if (this.onMouseMove) {
        this.onMouseMove(data);
      }
    });
  }

  render() {
    const { renderer, scene, camera } = this;

    function animate() {
      if (!renderer || !camera) {
        return;
      }
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  }
}

export default Plan;
