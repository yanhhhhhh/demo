import { createRoot } from 'react-dom/client';
import { Box3, Box3Helper, Color, Object3D, Vector3 } from 'three';

import { SpriteNode } from '../components';
import { renderDomMeshList } from './index';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Space } from '@/utils';

export function createPoiNodeElements(space: Space, model: Object3D) {
  const renderDomMeshNameList = renderDomMeshList.map((item) => item.name);

  model.traverse((child) => {
    const index = renderDomMeshNameList.findIndex(
      (item) => item === child.name
    );
    if (index !== -1) {
      const name = renderDomMeshList[index].displayName;
      const labelPosition = renderDomMeshList[index].labelPosition as
        | 'left'
        | 'right';
      child.userData.displayName = name;
      const box = new Box3().setFromObject(child);
      const helper = new Box3Helper(box, new Color(0xffff00));
      model.add(helper);

      const poiNode = createPoiNodeElement(space, child, name, labelPosition);
    }
  });
}

/** 创建其他 poi node */
export function createPoiNodeElement(
  space: Space,
  target: Object3D,
  text: string,
  labelPosition: 'left' | 'right'
) {
  const element = document.createElement('div');

  createRoot(element).render(
    <SpriteNode text={text} labelPosition={labelPosition}></SpriteNode>
  );

  const poiNode = new CSS2DObject(element);

  const { center, size } = space.getCenterPointAndSize(target);

  poiNode.position.set(0, 0, 0);
  poiNode.position.y += size.y * 0.5;

  target.add(poiNode);

  return poiNode;
}
