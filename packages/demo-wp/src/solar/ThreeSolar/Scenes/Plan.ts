/* eslint-disable no-console */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import MouseControls from '../Lib/MouseControls';

class Plan {
  scene: THREE.Scene;
  camera: THREE.Camera | null;
  renderer: THREE.Renderer | null;
  container: HTMLDivElement | null;
  orbitControls: OrbitControls | null;
  mouseControls: MouseControls | null;

  constructor() {
    this.scene = new THREE.Scene();
    this.container = null;
    this.camera = null;
    this.renderer = null;
    this.orbitControls = null;
    this.mouseControls = null;
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
    const { mouseControls } = this;
    if (!mouseControls) {
      return;
    }

    mouseControls.addEventListener('mouseover', (data) => {
      console.log('mouse over event: ', data);
    });

    mouseControls.addEventListener('mousedown', (data) => {
      console.log('mouse down event: ', data);
    });

    mouseControls.addEventListener('mouseup', (data) => {
      console.log('mouse up event: ', data);
    });

    mouseControls.addEventListener('mousemove', (data) => {
      console.log('mouse move event: ', data);
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

  // onUpdateModel(newModel: unknown) {
  //   console.log('model updated: ', newModel, this.scene);
  // }
}

export default Plan;
