import {
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  PerspectiveCamera,
  OrthographicCamera,
} from "three";

const subsetOfTHREE = {
  Vector2: Vector2,
  Vector3: Vector3,
  Vector4: Vector4,
  Quaternion: Quaternion,
  Matrix4: Matrix4,
  Spherical: Spherical,
  Box3: Box3,
  Sphere: Sphere,
  Raycaster: Raycaster,
};
import CameraControls from "camera-controls";

CameraControls.install({ THREE: subsetOfTHREE });
export function initCameraControl(
  camera: PerspectiveCamera | OrthographicCamera,
  domElement: HTMLElement
) {
  const cameraControls = new CameraControls(camera, domElement);
  return cameraControls;
}
export { default as CameraControls } from "camera-controls";
