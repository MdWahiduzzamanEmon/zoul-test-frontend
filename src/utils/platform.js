import { Dimensions, Platform } from "react-native";

export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";

export const forPlatform = ({ ios, android }) => {
  return isIOS ? ios : android;
};

// export const screenWidth = Dimensions.get("screen").width;
// export const screenHeight = isIOS
//   ? Dimensions.get("screen").height
//   : Dimensions.get("screen").height - 58;
