import { rotationSide } from './../apply-scene/store';
import fanIcon from '@/assets/svgs/fan.svg';
import tvIcon from '@/assets/svgs/tv.svg';
import lampIcon from '@/assets/svgs/lamp.svg';
import phoneIcon from '@/assets/svgs/iphone.svg';
import solarPanelIcon from '@/assets/svgs/solar-panel.svg';
import { changPhone, changeFan, changeLamp, changeTV } from '.';
import { Space } from '@/utils';
import { CSSProperties } from 'react';
export type rotationSide = 'front' | 'back' | 'up' | 'down' | 'right' | 'left';
export interface ChargeObject3d {
  id: number;
  name: string;
  enName: string;
  modelName: string;
  icon: string;
  useTime: number;
  unit: string;
  power: number;
  powerUnit: string;
  path?: string;
  changeEffect: (space: Space, isRender: boolean) => void;
  isRun: boolean;
  rotationSide: rotationSide;
  transformStyle: CSSProperties['transform'];
}
export const PhoneModelName = 'iphone_x_glb';
export const TVModelName = 'tv';
export const LampModelName = 'floor_lamp_glb';
export const FanModelName = 'fans_glb';
export const VallumModelName = 'vallum'; //扇叶
export const SolarPanelModelName = 'solar_panel';
export const HeroModelName = 'hero_glb';
export const TVScreenModelName = 'tv001';
export const BulbModelName = 'bulb001'; //灯泡
export const dischargeObject3d: ChargeObject3d[] = [
  {
    id: 1,
    name: '电视',
    enName: 'TV',
    modelName: TVModelName,
    icon: tvIcon,
    useTime: 10,
    unit: 'hours',
    //功率
    power: 100,
    powerUnit: 'W', //单位
    path: 'batteryToTV',
    isRun: false,
    changeEffect: changeTV,
    rotationSide: 'back',
    transformStyle: 'translate(55%,0)',
  },
  {
    id: 2,
    name: '台灯',
    enName: 'Lamp',
    modelName: LampModelName,
    icon: lampIcon,
    useTime: 80,
    unit: 'hours',
    //功率
    power: 20,
    powerUnit: 'W', //单位
    path: 'batteryToDeskLamp',
    isRun: false,
    changeEffect: changeLamp,
    rotationSide: 'front',
    transformStyle: 'translate(55%,100%)',
  },
  {
    id: 3,
    name: '电风扇',
    enName: 'fan',
    modelName: FanModelName,
    icon: fanIcon,
    useTime: 16,
    unit: 'hours',
    //功率
    power: 30,
    powerUnit: 'W', //单位
    path: 'batteryToFan',
    isRun: false,
    changeEffect: changeFan,
    rotationSide: 'back',
    transformStyle: 'translate(55%,0)',
  },
  {
    id: 4,
    name: '手机',
    enName: 'phone',
    modelName: PhoneModelName,
    icon: phoneIcon,
    useTime: 89,
    unit: 'charges',
    //功率
    power: 25,
    powerUnit: 'W', //单位
    path: 'batteryToPhone',
    isRun: false,
    changeEffect: (_, isRender) => changPhone(isRender),
    rotationSide: 'right',
    transformStyle: 'translate(55%,-50%)',
  },
];

export const dischargeObject3D = [
  {
    name: '太阳能板',
    modelName: SolarPanelModelName,
    icon: solarPanelIcon,
    //输入功率
    inputPower: 200,
    unit: 'W',
    //输出功率
    outputPower: 200,
    rotationSide: 'front' as rotationSide,
    transformStyle: 'translate(80%,0)',
    isRun: true,
  },
];
type DischargeObject3D = (typeof dischargeObject3D)[number];
export const deviceMap = new Map<string, DischargeObject3D>();
dischargeObject3D.map((i) => {
  deviceMap.set(i.modelName, i);
});
export const hero = {
  name: 'hero',
  modelName: HeroModelName,
};
//  vallum 扇叶
// solar_panel 太阳能板
export const electricPaths = {
  //太阳能板到电池组的路径
  solorPanelToBattery: [],
  // 电池组到电视机的路径
  batteryToTV: [],
  //电池组到台灯的路径
  batteryToDeskLamp: [],
  //电池组到电风扇的路径
  batteryToFan: [],
};
