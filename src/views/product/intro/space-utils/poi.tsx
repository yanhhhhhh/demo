import { Space, spaceStore } from '@/utils';
import { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { SolarPanelModelName, applySceneId, deviceMap, rotationSide } from '.';
import {
  dischargeObjectMap,
  dischargeObjectModelNameArr,
} from '../apply-scene/store';
import { PoiNode } from '../apply-scene/components';
import { Object3D } from 'three';

export function createReactElement(reactNode: ReactNode) {
  const element = document.createElement('div');
  createRoot(element).render(reactNode);
  return element;
}
export const poiMap = new Map<string, any>();

const DEG90 = Math.PI * 0.5;
const DEG180 = Math.PI;

export function rotateTo(space: Space, side: rotationSide) {
  const { cameraControls } = space;
  switch (side) {
    case 'front':
      cameraControls.rotateTo(0, DEG90, true);

      break;

    case 'back':
      cameraControls.rotateTo(DEG180, DEG90, true);

      break;

    case 'up':
      cameraControls.rotateTo(0, 0, true);

      break;

    case 'down':
      cameraControls.rotateTo(0, DEG180, true);

      break;

    case 'right':
      cameraControls.rotateTo(DEG90, DEG90, true);

      break;

    case 'left':
      cameraControls.rotateTo(-DEG90, DEG90, true);

      break;
  }
}
export function resetCamera() {
  const space = spaceStore.get(applySceneId);
  if (!space) return;
  const obj = space.scene.getObjectByName('Scene');
  if (!obj) return;
  // space.cameraControls.azimuthAngle = 3.1493203383383186;
  // space.cameraControls.polarAngle = 0.6166069778841566;
  // space.cameraControls.distance = 9.80134924096863;
  // const position = {
  //   x: 6.353240753868054,
  //   y: 6.322638339474643,
  //   z: 1.188511376833606,
  // };
  // space.cameraControls.setPosition(position.x, position.y, position.z, false);
  // space.cameraControls.setTarget(0, 0, 0, true);

  rotateTo(space, 'front');
  space.cameraControls.azimuthAngle = 70;
  space.cameraControls.distance = 28;
  // space.cameraControls.maxDistance = 28;
  // space.cameraControls.minDistance = 0.4;
  space.cameraControls.fitToBox(obj, false, {
    cover: false,
    paddingLeft: 1,
    paddingBottom: 1,
    paddingTop: 1,
    paddingRight: 1,
  });
}
export function flyTo(
  space: Space,
  object: Object3D,
  rotationSide: rotationSide
) {
  const position = {
    x: 6.353240753868054,
    y: 6.322638339474643,
    z: 1.4188511376833606,
  };
  space.cameraControls.setPosition(position.x, position.y, position.z, false);
  space.cameraControls.setTarget(
    object.position.x,
    object.position.y,
    object.position.z,
    true
  );
  rotateTo(space, rotationSide);

  space.cameraControls.fitToBox(object, true, {
    cover: false,
    paddingLeft: 4,
    paddingBottom: 4,
    paddingTop: 4,
    paddingRight: 4,
  });
}
export function createPoi(space: Space) {
  space.scene.traverse((el) => {
    if (dischargeObjectModelNameArr.includes(el.name)) {
      const objectInfo = dischargeObjectMap.get(el.name);
      if (!objectInfo) return;
      const {
        modelName,
        icon,
        power,
        powerUnit,
        useTime,
        unit,
        changeEffect,
        rotationSide,
        transformStyle,
      } = objectInfo;
      const description = `${power}${powerUnit}   ${useTime}${unit}`;
      const info = { icon, modelName, description, transformStyle };
      const onChange = (state: boolean) => {
        changeEffect(space, state);
      };
      const onClick = () => {
        flyTo(space, el, rotationSide);
      };
      const element = createReactElement(
        <PoiNode info={info} onClick={onClick} onChange={onChange}></PoiNode>
      );
      const poi = space.createPoiNode(space, { type: '2.5d', element });
      poi.scale.multiplyScalar(0.025);
      const { center, size } = space.getCenterPointAndSize(el);

      poi.position.copy(center);
      poi.position.y += (size.y / 3) * 2;
      // poi.position.z -= 2;
      poi.name = el.name + '-poi';
      poiMap.set(el.name, poi);
    }
  });
}
export function changePoi(space: Space, visable: boolean) {
  //显示poi
  poiMap.forEach((poi) => {
    poi.visible = visable;
  });
  space.triggerRender();
  space.render();
}
let solarPanelPoi: Object3D | null = null;
export function createSolarPanelPoi(space: Space) {
  const model = space.scene.getObjectByName(SolarPanelModelName);
  if (!model) return;
  const object = deviceMap.get(SolarPanelModelName);
  if (!object) return;
  const description = `${object.inputPower}${object.unit}   ${object.outputPower}${object.unit}`;
  const info = {
    icon: object.icon,
    modelName: object.modelName,
    description: description,
    transformStyle: object.transformStyle,
  };
  const onChange = (state: boolean) => {
    // object.changeEffect(space, state);
  };
  const onClick = () => {
    flyTo(space, model, object.rotationSide);
  };
  const element = createReactElement(
    <PoiNode info={info} onClick={onClick} onChange={onChange}></PoiNode>
  );

  const poi = space.createPoiNode(space, { type: '2.5d', element });
  poi.scale.multiplyScalar(0.05);
  const { center } = space.getCenterPointAndSize(model);
  poi.position.copy(center);
  // poi.position.z -= 2;
  poi.name = model.name + '-poi';
  solarPanelPoi = poi;
  return poi;
}
export function changeSolarPanelPoi(visable: boolean) {
  if (!solarPanelPoi) return;
  solarPanelPoi.visible = visable;
}
