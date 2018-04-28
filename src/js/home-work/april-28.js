// @ts-check
import autobind from "autobind-decorator";
import dat from "dat.gui";
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Color,
  CylinderGeometry,
  FogExp2,
  Mesh,
  MeshLambertMaterial,
  ObjectLoader,
  PerspectiveCamera,
  Scene,
  SpotLight,
  Vector3,
  WebGLRenderer
} from "three";
// import Tween from "@tweenjs/tween.js";
import { Stats } from "three-stats";
import { Tween, Easing, update } from "es6-tween";

export class April28 {
  constructor() {
    this.scene = new Scene();

    // Camera
    this.camera = new PerspectiveCamera(30, 4 / 3, 0.1, 1000);
    this.camera.position.x = 30;
    this.camera.position.y = 10;
    this.camera.position.z = 10;
    this.camera.lookAt(new Vector3(0, 5, 0));

    // Renderer
    this.renderer = new WebGLRenderer();
    this.renderer.setClearColor(new Color(0xeeeeee));
    this.renderer.setSize(800, 600);
    this.renderer.shadowMap.enabled = true;

    // Stats
    this.stats = new Stats();

    // other vars
    this.frameCount = 0;
    this.main();
  }

  main() {
    this.generateGUI();
    this.addBasicObjects();
    this.addModel();
    this.addLights();
    this.addFog();
    document
      .getElementById("my-webgl-output")
      .appendChild(this.renderer.domElement);
    this.renderScene();
  }

  generateGUI() {
    const gui = new dat.GUI();

    const Controls = class {
      constructor() {
        this.rotationSpeed = 0.01;
        this.spotLightHeight = 40;
        this.ambientLightColor = "#c0aaaa";
        this.fogNear = 1;
        this.fogFar = 5;
        this.fogDensity = 0.01;
        this.fogColor = 0x221855;
      }
    };

    const controls = new Controls();

    gui.add(controls, "rotationSpeed", 0, 0.05);

    const lighting = gui.addFolder("Lighting");
    lighting.add(controls, "spotLightHeight", 0, 100);
    lighting.addColor(controls, "ambientLightColor").onChange(c => {
      this.lights.ambientLight.color = new Color(c);
    });

    const fog = gui.addFolder("Fog");
    const onFogChange = property => value => (this.scene.fog[property] = value);
    fog.add(controls, "fogNear", 1, 5).onChange(onFogChange("near"));
    fog.add(controls, "fogFar", 5, 10).onChange(onFogChange("far"));
    fog.add(controls, "fogDensity", 0, 0.03).onChange(onFogChange("density"));
    fog
      .addColor(controls, "fogColor")
      .onChange(c => (this.scene.fog.color = new Color(c)));

    lighting.open();
    fog.open();
    this.gui = gui;
    this.controls = controls;

    this.stats.setMode(0); // 0 => fps, 1=> ms / frame
    document
      .getElementById("my-stats-output")
      .appendChild(this.stats.domElement);
  }

  addLights() {
    // ambient light
    const ambientLight = new AmbientLight(this.controls.ambientLightColor);

    const spotLight = new SpotLight("#c0aaaa", 2);

    // spot light 1
    spotLight.position.x = 0;
    spotLight.position.z = 0;
    spotLight.position.y = this.controls.spotLightHeight;
    spotLight.castShadow = true;
    spotLight.lookAt(this.objects.axes.position);

    this.lights = {
      spotLight,
      ambientLight
    };

    this.scene.add(ambientLight, spotLight);
  }

  addBasicObjects() {
    const axes = new AxesHelper(10);

    // Plane
    const cylinderGeometry = new CylinderGeometry(7, 7, 0.5, 30, 2);
    const material = new MeshLambertMaterial({ color: 0x757373 });

    const cylinder = new Mesh(cylinderGeometry, material);
    cylinder.position.setY(-0.25);
    cylinder.receiveShadow = true;

    this.objects = {
      axes,
      cylinder
    };

    this.scene.add(axes, cylinder);
  }

  addModel() {
    const cubeGeometry = new BoxGeometry(4, 4, 4);
    const cubeMaterial = new MeshLambertMaterial({
      morphTargets: true,
      color: 0xff0000
    });

    // define morphtargets, we'll use the vertices from these geometries
    const cubeTarget1 = new BoxGeometry(2, 10, 2);
    const cubeTarget2 = new BoxGeometry(8, 2, 8);

    // define morphtargets and compute the morphnormal
    cubeGeometry.morphTargets[0] = {
      name: "t1",
      vertices: cubeTarget2.vertices
    };
    cubeGeometry.morphTargets[1] = {
      name: "t2",
      vertices: cubeTarget1.vertices
    };
    cubeGeometry.computeMorphNormals();

    const cube = new Mesh(cubeGeometry, cubeMaterial);

    cube.morphTargetInfluences[0] = 0;
    console.log(cube);
    this.scene.add(cube);

    const loader = new ObjectLoader();
    loader.load("/assets/models/goku-threejs/goku.json", obj => {
      // const mesh = new Mesh(geometry, new MeshLambertMaterial({color: 0xc1c2c3}));
      const scale = 50;
      console.log(obj);
      obj.scale.set(scale, scale, scale);
      this.objects["model"] = obj;

      const tween = new Tween(obj.scale)
        .to({x: 0.001, y: scale, z:0.001}, 1000)
        .delay(100)
        .repeat(Infinity)
        .yoyo(true)
        .easing(Easing.Sinusoidal.InOut)
        .start();

      this.scene.add(obj);
    });

    const tween = new Tween(cube.morphTargetInfluences)
      .to([1, 0], 1000)
      .repeat(Infinity)
      .easing(Easing.Sinusoidal.InOut)
      .on('complete',() => {
        new Tween(cube.morphTargetInfluences)
          .to([0, 1], 1000)
          .easing(Easing.Elastic.Out)
          .delay(250)
          .start();
      }).yoyo(true)
      .start();
    console.log(tween);
  }

  addFog() {
    this.scene.fog = new FogExp2(
      this.controls.fogColor,
      this.controls.fogDensity
    );
  }

  @autobind
  renderScene() {
    this.frameCount++;

    const t = this.frameCount * this.controls.rotationSpeed;

    this.scene.rotation.set(0, t, 0);

    this.stats.update();
    requestAnimationFrame(this.renderScene);
    update();
    this.renderer.render(this.scene, this.camera);
  }
}
