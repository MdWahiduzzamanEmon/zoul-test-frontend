import { envConfig } from "../config/config";
import en from "../translations/en.json";
import { slides } from "../screens/testimonial/TestimonialData";

export const TERMS_AND_CONDITIONS_URL = envConfig.TERMS_AND_CONDITIONS_URL;
export const PRIVACY_POLICY_URL = envConfig.PRIVACY_POLICY_URL;
export const supportWhatsAppNumber = envConfig.CUSTOMER_SUPPORT_WHATSAPP_NUMBER;

export const zoulIntroSlides = slides.slice(
  slides.findIndex((slide) => slide.sectionType === "zoulIntro"),
  slides.findLastIndex((slide) => slide.sectionType === "zoulIntro") + 1
);

export const testimonialSlides = slides.slice(
  slides.findIndex((slide) => slide.sectionType === "testimonial"),
  slides.findLastIndex((slide) => slide.sectionType === "testimonial") + 1
);
export const whoWeAreSlides = slides.slice(
  slides.findIndex((slide) => slide.sectionType === "zoulIntro")+2,
  slides.findLastIndex((slide) => slide.sectionType === "zoulIntro") + 1
);

type colors =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "orange"
  | "pink"
  | "lime"
  | "teal"
  | "purple"
  | "gold"
  | "aqua";

export const LOG = (message: any, color: colors) => {
  const colors = {
    black: "\x1b[30m", // Standard black
    red: "\x1b[31m", // Standard red
    green: "\x1b[32m", // Standard green
    yellow: "\x1b[33m", // Standard yellow
    blue: "\x1b[34m", // Standard blue
    magenta: "\x1b[35m", // Standard magenta
    cyan: "\x1b[36m", // Standard cyan
    white: "\x1b[37m", // Standard white
    orange: "\x1b[38;5;202m", // Orange from 256-color palette
    pink: "\x1b[38;5;206m", // Pink from 256-color palette
    lime: "\x1b[38;5;154m", // Lime green from 256-color palette
    teal: "\x1b[38;5;37m", // Teal from 256-color palette
    purple: "\x1b[38;5;93m", // Purple from 256-color palette
    gold: "\x1b[38;5;220m", // Gold from 256-color palette
    aqua: "\x1b[38;5;51m", // Aqua from 256-color palette
  };

  const chosenColor = colors[color] || colors.white;
  const timestamp = new Date().toISOString();

  // Print the full colorful message
  console.log(
    `${chosenColor}[${timestamp}] - ${
      typeof message === "object" ? JSON.stringify(message) : String(message)
    }`
  );
};

export const generateWhatsAppLink = ({
  name,
  email,
  appVersion,
}: {
  name?: string;
  email?: string;
  appVersion: string;
}) => {
  return `https://wa.me/${supportWhatsAppNumber}?text=Hello, my name is ${
    name || ""
  }, and my email address is ${
    email || ""
  }. I am currently using the app version ${appVersion || ""}.`;
};

export const SCREEN_NAMES = {
  VS_Home: "Home_Screen",
  VS_Speaker_Home: "Speaker_Home_Screen",
  VS_Viewer_Home: "Viewer_Home_Screen",
  VS_Meeting: "Meeting_Screen",
};

export const generateLineHeight = (
  fontSize: number,
  lineHeightPercentage: number
) => fontSize * (lineHeightPercentage / 100);

export const translateToEnglish = (key: string) => {
  const translation: string = en[key];
  return translation || `[missing [${key}] translation`;
};

export const removeItem = (array: [], id: string, isUserSubscribed = false) => {
  if (!array || array.length === 0) return array;

  if (!isUserSubscribed) {
    // Create a new array excluding the item with the matching ID
    const updatedArray = array.filter((item) => item.id !== id);

    return updatedArray;
  }

  return array;
};
