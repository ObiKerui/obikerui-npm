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

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 500);

    this.camera.position.set(2, 4, 4);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0xdddddd, 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // add plane and grid
    const planeGeom = new THREE.PlaneGeometry(80, 80);
    const planeMat = new THREE.MeshPhongMaterial({
      color: 0xffdddd,
    });
    const planeMesh = new THREE.Mesh(planeGeom, planeMat);
    planeMesh.rotation.copy(new THREE.Euler(-Math.PI / 2, 0, 0));
    planeMesh.position.copy(new THREE.Vector3(0, -0.01, 0));
    planeMesh.receiveShadow = true;
    this.scene.add(planeMesh);

    const ghelper = new THREE.GridHelper(80, 80, 0xcccccc, 0xcccccc);
    this.scene.add(ghelper);

    // Create a directional light with specified color and intensity
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(-2, 10, 10); // You can change the position as needed
    directionalLight.lookAt(0, 0, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.height = 512;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    this.scene.add(directionalLight);

    // Create an ambient light with specified color
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // White color as an example
    this.scene.add(ambientLight);

    // const hemisLight = new THREE.HemisphereLight(0x000044, 0x004400);
    // this.scene.add(hemisLight);

    this.scene.fog = new THREE.Fog(0xdddddd, 1, 20);
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
