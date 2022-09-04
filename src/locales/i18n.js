/* eslint-disable no-undef */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translateVI from 'locales/languages/vi.json';
// import translateEN from 'locales/languages/en.json';

const resources = {
  vi: {
    translation: translateVI,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: process.env.REACT_APP_DEFAULT_LANG,
    fallbackLng: process.env.REACT_APP_DEFAULT_LANG,
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
