import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ja from './locales/ja.json';
import zhCN from './locales/zh-CN.json';
import zhTW from './locales/zh-TW.json';

const resources = {
  en: { translation: en },
  ja: { translation: ja },
  'zh-CN': { translation: zhCN },
  'zh-TW': { translation: zhTW }
};

// Check if we are in browser environment
const isBrowser = typeof window !== 'undefined';

const detector = new LanguageDetector();
// We can customize detector if needed

i18n
  .use(initReactI18next);

if (isBrowser) {
  i18n.use(detector);
}

i18n.init({
  resources,
  fallbackLng: 'ja',
  supportedLngs: ['en', 'ja', 'zh-CN', 'zh-TW'],
  detection: {
    order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage'],
    lookupLocalStorage: 'mypick_locale', // Custom key to persist
  },
  interpolation: {
    escapeValue: false // react already safes from xss
  },
  react: {
    useSuspense: false // Avoid issues with SSR
  }
});

export default i18n;
export { getUnitKey, getGradeKey };

// Helper functions for mapping
function getUnitKey(unit: number): string {
  switch (unit) {
    case 5: return 'hasunosora'; // Unit.Hasunosora
    case 1: return 'cerisebouquet'; // Unit.CeriseBouquet
    case 2: return 'dollchestra'; // Unit.Dollchestra
    case 3: return 'miracrapark'; // Unit.MiraCraPark
    case 4: return 'edelnote'; // Unit.EdelNote
    case 6: return 'other'; // Unit.Other
    default: return '';
  }
}

function getGradeKey(grade: number): string {
  switch (grade) {
    case 0: return 'c103'; // GradeClass.C103
    case 1: return 'c104'; // GradeClass.C104
    case 2: return 'c105'; // GradeClass.C105
    default: return '';
  }
}
