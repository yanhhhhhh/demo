import { forwardRef } from 'react';
import { Space } from '@/utils';
import { useMount } from 'ahooks';
import styles from './view.module.less';
import { spaceStore } from '@/utils';

import { Object3D } from 'three';

interface HeroSceneProps {
  model: string;
  id: string;
  modelLoadedCallback?: (object: Object3D) => void;
}
const HeroScene = forwardRef<HTMLDivElement, HeroSceneProps>((props, ref) => {
  const { model, id, modelLoadedCallback } = props;

  useMount(async () => {
    let space: Space | null = spaceStore.get(id) || null;
    if (!space) {
      const container = document.getElementById(id) as HTMLElement;
      space = new Space(container, {
        showViewHelper: false,
        // enableOutline: true,
      });
      (window as any).detailSpace = space;
      spaceStore.set(id, space);
      const object = await space.loadModel(model, false);
      modelLoadedCallback && modelLoadedCallback(object);
    }
  });

  return (
    <>
      <div id={id} ref={ref} className={styles.threeScene}></div>
    </>
  );
});
export default HeroScene;
