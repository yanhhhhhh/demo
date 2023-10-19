import {
  BackSide,
  CatmullRomCurve3,
  Mesh,
  MeshBasicMaterial,
  RepeatWrapping,
  TextureLoader,
  TubeGeometry,
  Vector3,
} from 'three';
import line from '@/assets/images/electric-line.png?url';
// 创建顶点数组
// let points = [new THREE.Vector3(0, 0, 0),
//   new THREE.Vector3(10, 0, 0),
//   new THREE.Vector3(10, 0, 10),
//   new THREE.Vector3(0, 0, 10)
// ]

export function createElectric(points: Vector3[]) {
  console.log(line);
  const texture = new TextureLoader().load(line);
  texture.wrapS = texture.wrapT = RepeatWrapping; //每个都重复
  texture.repeat.set(1, 1);
  texture.needsUpdate = true;

  const material = new MeshBasicMaterial({
    map: texture,
    side: BackSide,
    transparent: true,
  });
  // CatmullRomCurve3创建一条平滑的三维样条曲线
  const curve = new CatmullRomCurve3(points); // 曲线路径
  // 创建管道
  const tubeGeometry = new TubeGeometry(curve, 80, 0.1);
  const mesh = new Mesh(tubeGeometry, material);
  mesh.name = 'electric';

  return mesh;
  // scene.add(mesh)
}
// function animate() {
//   // 一定要在此函数中调用
//   if (texture) texture.offset.x -= 0.01;
//   requestAnimationFrame(animate);
// }

// animate();
