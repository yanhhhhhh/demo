import SceneB from '../components/sceneB';
import SceneC from '../components/sceneC';
import { features } from './constant';
import Style from './view.module.less';
import { PropsWithChildren } from 'react';


const MobileProductIntro = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className={`${Style.productIntro}`}>
        <SceneB />
        <SceneC features={features} />
        <div>{children}</div>
      </div>
    </>
  );
};

export default MobileProductIntro;
