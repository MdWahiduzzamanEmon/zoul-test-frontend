import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppleIcon from "../../assets/icons/apple-icon.svg";
import GoogleIcon from "../../assets/icons/google-icon.svg";
import FacebookIcon from "../../assets/icons/facebook-icon.svg";
import { isAndroid, isIOS } from "../../utils/platform";

const Icon = ({ id, showFbLoginIos }) => {
  switch (id) {
    case "apple":
      return <AppleIcon />;
    case "google":
      return <GoogleIcon />;
    case "facebook":
      // Show Facebook icon only if `showFbLoginIos` is true on iOS
      return isIOS && !showFbLoginIos ? null : <FacebookIcon />;
    default:
      return null;
  }
};
export const SocialButton = ({ onPress, id, configValue }) => {
  const showFbLoginIos = configValue?.showFbLoginIos;
  const showGoogleLoginIos = configValue?.showGoogleLoginIos;
  const showAppleLogin = configValue?.showAppleLoginIos;
  if (isIOS) {
    // Hide Facebook button on iOS if `showFbLoginIos` is false
    if (id === "facebook" && !showFbLoginIos) return null;
    if (id === "google" && !showGoogleLoginIos) return null;
    if (id === "apple" && !showAppleLogin) return null;

    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <View style={styles.card}>
          <View style={[styles.icon, id === "apple" && { paddingLeft: 3 }]}>
            <Icon id={id} showFbLoginIos={showFbLoginIos} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Handle Android
  if (isAndroid && id !== "apple") {
    const showFbLoginAndroid = configValue?.showFbLoginAndroid;
    const showGoogleLogin = configValue?.showGoogleLoginAndroid;
    if (id === "facebook" && !showFbLoginAndroid) return null;
    if (id === "google" && !showGoogleLogin) return null;
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <View style={styles.card}>
          <View style={[styles.icon, id === "apple" && { paddingLeft: 3 }]}>
            <Icon id={id} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  card: {
    width: 64,
    height: 64,
    backgroundColor: "rgba(255, 255, 255, 0.11)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
});
