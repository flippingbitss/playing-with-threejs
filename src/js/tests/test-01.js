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
	FogExp2,
	PointLight
  } from "three";
  import { Stats } from "three-stats";
  import dat from "dat.gui";
  import autobind from "autobind-decorator";
  
  export class Test01 {
	constructor() {
	  this.scene = new Scene();
  
	  // Camera
	  this.camera = new PerspectiveCamera(25, 4 / 3, 0.1, 1000);
	  this.camera.position.x = 40;
	  this.camera.position.y = 0;
	  this.camera.position.z = 0;
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
		this.generateRoom();		
	  this.addLights();
	  this.addFog();
	  document.getElementById("my-webgl-output").appendChild(this.renderer.domElement);
	  this.renderScene();
	}
  
	generateGUI() {
	  const gui = new dat.GUI();
  
	  const Controls = class {
		constructor() {
			this.px = 40;
			this.py = 0;
			this.pz = 0;
			this.ry = 90;
			this.rz = 0;
		  this.rotationSpeed = 0.01;
		  this.spotLightHeight = 40;
		  this.ambientLightColor = "#fd5e53";
		  this.fogNear = 1;
		  this.fogFar = 5;
		  this.fogDensity = 0.01;
		  this.fogColor = 0x221855;
		}
	  };
  
	  const controls = new Controls();

		const camera = gui.addFolder("Camera");
	  camera.add(controls, "px", -30, 60);
	  camera.add(controls, "py", -30, 60);
	  camera.add(controls, "pz", -30, 60);
		camera.add(controls, "ry", -180, 180);
		camera.add(controls, "rz", -180, 180);



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
	  const ambientLight = new AmbientLight(this.controls.ambientLightColor, 0.1);
  
	  // const spotLight = new SpotLight("#c0aaaa",0.5);
  
	  // // spot light 1
	  // spotLight.position.x = 0;
	  // spotLight.position.z = 0;
	  // spotLight.position.y = this.controls.spotLightHeight;
	  // spotLight.castShadow = true;
	  // spotLight.lookAt(this.objects.axes);
  
	  this.lights = {
	//	spotLight,
		ambientLight
	  };
  
	  this.scene.add(ambientLight);
	}

	generateRoom(){
		const room = new Object3D();
		const thickness = 0.30;
		const height = 10; 
		const length = 30; 

		// WALLS
		const ceiling = this.createCubeMLM(new Vector3(length, thickness, height), 0xf5f5dc, false,   [new Vector3(0, height/2 - thickness/2, 0)]);
		const leftWall = this.createCubeMLM(new Vector3(length, height, thickness), 0xf5f5dc, false,  [new Vector3(0, 0,height/2)]);
		const rightWall = this.createCubeMLM(new Vector3(length, height, thickness), 0xf5f5dc, false, [new Vector3(0, 0, -height/2)]);
		const backWall = this.createCubeMLM(new Vector3(thickness, height, height), 0xf5f5dc, false, [new Vector3(-length/2, 0, 0)]);
		const floor = this.createCubeMLM(new Vector3(length,thickness, height), 0xf5f5dc, false,   [new Vector3(0, -height/2 + thickness/2, 0)]);
		

		// LIGHTS
		const lights = new Object3D();
		const base1 = this.createCubeMLM(new Vector3(2, 0.01, 2), "#fff", false,   [new Vector3(0, height/2 - thickness, -2)]);
		const pointLight1 = new PointLight("#fff", 0.5);

		pointLight1.position.x = 0
		pointLight1.position.y = height / 2 - thickness - 1;
		pointLight1.position.z = -2;

		const base2 = this.createCubeMLM(new Vector3(2, 0.01, 2), "#fff", false,   [new Vector3(0, height/2 - thickness, 2)]);
		const pointLight2 = new PointLight("#fff", 0.5);

		pointLight1.position.x = 0
		pointLight1.position.y = height / 2 - thickness - 1;
		pointLight1.position.z = 2;

		lights.add(base1, pointLight1, base2,pointLight2)


		// STRIPES
		const stripes = new Object3D()
		const stripWidth = 0.5;
		const leftStripe = this.createCubeMLM(new Vector3(length, stripWidth, 0.01), "red", false,   [new Vector3(0, 0, height/2 - thickness/2)]);
		const rightStripe = this.createCubeMLM(new Vector3(length, stripWidth, 0.01), "red", false,   [new Vector3(0, 0, -height/2 + thickness/2)]);
		const bottomStripe = this.createCubeMLM(new Vector3(stripWidth*2,0.01, height), "red", false,   [new Vector3(0, -height/2+thickness, 0)]);
		const bottom2Stripe = this.createCubeMLM(new Vector3(length/2,0.01, stripWidth), "red", false,   [new Vector3(length/4, -height/2+thickness, 0)]);
		const backStripe = this.createCubeMLM(new Vector3(0.01, stripWidth, height), "red", false,   [new Vector3(-length/2+thickness/2, 0,0)]);
		
		stripes.add(leftStripe,rightStripe,bottomStripe,backStripe,bottom2Stripe)



		room.add(ceiling,leftWall,rightWall,backWall,floor, lights, stripes)
		this.objects.room = room;
    this.scene.add(room);
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
		// plane
	  };
  
	  // this.scene.add(axes, plane);
	}
  
	addFog() {
	  this.scene.fog = new FogExp2(this.controls.fogColor, this.controls.fogDensity);
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
  
	@autobind
	renderScene() {
	  this.frameCount++;
	
		const {px,py,pz,ry,rz} = this.controls;
		this.camera.position.x = px
		this.camera.position.y = py
		this.camera.position.z = pz
		this.camera.rotation.y = this.deg2Rad(ry);
		this.camera.rotation.z = this.deg2Rad(rz);

	  // const spotLight = this.lights.spotLight;
	  // const x = spotLight.position.x;
	  // const y = this.controls.spotLightHeight;
	  // const z = spotLight.position.z;
  
	  // spotLight.position.set(x * Math.sin(t) - 10, y, z * Math.cos(t) - 10);

  
	  this.stats.update();
	  requestAnimationFrame(this.renderScene);
	  this.renderer.render(this.scene, this.camera);
	}
  
	deg2Rad(degrees) {
	  return (degrees || 0) / 180 * Math.PI;
	}
  }
  