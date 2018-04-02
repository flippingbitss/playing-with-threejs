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
import { createSaddle } from "../lib";
  
  export class March29 {
	constructor() {
	  this.scene = new Scene();
  
	  // Camera
	  this.camera = new PerspectiveCamera(25, 4 / 3, 0.1, 1000);
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
		  this.tetrahedronScale = 1;
		  this.tetrahedronColor = 0x10e3b1;
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
	  const ambientLight = new AmbientLight(this.controls.ambientLightColor);
  
	  const spotLight = new SpotLight("#c0aaaa");
  
	  // spot light 1
	  spotLight.position.x = 0;
	  spotLight.position.z = 0;
	  spotLight.position.y = this.controls.spotLightHeight;
	  spotLight.castShadow = true;
	  spotLight.lookAt(this.objects.axes);
  
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
  
	  plane.rotation.x = -this.deg2Rad(90);
	  plane.receiveShadow = true;
  
	  

	  this.objects = {
		axes,
		plane
	  };
  
	  this.scene.add(axes, plane);
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
  