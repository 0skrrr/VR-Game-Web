import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './langs/en.json';
import cz from './langs/cz.json';
import hr from './langs/hr.json';
import sq from './langs/sq.json';
import tr from './langs/tr.json';
import pt from './langs/pt.json';
import sk from './langs/sk.json';

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        cz: { translation: cz },
        hr: { translation: hr },
        sq: { translation: sq },
        tr: { translation: tr },
        pt: { translation: pt },
        sk: { translation: sk },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
});

export default i18n;