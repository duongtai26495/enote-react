import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { EN, SELECTED_LANG, VI } from './utils/constants';

i18n
.use(Backend)
.use(LanguageDetector)
.use(initReactI18next)
.init({
    debug:true,
    fallbackLang: EN,
});
i18n.changeLanguage(localStorage.getItem("i18nextLng") ?? VI)
export default i18n;