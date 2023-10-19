// 基础存储
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { storeKeys } from './constants';

enum ELang {
  chinese = 'zh-CN',
  english = 'en',
}
interface IBaseConfig {
  language: `${ELang}` | string
}

const initialBaseStore: IBaseConfig = {
  language: 'en'
};

const storage = createJSONStorage<IBaseConfig>(() => localStorage);
const baseConfig = atomWithStorage<IBaseConfig>(storeKeys.baseConfig, initialBaseStore, storage);

export {
  baseConfig,
  ELang
};
