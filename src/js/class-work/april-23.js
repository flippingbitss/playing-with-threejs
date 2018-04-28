import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SpotLight,
  AxesHelper,
  PlaneGeometry,
  MeshLambertMaterial,
  MeshBasicMaterial,
  Path,
  AmbientLight,
  SplineCurve,
  BufferGeometry,
  LineBasicMaterial,
  Vector2,
  Line,
  BoxGeometry,
  Vector3,
  Mesh,
  Color,
  SphereGeometry,
  ShapeGeometry,
  ExtrudeGeometry,
  MeshPhongMaterial,
  Triangle,
  Geometry,
  Face3,
  Shape,
  MeshNormalMaterial,
  Object3D,
  FogExp2
} from "three";
import { Stats } from "three-stats";
import dat from "dat.gui";
import autobind from "autobind-decorator";
import { createSaddle, deg2Rad } from "../lib";

export class April23 {
  constructor() {
    this.scene = new Scene();

    // Camera
    this.camera = new PerspectiveCamera(75, 4 / 3, 0.1, 1000);
    this.camera.position.x = 30;
    this.camera.position.y = 30;
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
    this.addShape();
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
    fog.addColor(controls, "fogColor").onChange(c => (this.scene.fog.color = new Color(c)));

    // lighting.open();
    // fog.open();
    this.gui = gui;
    this.controls = controls;

    this.stats.setMode(0); // 0 => fps, 1=> ms / frame
    document.getElementById("my-stats-output").appendChild(this.stats.domElement);
  }

  addLights() {
    // ambient light
    const ambientLight = new AmbientLight(this.controls.ambientLightColor);

    const spotLight = new SpotLight("#c0aaaa");

    // spot light 1
    spotLight.position.x = 0;
    spotLight.position.z = 0;
    spotLight.position.y = this.controls.spotLightHeight;
    spotLight.castShadow = true;
    // spotLight.lookAt(this.objects.axes);

    this.lights = {
      spotLight,
      ambientLight
    };

    this.scene.add(ambientLight, spotLight);
  }

  addObjects() {
    const axes = new AxesHelper(10);

    // Plane
    const planeGeometry = new PlaneGeometry(10, 10, 2, 2);
    const planeMaterial = new MeshLambertMaterial({ color: 0xc5c5c5 });

    const plane = new Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -deg2Rad(90);
    plane.receiveShadow = true;

    this.objects = {
      axes
      // plane
    };

    this.scene.add(...Object.values(this.objects));
  }

  addShape() {
    const shape = new Shape();

    shape.moveTo(0, 0);
    shape.arc(0, 0, 10, 0, 0, false);
    // shape.
    // shape.bezierCurveTo(10, 20, 10, 0, 0, 10);
    // shape.bezierCurveTo(20, 30, 10, 5, 14, 5);
    // shape.bezierCurveTo(10, 20, 10, 0, 0, 0);

    const extrudeSettings = {
      amount: 0,
      bevelEnabled: true,
      bevelSegments: 0,
      steps: 1,
      bevelSize: 1,
      bevelThickness: 1
    };

    const geometry = new ExtrudeGeometry(shape, extrudeSettings);
    // const geometry = new ShapeGeometry(shape)

    const mesh = new Mesh(geometry, new MeshPhongMaterial());

    // Create a sine-like wave
    const curve = new SplineCurve([new Vector2(-10, 0), new Vector2(-5, 5), new Vector2(0, 0)]);

    const points = curve.getPoints(50);
    const lineGeometry = new BufferGeometry().setFromPoints(points);

    const material = new LineBasicMaterial({ color: 0xff0000 });

    const smileyShape = new Shape();
    smileyShape.moveTo(80, 40);
    smileyShape.absarc(40, 40, 40, 0, Math.PI * 2, false);
    const smileyEye1Path = new Path();
    smileyEye1Path.moveTo(35, 20);
    smileyEye1Path.absellipse(25, 20, 10, 10, 0, Math.PI * 2, true);
    smileyShape.holes.push(smileyEye1Path);
    const smileyEye2Path = new Path();
    smileyEye2Path.moveTo(65, 20);
    smileyEye2Path.absarc(55, 20, 10, 0, Math.PI * 2, true);
    smileyShape.holes.push(smileyEye2Path);
    const smileyMouthPath = new Path();
    smileyMouthPath.moveTo(20, 40);
    smileyMouthPath.quadraticCurveTo(40, 60, 60, 40);
    smileyMouthPath.bezierCurveTo(70, 45, 70, 50, 60, 60);
    smileyMouthPath.quadraticCurveTo(40, 80, 20, 60);
    smileyMouthPath.quadraticCurveTo(5, 50, 20, 40);
    smileyShape.holes.push(smileyMouthPath);

    const smiley = new ShapeGeometry(smileyShape);
    const smileyMesh = new Mesh(smiley, new MeshPhongMaterial());

    smileyMesh.scale.set(0.2,.2,.2);
    smileyMesh.rotateZ(180)
    // Create the final object to add to the scene
    const splineObject = new Line(lineGeometry, material);

    // mesh.scale.set(0.1,0.1,.1)
    this.scene.add(smileyMesh);
  }

  addFog() {
    this.scene.fog = new FogExp2(this.controls.fogColor, this.controls.fogDensity);
  }

  @autobind
  renderScene() {
    this.frameCount++;

    const t = this.frameCount * this.controls.rotationSpeed;

    const spotLight = this.lights.spotLight;
    const x = spotLight.position.x;
    const y = this.controls.spotLightHeight;
    const z = spotLight.position.z;

    spotLight.position.set(x * Math.sin(t) - 10, y, z * Math.cos(t) - 10);

    this.scene.rotation.set(0, t, 0);

    this.stats.update();
    requestAnimationFrame(this.renderScene);
    this.renderer.render(this.scene, this.camera);
  }
}
