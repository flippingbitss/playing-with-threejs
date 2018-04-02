import { Mesh, MeshLambertMaterial,MeshBasicMaterial, Vector3, BoxGeometry,Geometry,Face3 } from "three";

/**
 * @param {Vector3} geometryVec
 * @param {number} matColor
 * @param {boolean} isWireframe
 * @param {[Vector3,Vector3,Vector3]} transformVecs
 * @returns {Mesh}
 * @memberof Feb12
 */
export const createCubeMLM = (geometryVec, matColor, isWireframe, transformVecs) => {
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
};

/**
 * @param {[Vector3,Vector3,Vector3,Vector3]} vertices
 * @param {number} matColor
 * @param {boolean} isWireframe
 * @param {[Vector3,Vector3,Vector3]} transformVecs
 * @returns {Mesh}
 * @memberof Feb12
 */
export const createTetrahedron = (vertices, matColor, isWireframe, transformVecs) => {
  const geom = new Geometry();
  geom.vertices = vertices;

  geom.faces = [new Face3(0, 1, 2), new Face3(1, 3, 2), new Face3(0, 2, 3), new Face3(0, 3, 1)];
  // geom.computeFaceNormals();
  console.log(matColor);
  const material = new MeshLambertMaterial({
    color: matColor || 0xffffff,
    wireframe: !!isWireframe
  });

  const tetrahedron = new Mesh(geom, material);

  // set transform
  if (transformVecs) {
    const [pos, scale, rotation] = transformVecs;
    tetrahedron.position.x = pos.x;
    tetrahedron.position.y = pos.y;
    tetrahedron.position.z = pos.z;

    if (scale) {
      tetrahedron.scale.x = scale.x || 1;
      tetrahedron.scale.y = scale.y || 1;
      tetrahedron.scale.z = scale.z || 1;
    }

    if (rotation) {
      let { x: rx, y: ry, z: rz } = rotation;
      tetrahedron.rotation.x = this.deg2Rad(rx);
      tetrahedron.rotation.y = this.deg2Rad(ry);
      tetrahedron.rotation.z = this.deg2Rad(rz);
    }
  }

  return tetrahedron;
};




/**
 * @param {[Vector3,Vector3,Vector3,Vector3]} vertices
 * @param {number} matColor
 * @param {boolean} isWireframe
 * @param {[Vector3,Vector3,Vector3]} transformVecs
 * @returns {Mesh}
 * @memberof Feb12
 */
export const createPyramid = (vertices, matColor, isWireframe, transformVecs) => {
  const geom = new Geometry();
  geom.vertices = vertices;

  geom.faces = [
    new Face3(0, 1, 2), 
    new Face3(1, 3, 4), 
    new Face3(0, 4 ,3), 
    new Face3(1, 0, 4),
    new Face3(0, 3,2), 
    new Face3(1, 2, 3),
    // new Face3(1, 3, 4),
  ];
  // geom.computeFaceNormals();
  console.log(matColor);
  const material = new MeshBasicMaterial({
    color: matColor || 0xffffff,
    wireframe: !!isWireframe
  });

  const tetrahedron = new Mesh(geom, material);

  // set transform
  if (transformVecs) {
    const [pos, scale, rotation] = transformVecs;
    tetrahedron.position.x = pos.x;
    tetrahedron.position.y = pos.y;
    tetrahedron.position.z = pos.z;

    if (scale) {
      tetrahedron.scale.x = scale.x || 1;
      tetrahedron.scale.y = scale.y || 1;
      tetrahedron.scale.z = scale.z || 1;
    }

    if (rotation) {
      let { x: rx, y: ry, z: rz } = rotation;
      tetrahedron.rotation.x = this.deg2Rad(rx);
      tetrahedron.rotation.y = this.deg2Rad(ry);
      tetrahedron.rotation.z = this.deg2Rad(rz);
    }
  }

  return tetrahedron;
};

export const createSaddle = (u, v, r = 20) => {
  const x = (u - 0.5) * r;
  const z = (v - 0.5) * r;
  const y = x * z / r;

  return new Vector3(x, y, z);
};

// export const midPoint = (v1,v2) => {
//   return v1.clone().add(v2).divideScalar()
// }


export const deg2Rad = degrees => {
  return (degrees || 0) / 180 * Math.PI;
};
