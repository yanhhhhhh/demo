import { useContext } from 'react';
import MobileScene from './mobileScene';
import PCScene from './pcScene';

import globalContext, { type GlobalOpt } from '@/providers/globalContext';

import ApplyScene from './apply-scene';

const SceneC = () => {
  const { device } = useContext<GlobalOpt>(globalContext);

  return (
    <>
      {(device.isMobile) ? (
        <MobileScene>
          <ApplyScene />
        </MobileScene>
      ) : (
        <PCScene>
          <ApplyScene />
        </PCScene>
      )}
    </>
  );
};

export default SceneC;
