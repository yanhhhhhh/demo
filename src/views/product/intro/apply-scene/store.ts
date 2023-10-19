import { atom } from 'jotai';
import {
  dischargeObject3d,
  ChargeObject3d,
  deviceMap,
  SolarPanelModelName,
} from '../space-utils/constant';

export const dischargeObjectMap = new Map<string, ChargeObject3d>();
export const dischargeObjectModelNameArr: string[] = [];
dischargeObject3d.map((i) => {
  dischargeObjectModelNameArr.push(i.modelName);
  dischargeObjectMap.set(i.modelName, i);
});
const solarInfo = deviceMap.get(
  SolarPanelModelName
) as unknown as ChargeObject3d;
dischargeObjectMap.set(SolarPanelModelName, solarInfo);
export const dischargeMapAtom = atom(dischargeObjectMap);
