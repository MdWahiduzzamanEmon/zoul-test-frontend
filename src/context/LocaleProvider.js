// LocaleContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import i18n, { changeLanguage } from "../translations/i18n"; // Adjust the import path as needed

const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(null);

  const changeLocale = (newLocale) => {
    try {
      changeLanguage(newLocale); // Adjust the function call as needed
      i18n.locale = newLocale;
      setLocale(newLocale);
    } catch (error) {
      console.error("error changeLocale =--->", error);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
