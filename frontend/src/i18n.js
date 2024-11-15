import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationRU from './Locales/ru.json';
import translationEN from './Locales/en.json';

const resources = {
  ru: {
    translation: translationRU,
  },
  en: {
    translation: translationEN,
  },
};

i18n
  .use(initReactI18next) // Передаю i18n в react-i18next
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
