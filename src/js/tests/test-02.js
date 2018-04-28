import autobind from "autobind-decorator";
import dat from "dat.gui";
import {
  AmbientLight,
  AxesHelper,
  Color,
  FogExp2,
  FontLoader,
  Mesh,
  MeshLambertMaterial,
  MeshPhongMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SpotLight,
  TextGeometry,
  Vector3,
  WebGLRenderer
} from "three";
import { Stats } from "three-stats";
import { deg2Rad } from "../lib";
// import helvetikerFont from "../../assets/fonts/helvetiker_regular.typeface";

export class Test02 {
  constructor() {
    this.scene = new Scene();

    this.scene.rotateOnAxis(new Vector3(0, 1, 0), deg2Rad(90));

    // Camera
    this.camera = new PerspectiveCamera(100, 4 / 3, 0.1, 1000);
    this.camera.position.x = 35;
    this.camera.position.y = 10;
    this.camera.position.z = 10;
    this.camera.lookAt(new Vector3(0, 0, 0));

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
    this.addText();
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
        (this.px = 40), (this.py = 10), (this.pz = 10);
      }
    };

    const controls = new Controls();

    const lighting = gui.addFolder("Lighting");
    // lighting.add(controls, "spotLightHeight", 0, 100);
    lighting.addColor(controls, "ambientLightColor").onChange(c => {
      this.lights.ambientLight.color = new Color(c);
    });

    const camera = gui.addFolder("Camera");
    const onCamPosChange = property => value => {
      this.camera.position[property] = value;
      this.lights.spotLight.position[property] = value;

      this.camera.lookAt(new Vector3(0, 0, 0));
      this.lights.spotLight.lookAt(new Vector3(0, 0, 0));
    };

    camera.add(controls, "px", -30, 70).onChange(onCamPosChange("x"));
    camera.add(controls, "py", -50, 50).onChange(onCamPosChange("y"));
    camera.add(controls, "pz", -50, 50).onChange(onCamPosChange("z"));

    camera.open();
    // fog.open();
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

    const spotLight = new SpotLight("#c0aaaa", 5, 200);
    // ambientLight.castShadow = true;
    // spot light 1
    const cameraPos = this.camera.position;
    spotLight.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    spotLight.castShadow = true;
    spotLight.lookAt(new Vector3(0, 0, 0));

    this.lights = {
      spotLight,
      ambientLight
    };

    this.scene.add(ambientLight, spotLight);
  }

  addObjects() {
    const axes = new AxesHelper(10);

    // Plane
    const planeGeometry = new PlaneGeometry(70, 50, 2, 2);
    const planeMaterial = new MeshLambertMaterial({ color: "#008cc5" });

    const plane = new Mesh(planeGeometry, planeMaterial);

    // plane.rotation.x = -deg2Rad(90);
    plane.receiveShadow = true;
    plane.position.add(new Vector3(0, 0, -5));

    this.objects = {
      axes,
      plane
    };

    this.scene.add(axes, plane);
  }

  addText() {
    const loader = new FontLoader();

    loader.load("../../assets/fonts/helvetiker_regular.typeface.js", font => {
      const options = {
        size: 5,
        height: 1,
        weight: "normal",
        font: font,
        bevelThickness: 0,
        bevelSize: 0,
        bevelSegments: 1,
        bevelEnabled: false,
        curveSegments: 10,
        steps: 1
      };

      const origin = new Vector3(0, 0, 0);

      const text1 = new TextGeometry("Interactive Gaming", options);

      const text2 = new TextGeometry("Winter 2018", options);

      const text1Mesh = new Mesh(
        text1,
        new MeshPhongMaterial({ color: "#933636" })
      );
      const text2Mesh = new Mesh(
        text2,
        new MeshPhongMaterial({ color: "#933636" })
      );

      console.log(text1Mesh.position);
      // text1Mesh.position.set(origin)
      text2Mesh.position.set(0, -10, 0);

      console.log(text2Mesh.position);

      // text1Mesh.rotateOnAxis(new Vector3(0,0,0), deg2Rad(90))

      const text = new Object3D();
      text.add(text1Mesh, text2Mesh);

      text.castShadow = true;
      text.position.add(new Vector3(-30, 0, 0));

      this.scene.add(text);
    });
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

    this.stats.update();
    requestAnimationFrame(this.renderScene);
    this.renderer.render(this.scene, this.camera);
  }
}
