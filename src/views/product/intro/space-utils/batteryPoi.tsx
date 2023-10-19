import { Space } from '@/utils';
import { Charge } from '../apply-scene/components';
import { PhoneModelName, createReactElement } from '.';
import { Object3D } from 'three';
export let batteryPoi: Object3D | null = null;
export function createBatteryPoi(space: Space) {
  const element = createReactElement(<Charge />);
  const el = space.scene.getObjectByName(PhoneModelName);
  if (!el) return;
  const poi = space.createPoiNode(space, { type: '2.5d', element });
  poi.scale.multiplyScalar(0.01);
  const { center } = space.getCenterPointAndSize(el);
  poi.position.copy(center);

  poi.position.z -= 1;
  poi.name = el.name + '-poi';
  batteryPoi = poi;
  return poi;
}
export function changeBatteryPoi(visable: boolean) {
  if (!batteryPoi) return;
  batteryPoi.visible = visable;
}
