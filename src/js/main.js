import {
  Scene,
  WebGLRenderer,
  Mesh,
  SphereGeometry,
  PerspectiveCamera,
  MeshPhongMaterial,
  DirectionalLight,
  JSONLoader,
  MeshLambertMaterial
} from "three";
import { WIDTH, HEIGHT } from "./constants";
import goku from "../assets/models/goku-threejs/goku.json";

export default class Playground {
  init() {
    this.scene = new Scene();

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(WIDTH, HEIGHT);
    this.renderer.setClearColor(0xf2f2f2);

    const sphereGeometry = new SphereGeometry(
      3,
      20,
      20,
      0,
      Math.PI * 2,
      0,
      Math.PI * 2
    );
    const material = new MeshPhongMaterial({
      color: 0xff0000,
      flatShading: true
    });
    const sphere = new Mesh(sphereGeometry, material);

    this.camera = new PerspectiveCamera(45, WIDTH / HEIGHT, 0.2, 2000);
    this.camera.position.set(0, 0, 20);

    this.light = new DirectionalLight();

    // this.scene.add(sphere);
    this.scene.add(this.light);
    this.scene.add(this.camera);

    const { document } = global;
    document.body.appendChild(this.renderer.domElement);

    this.render();
  }

  render() {
    global.requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}
