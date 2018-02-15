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
  SphereGeometry
} from "three";
import { Stats } from "three-stats";
import dat from "dat.gui";
import autobind from 'autobind-decorator'

export class Feb12 {
  constructor() {
    this.scene = new Scene();

    // Camera
    this.camera = new PerspectiveCamera(50, 4 / 3, 0.1, 1000);
    this.camera.position.x = 30;
    this.camera.position.y = 50;
    this.camera.position.z = 30;
    this.camera.lookAt(this.scene.position);

    // Renderer
    this.renderer = new WebGLRenderer();
    this.renderer.setClearColor();
    this.renderer.setClearColor(new Color(0xbbffbb));
    this.renderer.setSize(800, 600);
    this.renderer.shadowMap.enabled = true

    // Stats
    this.stats = new Stats();

    // other vars
    this.frameCount = 0;
    this.main();
  }

  generateGUI() {
    const gui = new dat.GUI();

    const Controls = class {
      constructor() {
        this.rotationSpeed = 0.01;
        this.spotLightHeight = 40;
        this.dx = 0.1;
        this.dy = 5;
        this.dz = 0.2;
        this.numberOfBuildings = 1500;
        this.ambientLightColor = "#0c0c0c";
        this.fogColor = "#ffffff";
        this.fogNear = 0.1;
        this.forFar = 10;
      }
    };

    const controls = new Controls();

    gui.add(controls, "rotationSpeed", 0, 0.5);
    gui.add(controls, "spotLightHeight", 0, 100);
    gui.add(controls, "dx", 0, 5);
    gui.add(controls, "dy", 0, 15);
    gui.add(controls, "dz", 0, 5);
    gui.add(controls, "numberOfBuildings", 0, 2000);
    gui.addColor(controls, "ambientLightColor").onChange(c => {
      this.lights.ambientLight.color = new Color(c);
    });

    this.gui = gui;
    this.controls = controls;

    this.stats.setMode(0); // 0 => fps, 1=> ms / frame
    document.getElementById("my-stats-output").appendChild(this.stats.domElement);
  }

  main() {
    this.generateGUI();
    this.addObjects();
    this.addBuildings();
    this.addLights();

    document.getElementById("my-webgl-output").appendChild(this.renderer.domElement);
    this.renderScene();
  }

  addLights() {
    // ambient light
    const ambientLight = new AmbientLight(0x0c0c0c);

    const spotLight = new SpotLight(0xffffff);
    const spotLight2 = new SpotLight(0xffffff);

    // spot light 1
    spotLight.position.x = 0;
    spotLight.position.z = 0;
    spotLight.position.y = this.controls.spotLightHeight;
    spotLight.castShadow = true;
    spotLight.lookAt(this.objects.redCube);

    // spot light 1
    spotLight2.position.x = -10;
    spotLight2.position.z = -10;
    spotLight2.position.y = 30;
    spotLight2.castShadow = true;
    spotLight2.lookAt(this.objects.redCube);

    this.lights = {
      spotLight,
      ambientLight,
      spotLight2
    };

    this.scene.add(ambientLight, spotLight, spotLight2);
  }

  addObjects() {
    const axes = new AxesHelper(30);

    // Cube
    const redCube = this.createCubeMLM(new Vector3(4, 7, 4), 0xff0000, false, [
      new Vector3(0, 0, 0)
    ]);
    redCube.castShadow = true;

    // Plane
    const planeGeometry = new PlaneGeometry(20, 20, 2, 2);
    const planeMaterial = new MeshLambertMaterial({ color: 0xeeeeee });

    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.scale.x = 2;
    plane.scale.y = 2;

    plane.rotation.x = -this.deg2Rad(90);
    plane.position.x += 10;
    plane.position.z += 10;
    plane.receiveShadow = true;

    this.objects = {
      axes,
      redCube,
      plane
    };

    this.scene.add(axes, redCube, plane);
  }

