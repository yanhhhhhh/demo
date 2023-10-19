import { Space, spaceStore } from '@/utils';
import {
  BulbModelName,
  LampModelName,
  SolarPanelModelName,
  TVModelName,
  TVScreenModelName,
  VallumModelName,
  applySceneId,
} from '.';
import {
  BufferGeometry,
  Color,
  Euler,
  LineBasicMaterial,
  Mesh,
  Object3D,
  Vector3,
} from 'three';

import { Line } from 'three';
import { Tween } from '@tweenjs/tween.js';

import {
  changePoi,
  changeSolarPanelPoi,
  createPoi,
  createSolarPanelPoi,
} from './poi';
import { changeBatteryPoi, createBatteryPoi } from './batteryPoi';
// import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
// import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';

export async function init() {
  const space = spaceStore.get(applySceneId);
  if (!space) return;
  //创建poi
  createPoi(space);

  //创建太阳能板到电池组的路径
  createLineFromSolarToBattery(space);
  createSolarPanelPoi(space);
  //电视机
  const tvModel = space.scene.getObjectByName(TVModelName);

  if (!tvModel) return;
  initTV(space, tvModel);

  //风扇动画
  const vallum = space.scene.getObjectByName(VallumModelName);
  if (!vallum) return;
  //台灯
  initLamp(space);
  charge(space, true);
  //手机充电效果poi
  createBatteryPoi(space);
  changeBatteryPoi(false);
  await initFan(space, vallum);
}

//创建太阳能板到电池组的路径
export function createLineFromSolarToBattery(space: Space) {
  const start = new Vector3(
    0.7382037862629127,
    11.004463707103259,
    17.91529087061012
  );
  const point1 = new Vector3(
    0.8793903530914187,
    2.7940630016118497,
    17.831874344277452
  );

  const end = new Vector3(
    -0.6184883609149479,
    3.035757426469787,
    16.875604048214534
  );
  const points = [start, point1, end];
  const material = new LineBasicMaterial({
    color: 0x00ff00,
    linewidth: 10,
  });

  const geometry = new BufferGeometry().setFromPoints(points);

  const line = new Line(geometry, material);
  line.name = 'lineFromSolarToBattery';
  line.visible = false;
  space.scene.add(line);
  // space.loop.updatables.push(() => {
  //   material.resolution.set(
  //     space.container.clientWidth,
  //     space.container.clientHeight
  //   );
  // });
}
//控制太阳能板到电池组的路径显示隐藏
export function changeLineFromSolarToBattery(space: Space, visable: boolean) {
  const line = space.scene.getObjectByName('lineFromSolarToBattery');
  if (line) {
    line.visible = visable;
  }
}
//风扇动画
let fanTween: Tween<Euler> | null = null;

async function initFan(space: Space, vallum: Object3D) {
  await space
    .animation(
      vallum.rotation,
      {
        x: vallum.rotation.x,
        y: Math.PI * 10,
        z: vallum.rotation.z,
      } as Euler,
      { duration: 1000, repeat: true },
      function (source, tween) {
        // onUpdate
        // console.log(tween);
      },
      function (_tween) {
        // onStart
        fanTween = _tween;
        fanTween.pause();
      }
    )
    .catch(() => {
      // 动画终止了
    });
}
export function changeFan(space: Space, open: boolean) {
  if (fanTween) {
    if (fanTween.isPlaying() && !open) {
      fanTween.pause();
    } else {
      fanTween.resume();
    }
  }
  space.triggerRender();
}
//电视机
function initTV(space: Space, tv: Object3D) {
  tv.traverse((el) => {
    if (el instanceof Mesh) {
      el.userData.originMaterial = el.material.emissiveMap;
      el.userData.originColor = el.material.color;
      el.material.emissiveMap = null;
      el.material.color = new Color(0x000000);
      el.material.needsUpdate = true;
    }
  });
  space.triggerRender();
}
export function changeTV(space: Space, open: boolean) {
  const tv = space.scene.getObjectByName(TVScreenModelName) as Object3D;

  tv.traverse((el) => {
    if (el instanceof Mesh) {
      if (!open) {
        el.material.emissiveMap = null;
        el.material.color = new Color(0x000000);
      } else {
        el.material.emissiveMap = el.userData.originMaterial;
        el.material.color = el.userData.originColor;
      }

      el.material.needsUpdate = true;
    }
  });
  const tvWrap = space.scene.getObjectByName(TVModelName);
  if (!tvWrap) return;

  open
    ? space.edgeShow(tvWrap, {
        color: 0xffffff,
        edgeStrength: 3,
      })
    : space.unEdgeShow(tvWrap);
  space.triggerRender();
}
//台灯
function initLamp(space: Space) {
  const amLight = space.getAmbientLight();
  amLight.intensity = 0.3;
  const lamp = space.scene.getObjectByName(LampModelName);
  if (!lamp) return;
  lamp.traverse((el) => {
    if (el instanceof Mesh && el.name === BulbModelName) {
      el.userData.originEmissive = el.material.emissive;
      el.userData.originColor = el.material.color;
      el.material.originOpacity = el.material.opacity;
      el.material.transparent = true;
    }
  });
}
export function changeLamp(space: Space, open: boolean) {
  const lamp = space.scene.getObjectByName(LampModelName);
  if (!lamp) return;
  lamp.traverse((el) => {
    if (el instanceof Mesh && el.name === BulbModelName) {
      if (!open) {
        el.material.emissive = el.userData.originEmissive;
        el.material.color = el.userData.originColor;
        el.material.opacity = el.material.originOpacity;
      } else {
        el.material.emissive = new Color(0xffffff);
        el.material.color = new Color(0xffffff);
        el.material.opacity = 1;
      }

      el.material.needsUpdate = true;
    }
  });
  const amLight = space.getAmbientLight();
  if (open) {
    amLight.intensity = 1.5;
  } else {
    amLight.intensity = 0.5;
  }
  space.triggerRender();
}
export function changPhone(isRender: boolean) {
  changeBatteryPoi(isRender);
}
//充电场景流程
/**
 *
 * @param space
 * @param isRender true 开启充电场景 false 关闭充电场景
 * @returns
 */
export async function charge(space: Space, isRender: boolean) {
  //1. 太阳能板发光效果
  const solarPanel = space.scene.getObjectByName(SolarPanelModelName);
  if (!solarPanel) return;
  if (isRender) {
    space.emissiveShow(solarPanel, {
      color: 0x3866f7,
      duration: 3000,
    });
  } else {
    space.unEmissiveShow(solarPanel);
  }
  //显示太阳能板到电池组的路径
  changeLineFromSolarToBattery(space, isRender);
  changeSolarPanelPoi(isRender);
  space.triggerRender();
}

/**
 *
 * @param space
 * @param isRender true 开启放电场景 false 关闭放电场景
 */
export function discharge(space: Space, isRender: boolean) {
  changePoi(space, isRender);
  changeFan(space, isRender);
  changeTV(space, isRender);
  changeLamp(space, isRender);
  changPhone(isRender);
}
