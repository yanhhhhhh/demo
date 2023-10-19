import { Space, spaceStore } from '@/utils';
import { Color } from 'three';
import { charge, init } from './apply';
import { resetCamera } from '.';

export * from './electric';
export * from './apply'; // 应用场景(充电/放电)
export * from './constant'; // 常量
export * from './poi'; // poi
export * from './batteryPoi'; // 手机充电poi
export const applySceneId = 'apply-scene';
export async function initApplyScene() {
  let space: Space | null = spaceStore.get(applySceneId) || null;

  if (!space) {
    const container = document.getElementById(applySceneId) as HTMLElement;

    space = new Space(container, {
      showViewHelper: import.meta.env.DEV ? true : false,
      events: {
        selectPosition: (position) => {
          console.log(position);
        },
        click: (params) => {
          console.log('click', params);
        },
      },
    });
    space.start();
    spaceStore.set(applySceneId, space);

    (window as any)['applySpace'] = space;

    space.scene.background = new Color(0xcccccc);
    const object = await space.loadModel(
      `${import.meta.env.BASE_URL}/model/scene.glb`,
      false
    );

    applySceneCallback && applySceneCallback(space);

    init();
    charge(space, true);
  }
  return space;
}
// 应用场景回调
export function applySceneCallback(space: Space) {
  resetCamera();
  space.cameraControls.enabled = import.meta.env.DEV ? true : false;
}
