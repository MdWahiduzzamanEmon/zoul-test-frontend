import { I18n } from "i18n-js";
import * as RNLocalize from "react-native-localize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DefaultPreference from "react-native-default-preference";
// import RNRestart from "react-native-restart";

// Import your language files
import en from "./en.json";
import ar from "./ar.json";
import de from "./de.json";
import es from "./es.json";
import fr from "./fr.json";
import he from "./he.json";
import hi from "./hi.json";
import id from "./id.json";
import it from "./it.json";
import ja from "./ja.json";
import ko from "./ko.json";
import nl from "./nl.json";
import pt from "./pt.json";
import ru from "./ru.json";
import th from "./th.json";
import uk from "./uk.json";
import zh from "./zh.json";
import { I18nManager } from "react-native";

const APP_LANGUAGE = "@app_language";

const i18n = new I18n({
  en,
  ar,
  de,
  es,
  fr,
  he,
  hi,
  id,
  it,
  ja,
  ko,
  nl,
  pt,
  ru,
  th,
  uk,
  zh,
});

const loadLanguage = async () => {
  try {
    const fallback = { languageTag: "en", isRTL: false };

    const { languageTag } =
      RNLocalize.findBestLanguageTag(Object.keys(i18n.translations)) ||
      fallback;
    const storedLanguage = await AsyncStorage.getItem(APP_LANGUAGE);
    i18n.locale = storedLanguage || languageTag || "en";
    setLanguageLocally(i18n.locale);
  } catch (error) {
    console.error("error loadLanguage =--->", error);
  }
};

// Dynamically change the language
export const changeLanguage = async (lang) => {
  try {
    if (lang === "ar") {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      I18nManager.swapLeftAndRightInRTL(true);
    } else {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
      I18nManager.swapLeftAndRightInRTL(false);
    }
    i18n.locale = lang;
    await setLanguageLocally(lang);
  } catch (error) {
    console.error("error changeLanguage =--->", error);
  }
};

/* Get and set Language locally - Start */
export const setLanguageLocally = async (value = "") => {
  try {
    DefaultPreference.set("LANGUAGE", value);
    await AsyncStorage.setItem(APP_LANGUAGE, value);
  } catch (err) {
    console.log("");
  }
};

// Call loadLanguage once during app startup
loadLanguage();

export default i18n;
