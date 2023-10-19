import i18n from 'i18next';
import banner01 from '@/assets/images/banner01.png'; // 不取压缩图
import banner02 from '@/assets/images/banner02.webp';
import banner03 from '@/assets/images/banner03.webp';

import { type Props as SceneCProps } from '../components/sceneC';
export const features: SceneCProps['features'] = [
  {
    cover: banner01,
    text: i18n.t('desc.1kWhHighCapacityHighLongLifespancellSystem'),
    desc: i18n.t('desc.1kWhHighCapacityHighLongLifespancellSystemDesc'),
    lineBreakText: i18n.t('desc.1kWhHighCapacityHighLongLifespancellSystem2'),
  },
  {
    cover: banner02,
    text: i18n.t('desc.220VACCharging'),
    desc: i18n.t('desc.220VACChargingDesc'),
  },
  {
    cover: banner03,
    text: i18n.t('desc.ACOutputAvailableWhenChargedByPVPanels'),
    desc: i18n.t('ACOutputAvailableWhenChargedByPVPanelsDesc'),
    lineBreakText: i18n.t('desc.ACOutputAvailableWhenChargedByPVPanels2'),
  },
];
export interface Control {
  id: string;
  key: string;
  text: string;
}
export const controls: Control[] = [
  {
    id: '1',
    key: 'charge',
    text: '白天使用太阳能',
  },
  {
    id: '2',
    key: 'discharge',
    text: '停电时段',
  },
];
