import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { badgeEn } from './badge-en';
import { es } from './es';

const i18n = createInstance();

// The app ships in Spanish only for now; badge copy is a separate namespace that stays English.
i18n.use(initReactI18next).init({
  lng: 'es',
  fallbackLng: 'es',
  ns: ['app', 'badge'],
  defaultNS: 'app',
  resources: {
    es: { app: es, badge: badgeEn },
  },
  interpolation: { escapeValue: false },
  initAsync: false,
});

export default i18n;
