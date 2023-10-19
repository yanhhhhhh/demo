import { createContext } from "react";
import {
  type Device
} from '@/utils'

export interface GlobalOpt {
  device: Device;
}

export const initialGlobalOpt: GlobalOpt = {
  device: {
    isMobile: false,
    isTablet: false,
    isPc: true
  },
};

const globalContext = createContext<GlobalOpt>(initialGlobalOpt);

export default globalContext;