  addBuildings() {
    // remove objects with BoxGeometry
    this.scene.children = this.scene.children.filter(o => o.geometry.type != "BoxGeometry");

    for (var i = 0; i < this.controls.numberOfBuildings; i++) {
      const dx = Math.random() * this.controls.dx;
      const dy = Math.random() * 5;
      const dz = Math.random() * 0.2;

      const px = -10 + Math.random() * 20;
      const py = dy / 2;
      const pz = -10 + Math.random() * 20;

      const geometryVec = new Vector3(dx, dy, dz);
      const posVec = new Vector3(px, py, pz);

      const cube = this.createCubeMLM(geometryVec, 0x8888ff, false, [posVec]);

      this.scene.add(cube);
    }
  }

  @autobind
  renderScene() {
    this.frameCount++;

    const t = this.frameCount * this.controls.rotationSpeed;
    // console.log(t);

    let { redCube } = this.objects;

    this.scene.remove(redCube);

    // red_cube=createCubeMLM(controls.dx,7,4,0xFF0000,false,-4,3,0,5,1,1,0,0,-30);
    redCube = this.createCubeMLM(new Vector3(4, 7, 4), 0xff0000, false, [new Vector3(0, 0, 0)]);
    redCube.castShadow = true;
    this.objects.redCube = redCube;
    this.scene.add(redCube);

    const spotLight = this.lights.spotLight;
    const x = spotLight.position.x;
    const y = this.controls.spotLightHeight;
    const z = spotLight.position.z;

    spotLight.position.set(x * Math.sin(t) - 10, y, z * Math.cos(t) - 10);
    spotLight.lookAt(redCube);

    this.scene.rotation.set(0, t, 0);

    this.stats.update();
    requestAnimationFrame(this.renderScene);
    this.renderer.render(this.scene, this.camera);
  }

  deg2Rad(degrees) {
    return (degrees || 0) / 180 * Math.PI;
  }

  /**
   * @param {Vector3} geometryVec
   * @param {number} matColor
   * @param {boolean} isWireframe
   * @param {[Vector3,Vector3,Vector3]} transformVecs
   * @returns {Mesh}
   * @memberof Feb12
   */
  createCubeMLM(geometryVec, matColor, isWireframe, transformVecs) {
    const { x: dx, y: dy, z: dz } = geometryVec;
    const cubeGeometry = new BoxGeometry(dx || 1, dy || 1, dz || 1);
    const cubeMaterial = new MeshLambertMaterial({
      color: matColor || 0xffffff,
      wireframe: isWireframe || false
    });

    const cube = new Mesh(cubeGeometry, cubeMaterial);

    const [pos, scale, rotation] = transformVecs;
    cube.position.x = pos.x;
    cube.position.y = pos.y;
    cube.position.z = pos.z;

    if (scale) {
      cube.scale.x = scale.x || 1;
      cube.scale.y = scale.y || 1;
      cube.scale.z = scale.z || 1;
    }

    if (rotation) {
      let { x: rx, y: ry, z: rz } = rotation;
      cube.rotation.x = this.deg2Rad(rx);
      cube.rotation.y = this.deg2Rad(ry);
      cube.rotation.z = this.deg2Rad(rz);
    }

    return cube;
  }

  /**
   * @param {number} radius
   * @param {number} numWidth
   * @param {number} numHeight
   * @param {number} matColor
   * @param {boolean} isWireframe
   * @param {[Vector3,Vector3]} transformVecs
   * @returns {Mesh}
   * @memberof Feb12
   */
  createSphere(radius, numWidth, numHeight, matColor, isWireframe, transformVecs) {
    // create a sphere

    const sphereGeometry = new SphereGeometry(radius, numWidth, numHeight);
    const sphereMaterial = new MeshBasicMaterial({
      color: matColor || 0xffffff,
      wireframe: isWireframe || false
    });
    const sphere = new Mesh(sphereGeometry, sphereMaterial);
    // position the sphere
    const [pos, scale] = transformVecs;
    sphere.position.x = pos.x;
    sphere.position.y = pos.y;
    sphere.position.z = pos.z;
    sphere.scale.x = scale.x;
    sphere.scale.y = scale.y;
    sphere.scale.z = scale.z;

    return sphere;
  }
}
