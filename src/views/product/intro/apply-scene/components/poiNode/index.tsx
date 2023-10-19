import { ConfigProvider, Switch } from 'antd';
import styles from './index.module.less';
import { useAtom } from 'jotai';
import { dischargeMapAtom } from '../../store';
import { ChargeObject3d } from '../../../space-utils';
import { CSSProperties } from 'react';

interface PoiNodeProps {
  info: {
    description: string;
    icon: string;
    modelName: string;
    transformStyle: CSSProperties['transform'];
  };
  onClick?: () => void;
  onChange?: (state: boolean) => void;
}

function PoiNode({ info, onChange, onClick }: PoiNodeProps) {
  const { icon, description, modelName, transformStyle } = info;
  const [dischargeMapAtomState, setDischageMapState] =
    useAtom(dischargeMapAtom);
  const currentPoi = dischargeMapAtomState.get(modelName) as ChargeObject3d;

  const switchChange = (state: boolean) => {
    onChange && onChange(state);
    currentPoi.isRun = state;
    const next = new Map(dischargeMapAtomState);
    next.set(modelName, currentPoi);
    setDischageMapState(next);
  };

  return (
    <div className={styles.container} style={{ transform: transformStyle }}>
      <div
        className={styles.left}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        onClick={(e) => {
          e.stopPropagation();
          onClick && onClick();
        }}
      >
        <img src={icon} alt={description} />

        <div className={styles.description}>{description}</div>
      </div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#07C160',

            colorTextQuaternary: '#CCCCCC',
          },
        }}
      >
        <Switch
          size="small"
          onChange={switchChange}
          checked={currentPoi.isRun}
        />
      </ConfigProvider>
    </div>
  );
}
export default PoiNode;
