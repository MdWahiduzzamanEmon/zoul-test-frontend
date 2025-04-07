import { Dimensions, Platform } from "react-native";
import { responsiveScale } from "./mixins";

const white = "#FFFFFF";
const offWhite = "#e8e6e1";
const slateBlue = "#1E6CB6";
const black = "#000000";
const themeColor = "#00AB55";
const gainsboro = "#9da39f";
const darkgray = "#a9a9a9";
const tomato = "#DD5421";
const lightGrey = "#c0c0c0";
const lightPink = "#C5A0A5";
const kPinkRose = "#DFCBCD";
const darkRed = "#570018";
const blackDivider = "#FFFFFF33";
const darkRedText = "#6B0021";
const redcolor = "#6E0F1A";
const greenColor = "#086E49";
const lightblack = "#323232";
const transparent = "#FFFFFF1A";
const darktransparent = "#FFFFFF4D";
const colors = {
  primary: "#9ACD32",
  secondary: "#00CC79",
  darkRed: "#570018",
  cream: "#E6CDB9",
  black: "#222222",
  white: "#FFFFFF",
  darkblack: "#060203",
  lightblack: "#323232",
  gray: "#515151",
  blackDivider: "#FFFFFF33",
  darkRedText: "#6B0021",
  transparent: "#FFFFFF1A",
  darktransparent: "#FFFFFF4D",
  lightGreen: "#34C759",
  limeGreen: "#34A853",
  goldenOlive: "#A18E2D",
  mustardYellow: "#A08724",

  maroon: "#410202",
  logoColor: "#3D0000",
  // Heading Text colors
  slateBlue,
  mainHeadingTextColor: black,
  subHeadingTextColor: gainsboro,

  // Normal Text colors

  normalTextColor: black,
  validatonTextColor: tomato,
  buttonTextColor: white,

  // Boader colors

  borderDarkColor: darkgray,
  lightBorderColor: lightGrey,
  lightPinkBorderColor: lightPink,
  // Buttons

  largeButtonColor: themeColor,
  mediumButtonColor: "",
  smallButtonColor: "",
  greenColor: greenColor,
  redcolor: redcolor,

  // Screen Background colors

  viewBackgroundColor: white,
  logoTextColor: themeColor,
  loaderColor: white,
  textInputBackgroundColor: white,
  dashboardItemMainViewColor: offWhite,
  shadowColor: black,

  //Landing Screen Text colors
  landingTextColor: white,
  white: white,
  buttonBgColor: "#63001F",

  //Error Message
  kPinkRose: kPinkRose,
  playViewColor: darkRed,

  // letter section
  redWine: "#7B0323",
  sandBrown: "#C69C6D",
  vintageTan: "#A2845E",

  //Modal v2 Color
  blackCherry: "#4C0018",

  yellow: "#F8C866",
  marron: "#5D001D",
};
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
var tabHeight = deviceHeight * 0.08;
var categoriesSpacing = 10;
var screenHeight = deviceHeight - deviceHeight * 0.13;

const sizes = {
  // global sizes
  base: 16,
  font: 14,
  radius: 10,
  padding: 25,
  heading: 15,
  inputHeight: 30,
  // font sizes
  h1: responsiveScale(26),
  h2: responsiveScale(20),
  h3: responsiveScale(18),
  title: responsiveScale(17),
  header: responsiveScale(16),
  body: responsiveScale(14),
  caption: responsiveScale(12),
  small: responsiveScale(10),
};

var isIos = Platform.OS === "ios" ? true : false;

var font = {
  bold: "Inter-Bold",
  bold_italic: "Inter-BoldItalic",
  extra_bold_italic: "Inter-ExtraBoldItalic",
  extra_bold: "Inter-ExtraBold",
  extra_light: "Inter-ExtraLight",
  medium: "Inter-Medium",
  regular: "InterDisplay-Regular",
  SemiBold: "Inter-SemiBold",
  SemiBoldItalic: "Inter-SemiBoldItalic",
  light: "InterDisplay-Light",
  italic: "Inter-Italic",
  Playfair_Display_Italic: "PlayfairDisplay-Italic",
  optinoval: "OPTINaval",
  Playfair_Display_Medium: "PlayfairDisplay-Medium",
  Playfair_Display_Regular: "PlayfairDisplay-Regular",
  Caveat_Regular: "Caveat-Regular",
  Beyond_Infinity_Demo: "Beyond Infinity - Demo",
};

var mediumIcon = deviceWidth * 0.05;

var smallIcon = deviceWidth * 0.04;

var largeIcon = deviceWidth * 0.1;

const fonts = {
  h1: {
    fontSize: sizes.h1,
  },
  h2: {
    fontSize: sizes.h2,
  },
  h3: {
    fontSize: sizes.h3,
  },
  header: {
    fontSize: sizes.header,
  },
  heading: {
    fontSize: sizes.heading,
  },
  title: {
    fontSize: sizes.title,
  },
  body: {
    fontSize: sizes.body,
  },
  caption: {
    fontSize: sizes.caption,
  },
  small: {
    fontSize: sizes.small,
  },
};

export {
  colors,
  sizes,
  fonts,
  font,
  deviceWidth,
  deviceHeight,
  isIos,
  screenHeight,
  tabHeight,
  mediumIcon,
  smallIcon,
  largeIcon,
  categoriesSpacing,
};
