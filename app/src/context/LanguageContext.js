import React, { createContext, useEffect, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(i18n.locale);

  useEffect(() => {
    AsyncStorage.getItem('appLanguage').then((saved) => {
      if (saved && saved !== i18n.locale) {
        i18n.locale = saved;
        setLocale(saved);
      }
    });
  }, []);

  const changeLanguage = (lang) => {
    i18n.locale = lang;
    setLocale(lang);
    AsyncStorage.setItem('appLanguage', lang).catch(() => {});
  };

  const t = (key, options) => {
    return i18n.t(key, options);
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
