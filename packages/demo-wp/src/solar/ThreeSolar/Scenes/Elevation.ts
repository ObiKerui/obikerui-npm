/* eslint-disable no-console */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import MouseControls from '../Lib/MouseControls';
import { tCallback } from '../Lib/sharedTypes';

class Elevation {
  scene: THREE.Scene;
  hudScene: THREE.Scene;
  camera: THREE.OrthographicCamera | null;
  hudCamera: THREE.OrthographicCamera | null;
  renderer: THREE.WebGLRenderer | null;
  container: HTMLDivElement | null;
  mouseControls: MouseControls | null;
  orbitControls: OrbitControls | null;
  onMouseDown: tCallback | null;
  onMouseUp: tCallback | null;
  onMouseMove: tCallback | null;
  onCameraChange: ((camera: THREE.OrthographicCamera) => void) | null;

  testBox: THREE.Object3D | null;

  constructor() {
    this.scene = new THREE.Scene();
    this.hudScene = new THREE.Scene();
    this.container = null;
    this.camera = null;
    this.hudCamera = null;
    this.renderer = null;
    this.mouseControls = null;
    this.orbitControls = null;

    this.onMouseDown = null;
    this.onMouseUp = null;
    this.onMouseMove = null;
    this.onCameraChange = null;

    this.testBox = null;
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

    const viewport = {
      viewSize,
      aspectRatio,
      left: -10,
      right: 10,
      top: 10,
      bottom: -10,
      near: 0.1,
      far: 50,
    };

    const startPos = new THREE.Vector3(10, 0, 0);

    this.camera = new THREE.OrthographicCamera(
      viewport.left,
      viewport.right,
      viewport.top,
      viewport.bottom,
      viewport.near,
      viewport.far
    );

    this.camera.position.copy(startPos);
    this.camera.lookAt(0, 0.0, 0);

    this.hudCamera = new THREE.OrthographicCamera(
      viewport.left,
      viewport.right,
      viewport.top,
      viewport.bottom,
      viewport.near,
      viewport.far
    );
    this.hudCamera.position.copy(startPos);
    this.hudCamera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(width, height);

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.autoClear = false; // To allow render overlay on top of sprited sphere
    this.renderer.setClearColor(0xdddddd, 1);

    this.container.appendChild(this.renderer.domElement);

    this.mouseControls = new MouseControls(
      [],
      this.hudCamera,
      this.renderer.domElement
    );

    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitControls.enableRotate = true;
    this.orbitControls.enablePan = true;

    this.addControls();
  }

  addControls() {
    const { mouseControls, orbitControls, camera, onCameraChange } = this;
    if (!mouseControls || !orbitControls || !camera) {
      return;
    }

    orbitControls.addEventListener('change', () => {
      const orthCam = camera as THREE.OrthographicCamera;
      if (onCameraChange) {
        onCameraChange(orthCam);
      }
    });

    mouseControls.addEventListener('mouseover', () => {
      console.log('mouse over event: ');
    });

    mouseControls.addEventListener('mousedown', (data) => {
      orbitControls.enabled = false;
      if (this.onMouseDown) {
        this.onMouseDown(data);
      }
    });

    mouseControls.addEventListener('mouseup', (data) => {
      orbitControls.enabled = true;
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
    const { renderer, scene, camera, orbitControls, hudCamera, hudScene } =
      this;
    // const { renderer, scene, camera, orbitControls } = this;

    function animate() {
      if (!renderer || !camera || !hudCamera) {
        return;
      }
      requestAnimationFrame(animate);
      orbitControls?.update();
      renderer.render(scene, camera);

      renderer.clear();
      renderer.render(scene, camera);
      renderer.clearDepth();
      renderer.render(hudScene, hudCamera);
    }
    animate();
  }
}

export default Elevation;
