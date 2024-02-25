import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class Perspective {
  scene: THREE.Scene;
  camera: THREE.Camera | null;
  renderer: THREE.WebGLRenderer | null;
  container: HTMLDivElement | null;
  controls: OrbitControls | null;

  constructor() {
    this.scene = new THREE.Scene();
    this.container = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
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

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10);

    this.camera.position.set(0, 4, 0);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(new THREE.Color(255, 0, 0), 1);
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
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

  //   onUpdateModel(newModel: unknown) {
  //     console.log('model updated: ', newModel, this.scene);
  //   }
}

export default Perspective;
