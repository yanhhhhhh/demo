import {
  forwardRef,
  useContext,
  useEffect,
  // useLayoutEffect,
  useState,
} from 'react';

import { Control, controls } from '../constant';
import {
  ChargeObject3d,
  applySceneId,
  charge,
  discharge,
  initApplyScene,
  resetCamera,
} from '../space-utils';
import Style from './index.module.less';
import { Button } from 'antd';
import globalContext, { GlobalOpt } from '@/providers/globalContext';
import { getDeviceClassname, spaceStore } from '@/utils';
import SceneHeader from '../../components/sceneHeader';
import { useMemoizedFn } from 'ahooks';
import { useSetAtom } from 'jotai';
import { dischargeMapAtom } from './store';

function onClickControl(item: Control) {
  const space = spaceStore.get(applySceneId);
  if (!space) return;
  if (item.key === 'charge') {
    //销毁放电
    // discharge(space, false);
    //充电
    charge(space, true);
  }
  if (item.key === 'discharge') {
    //销毁充电
    charge(space, false);
    //放电
    discharge(space, true);
  }
}
function changeIsRun(map: Map<string, ChargeObject3d>, state: boolean) {
  const next = new Map(map);
  next.forEach((item) => {
    item.isRun = state;
  });
  return next;
}

interface ApplySceneProps {}
const ApplyScene = forwardRef<HTMLDivElement, ApplySceneProps>((props, ref) => {
  const { device } = useContext<GlobalOpt>(globalContext);
  const [currentControl, setCurrentControl] = useState(0);
  const setDischageMapState = useSetAtom(dischargeMapAtom);
  useEffect(() => {
    initApplyScene();

    return () => {
      const space = spaceStore.get(applySceneId);
      space?.destroy();
      spaceStore.delete(applySceneId);
    };
  }, [device.isMobile]);

  const onClick = useMemoizedFn((item: Control, index: number) => {
    if (currentControl === index) return;
    if (item.key === 'charge') {
      // setDischageMapState((pre) => {
      //   return changeIsRun(pre, false);
      // });
    } else {
      setDischageMapState((pre) => {
        return changeIsRun(pre, true);
      });
    }
    setCurrentControl(() => index);
    onClickControl(item);
  });

  return (
    <div className={`${getDeviceClassname(device)} ${Style.apply}`}>
      <SceneHeader title="数字展厅" />
      <div className={Style['three-apply']} id={applySceneId}></div>
      <div className={Style['apply-controls']}>
        {controls.map((item, index) => {
          return (
            <div
              className={`${Style['apply-controls-item']} 
             `}
              key={index}
              onClick={() => onClick(item, index)}
            >
              <div
                className={`${Style['line']} ${
                  index === currentControl ? Style['active-line'] : ''
                }`}
              ></div>
              <div
                className={`${Style['text']} ${
                  index === currentControl ? Style['active-text'] : ''
                }`}
              >
                {item.text}
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <Button onClick={resetCamera}>还原初始视角</Button>
      </div>
    </div>
  );
});

export default ApplyScene;
