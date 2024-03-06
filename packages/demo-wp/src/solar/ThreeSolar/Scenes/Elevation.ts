/* eslint-disable no-console */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import MouseControls from '../Lib/MouseControls';
import { tCallback } from '../Lib/sharedTypes';

class Elevation {
  scene: THREE.Scene;
  camera: THREE.Camera | null;
  renderer: THREE.WebGLRenderer | null;
  container: HTMLDivElement | null;
  mouseControls: MouseControls | null;
  orbitControls: OrbitControls | null;
  onMouseDown: tCallback | null;
  onMouseUp: tCallback | null;
  onMouseMove: tCallback | null;

  constructor() {
    this.scene = new THREE.Scene();
    this.container = null;
    this.camera = null;
    this.renderer = null;
    this.mouseControls = null;
    this.orbitControls = null;

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
    //   left: -2,
    //   right: 2,
    //   top: 2,
    //   bottom: -0.5,
    //   near: -100,
    //   far: 10,
    // };

    const viewport = {
      viewSize,
      aspectRatio,
      left: -10,
      right: 10,
      top: 10,
      bottom: -10,
      near: -10,
      far: 10,
    };

    this.camera = new THREE.OrthographicCamera(
      viewport.left,
      viewport.right,
      viewport.top,
      viewport.bottom,
      viewport.near,
      viewport.far
    );

    this.camera.position.set(1, 0, 0);
    this.camera.lookAt(0, 0.0, 0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0xdddddd, 1);
    this.container.appendChild(this.renderer.domElement);

    this.mouseControls = new MouseControls(
      [],
      this.camera,
      this.renderer.domElement
    );

    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitControls.enableRotate = false;
    this.orbitControls.enablePan = false;

    this.addControls();
  }

  addControls() {
    const { mouseControls, orbitControls } = this;
    if (!mouseControls || !orbitControls) {
      return;
    }

    mouseControls.addEventListener('mouseover', () => {
      console.log('mouse over event: ');
    });

    mouseControls.addEventListener('mousedown', (data) => {
      orbitControls.enabled = false;
      if (this.onMouseDown) {
        this.onMouseDown({
          eventData: data,
          eventName: 'mousedown',
        });
      }
    });

    mouseControls.addEventListener('mouseup', (data) => {
      orbitControls.enabled = true;
      if (this.onMouseUp) {
        this.onMouseUp({
          eventData: data,
          eventName: 'mouseup',
        });
      }
    });

    mouseControls.addEventListener('mousemove', (data) => {
      if (this.onMouseMove) {
        this.onMouseMove({
          eventData: data,
          eventName: 'mousemove',
        });
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

export default Elevation;
