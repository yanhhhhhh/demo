import { Carousel } from 'antd';
import SceneB from '../components/sceneB';
import SceneC from '../components/sceneC';
import Style from './view.module.less';
import { PropsWithChildren } from 'react';
import { features } from './constant';

const Intro = ({ children }: PropsWithChildren) => {

  const onCarouselChange = (currentSlide: number) => {};
  return (
    <>
      <div className={Style.productIntro}>
        <div className={Style.navBox}></div>
        <Carousel
          vertical={true}
          initialSlide={0}
          dotPosition={'right'}
          infinite={false}
          draggable={true}
          // lazyLoad={'progressive'}
          afterChange={onCarouselChange}
          touchMove={true}
          dots={{
            className: Style.dot,
          }}
        >
          <div className={Style.page}>
            <SceneB />
          </div>

          <div className={Style.page}>
            <SceneC features={features} />
          </div>
          <div className={Style.page}>{children}</div>
        </Carousel>
      </div>
    </>
  );
};

export default Intro;
