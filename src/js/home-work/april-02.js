import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SpotLight,
  AxesHelper,
  PlaneGeometry,
  MeshLambertMaterial,
  MeshBasicMaterial,
  AmbientLight,
  BoxGeometry,
  Vector3,
  Mesh,
  Color,
  SphereGeometry,
  Triangle,
  Geometry,
  Face3,
  MeshNormalMaterial,
  Object3D,
  FogExp2
} from "three";
import { Stats } from "three-stats";
import dat from "dat.gui";
import autobind from "autobind-decorator";
import { createTetrahedron, createPyramid } from "../lib";

export class April02 {
  constructor() {
    this.scene = new Scene();

    // Camera
    this.camera = new PerspectiveCamera(45, 4 / 3, 0.1, 1000);
    this.camera.position.x = 30;
    this.camera.position.y = 15;
    this.camera.position.z = 10;
    this.camera.lookAt(this.scene.position);

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
    this.addObjects();
    // this.addTetrahedrons();
    this.addFractal();
    this.addLights();
    this.addFog();
    document.getElementById("my-webgl-output").appendChild(this.renderer.domElement);
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
        this.fogDensity = 0.025;
        this.fogColor = 0x90036;
        this.tetrahedronScale = 1;
        this.tetrahedronColor = 0x10e3b1;
      }
    };

    const controls = new Controls();

    gui.add(controls, "rotationSpeed", 0, 0.05);

    const lighting = gui.addFolder("Lighting");
    lighting
      .add(controls, "spotLightHeight", 0, 10)
      .onChange(c => (this.lights.spotLight.position.y = c));
    lighting.addColor(controls, "ambientLightColor").onChange(c => {
      this.lights.ambientLight.color = new Color(c);
    });

    const fog = gui.addFolder("Fog");
    const onFogChange = property => value => (this.scene.fog[property] = value);
    fog.add(controls, "fogNear", 1, 5).onChange(onFogChange("near"));
    fog.add(controls, "fogFar", 5, 10).onChange(onFogChange("far"));
    fog.add(controls, "fogDensity", 0, 0.03).onChange(onFogChange("density"));
    fog.addColor(controls, "fogColor").onChange(c => (this.scene.fog.color = new Color(c)));

    const tetrahedron = gui.addFolder("Tetrahedron");
    tetrahedron.add(controls, "tetrahedronScale", 1, 5).onChange(scale => {
      this.objects.tetrahedron.children.forEach(x => (x.scale.x = x.scale.y = x.scale.z = scale));
    });
    tetrahedron
      .addColor(controls, "tetrahedronColor")
      .onChange(c =>
        this.objects.tetrahedron.children.forEach(x => (x.material.color = new Color(c)))
      );

    lighting.open();
    fog.open();
    tetrahedron.open();
    this.gui = gui;
    this.controls = controls;

    this.stats.setMode(0); // 0 => fps, 1=> ms / frame
    document.getElementById("my-stats-output").appendChild(this.stats.domElement);
  }

  addLights() {
    // ambient light
    const ambientLight = new AmbientLight(this.controls.ambientLightColor, 0);

    const spotLight = new SpotLight(0xffffff, 2, 5);

    // spot light 1
    // spotLight.position.x = 0;
    // spotLight.position.z = 0;
    // spotLight.position.y = 15;
    spotLight.position.set(0, 20, 0);
    spotLight.castShadow = true;
    // spotLight.lookAt(new Vector3(0,0,0));

    const box = new BoxGeometry(1, 1, 1);
    const boxMaterial = new MeshBasicMaterial({ color: 0xc5c5c5 });

    const boxMesh = new Mesh(box, boxMaterial);
    boxMesh.position.set(0, 15, 0);

    this.lights = {
      spotLight,
      ambientLight
    };

    this.scene.add(ambientLight, spotLight, boxMesh);
  }

  addObjects() {
    const axes = new AxesHelper(10);

    this.objects = {
      axes
    };

    this.scene.add(axes);
  }

  addFractal() {
    const v0 = new Vector3(0, 0, -10);
    const v1 = new Vector3(0, 0, 10);
    const v2 = new Vector3(10, 0, 0);
    const v3 = new Vector3(0, 10, 0);
    const v4 = new Vector3(-10, 0, 0);

    this.drawSierpinskiGasket(v0, v1, v2, v3, v4, 5);
  }

  drawSierpinskiGasket(v0, v1, v2, v3, v4, n) {
    if (n <= 1) {
      // var tetrahedron=getTetrahedron(v0,v1,v2,v3);
      debugger;
      this.scene.add(createPyramid([v0, v1, v2, v3, v4], "pink", false));
    } else {
      // find mid points of the six sides of the tetrahedron
      const v01 = v0.clone().lerp(v1, 0.5);
      const v02 = v0.clone().lerp(v2, 0.5);
      const v03 = v0.clone().lerp(v3, 0.5);
      const v12 = v1.clone().lerp(v2, 0.5);
      const v13 = v1.clone().lerp(v3, 0.5);
      const v23 = v2.clone().lerp(v3, 0.5);
      const v04 = v0.clone().lerp(v4, 0.5);
      const v14 = v1.clone().lerp(v4, 0.5);
      const v34 = v3.clone().lerp(v4, 0.5);

      this.drawSierpinskiGasket(v0, v01, v02, v03, v04, n - 1);
      this.drawSierpinskiGasket(v04, v14, v01, v34, v4, n - 1);
      this.drawSierpinskiGasket(v01, v1, v12, v13, v14, n - 1);
      this.drawSierpinskiGasket(v02, v12, v2, v23, v01, n - 1);
      this.drawSierpinskiGasket(v03, v13, v23, v3, v34, n - 1);
    }
  }

  addFog() {
    this.scene.fog = new FogExp2(this.controls.fogColor, this.controls.fogDensity);
  }

  @autobind
  renderScene() {
    this.frameCount++;

    const t = this.frameCount * this.controls.rotationSpeed;

    // const spotLight = this.lights.spotLight;
    // const x = spotLight.position.x;
    // const y = this.controls.spotLightHeight;
    // const z = spotLight.position.z;

    // spotLight.position.set(x * Math.sin(t) - 10, y, z * Math.cos(t) - 10);

    this.scene.rotation.set(0, t, 0);

    this.stats.update();
    requestAnimationFrame(this.renderScene);
    this.renderer.render(this.scene, this.camera);
  }

  deg2Rad(degrees) {
    return (degrees || 0) / 180 * Math.PI;
  }
}
