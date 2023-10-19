// 首页首屏
import { useContext } from 'react';
import MobileScene from './mobileScene';
import PCScene from './pcScene';

import globalContext, { type GlobalOpt } from '@/providers/globalContext';

interface IFeature {
  text: string;
  desc?: string;
  cover: string;
  lineBreakText?: string; // 换行
}

export interface Props {
  features: IFeature[];
}

const SceneC = (props: Props) => {
  const { device } = useContext<GlobalOpt>(globalContext);

  return device.isMobile ? <MobileScene {...props} /> : <PCScene {...props} />
}

export default SceneC;
