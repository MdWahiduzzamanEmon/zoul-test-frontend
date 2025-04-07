import React from "react";
import { StyleSheet } from "react-native";
import Block from "../utilities/Block";
import { colors } from "../../styles/theme";
import LottieView from "lottie-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Loader = () => {
  const { top } = useSafeAreaInsets();

  return (
    <Block flex={1} style={styles.container}>
      <LottieView
        source={require("../../assets/animations/zoul_loading_animation.json")}
        autoPlay
        loop
        style={styles.animation}
        speed={1.2}
      />
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.darkRedText,
  },
  animation: {
    width: "80%",
    height: "80%",
    marginTop: "10%",
  },
});

export default Loader;
