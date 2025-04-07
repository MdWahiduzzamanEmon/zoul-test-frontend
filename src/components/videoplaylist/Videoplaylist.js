import React from "react";
import {
  ImageBackground,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Block from "../utilities/Block";
import Text from "../utilities/Text";
import { perfectSize, responsiveScale } from "../../styles/mixins";
import { BlurView } from "@react-native-community/blur";
import PlayIcon from "../../assets/appImages/svgImages/PlayIcon";

const Videoplaylist = ({
  image,
  number,
  title,
  handlePlayPress = () => {},
}) => {
  return (
    <Block flex={false} style={styles.playlistContainer}>
      <ImageBackground
        source={image}
        resizeMode="stretch"
        style={styles.imageBackground}
      >
        <Text
          bold
          size={responsiveScale(40)}
          color={"#FFFFFF99"}
          style={styles.numberText}
        >
          {number}
        </Text>
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
          <PlayIcon />
        </TouchableOpacity>
        <Block flex={false} style={styles.infoContainer}>
          {Platform.OS === "ios" ? (
            <BlurView
              style={styles.absolute}
              blurType="light"
              blurAmount={1}
              reducedTransparencyFallbackColor="white"
            />
          ) : (
            // <Block style={[styles.absolute, styles.androidBlurBackground]} />
            <BlurView
              blurType="light"
              // blurAmount={4.43}
              blurRadius={5}
              overlayColor="transparent"
              style={styles.absolute}
            />
          )}
          <Text
            regular
            size={responsiveScale(15)}
            color={"white"}
            style={styles.titleText}
          >
            {title}
          </Text>
          <TouchableOpacity>
            <Text regular size={responsiveScale(14)} color={"white"} center>
              View All
            </Text>
          </TouchableOpacity>
        </Block>
      </ImageBackground>
    </Block>
  );
};

export default Videoplaylist;

const styles = StyleSheet.create({
  playlistContainer: {
    height: perfectSize(192),
    marginTop: perfectSize(20),
    borderRadius: perfectSize(10),
    overflow: "hidden",
  },
  imageBackground: {
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
    borderRadius: perfectSize(10),
    overflow: "hidden",
  },
  numberText: {
    marginLeft: perfectSize(15),
    marginTop: perfectSize(4),
  },
  playButton: {
    bottom: perfectSize(15),
    alignItems: "center",
  },
  infoContainer: {
    paddingHorizontal: perfectSize(12),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "30%",
  },
  titleText: {
    flex: 1,
  },
  absolute: {
    position: "absolute",
    top: perfectSize(0),
    left: perfectSize(0),
    bottom: perfectSize(0),
    right: perfectSize(0),
  },
  androidBlurBackground: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
});
