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
import opportunitiesEn from './locales/en/opportunities.json';
import opportunitiesFr from './locales/fr/opportunities.json';
import detailEn from './locales/en/career-path-detail.json';
import detailFr from './locales/fr/career-path-detail.json';
import certificatesEn from './locales/en/certificates.json';
import certificatesFr from './locales/fr/certificates.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: { ...careerpathEn, dashboard: dashboardEn, auth: authEn, catalog: catalogEn, opportunities: opportunitiesEn, detail: detailEn, certificates: certificatesEn },
      },
      fr: {
        translation: { ...careerpathFr, dashboard: dashboardFr, auth: authFr, catalog: catalogFr, opportunities: opportunitiesFr, detail: detailFr, certificates: certificatesFr },
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
