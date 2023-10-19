import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import cn from '@/assets/jsons/locales/zh-cn.json';
import en from '@/assets/jsons/locales/en-us.json';

const resources = {
  'zh-CN': {
    translation: cn
  },
  en: {
    translation: en
  },
};

i18n
  .use(LanguageDetector) //嗅探当前浏览器语言 zh-CN
  .use(initReactI18next) // 将 i18n 向下传递给 react-i18next
    .init({ //初始化
      resources, //本地多语言数据
      fallbackLng: "zh-CN", //默认当前环境的语言
      detection: {
        caches: ['localStorage', 'sessionStorage', 'cookie'],
      },
      interpolation: {
        escapeValue: false,
      },
    })

export default i18n;
