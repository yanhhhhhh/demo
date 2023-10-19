import { HeroScene } from './hero-scene';
import styles from './view.module.less';
import { useInViewport, useMemoizedFn } from 'ahooks';
import { useContext, useEffect, useRef } from 'react';

import { getDeviceClassname, spaceHeroId, spaceStore } from '@/utils';
import { heroSceneCallback } from './hero-scene/space-utils';
import { Object3D } from 'three';

import SceneHeader from '../components/sceneHeader';
import SceneA from '../components/sceneA';

import cover0 from '@/assets/images/size-comparison0.webp';
import cover1 from '@/assets/images/size-comparison1.png';
import globalContext, { GlobalOpt } from '@/providers/globalContext';
import { useTranslation } from 'react-i18next';

function ProductDetail() {
  const ref = useRef(null);
  const { device } = useContext<GlobalOpt>(globalContext);
  const [inViewport] = useInViewport(ref);

  const { t } = useTranslation();

  useEffect(() => {
    const space = spaceStore.get(spaceHeroId);
    if (inViewport && space) {
      space.start();
      console.log('start');
    } else {
      space?.stop();
    }
  }, [inViewport]);

  const heroSceneLoadedCallback = useMemoizedFn((object: Object3D) => {
    const padding = device.isPc ? 10 : 4;
    const distance = device.isPc ? (device.isTablet ? 12 : 15) : 10;

    console.log('heroSceneLoadedCallback', device, distance);
    heroSceneCallback({ object, padding, distance });
  });
  return (
    <div className={`${getDeviceClassname(device)} ${styles.detail}`}>
      {/* 产品介绍 */}

      <div className={styles.intro}>
        <SceneHeader title={t(`header.product`)} />
        <div className={styles['intro-scene']}>
          <HeroScene
            ref={ref}
            model={`${import.meta.env.BASE_URL}/model/hero.glb`}
            id={spaceHeroId}
            modelLoadedCallback={heroSceneLoadedCallback}
          />
        </div>
      </div>
      <div className={styles.comparision0}>
        <img src={cover0} />
        <header>
          <SceneHeader title={t(`header.SizeComparison`)} />
        </header>
      </div>
      <div className={styles.comparision1}>
        <img src={cover1} />
      </div>
      {/* 产品参数 */}
      <SceneA />
    </div>
  );
}
export default ProductDetail;
