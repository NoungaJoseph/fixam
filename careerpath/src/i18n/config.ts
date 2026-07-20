import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import careerpathEn from './locales/en/careerpath.json';
import careerpathFr from './locales/fr/careerpath.json';
import dashboardEn from './locales/en/dashboard.json';
import dashboardFr from './locales/fr/dashboard.json';
import authEn from './locales/en/auth.json';
import authFr from './locales/fr/auth.json';
import catalogEn from './locales/en/catalog.json';
import catalogFr from './locales/fr/catalog.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: { ...careerpathEn, dashboard: dashboardEn, auth: authEn, catalog: catalogEn },
      },
      fr: {
        translation: { ...careerpathFr, dashboard: dashboardFr, auth: authFr, catalog: catalogFr },
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
