import React, { memo, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import Block from "../utilities/Block";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors, deviceWidth, font } from "../../styles/theme";
import FastImage from "react-native-fast-image";
import { getTransformedUrl } from "../../utils/ImageService";
import PremiumFrame from "../../assets/appImages/svgImages/PremiumFrame.svg";
import { useSelector } from "react-redux";

const SuggestYourPlan = ({
  image,
  title,
  onPress = () => {},
  isTimeDisplay = true,
  duration,
  stylesProps,
  mainContainer,
  isPremiumAudio = false,
}) => {
  const {
    widthRatio = 0.44,
    heightRatio,
    textTitleSize = 15,
    titleTextLines = 2,
    imageBorderRadius = 4,
  } = stylesProps || {};
  const width = deviceWidth * widthRatio;
  const height = heightRatio ? width / heightRatio : deviceWidth * 0.3;
  const borderRadius = imageBorderRadius;

  const isUserSubscribed = useSelector(
    (state) => state?.subscription?.isUserSubscribed
  );

  const imageUri =
    typeof image == "string" && image?.length > 0
      ? { uri: getTransformedUrl(image) }
      : require("../../assets/appImages/Logo.png");

  useEffect(() => {
    if (typeof image === "string" && image?.length > 0) {
      FastImage.preload([{ uri: image }]);
    }
  }, [image]);

  return (
    <TouchableOpacity
      style={[styles.imageContainer, mainContainer]}
      onPress={() => onPress()}
    >
      <Block flex={false}>
        {isPremiumAudio && !isUserSubscribed && (
          <Block
            flex={false}
            style={{ position: "absolute", zIndex: 1, right: 0 }}
          >
            <PremiumFrame />
          </Block>
        )}
        <Block flex={false}>
          <Image
            source={imageUri}
            style={{
              height,
              width,
              borderRadius,
              // borderWidth:1, borderColor:'white'
            }}
          />
          {/* <FastImage
            style={{
              height,
              width,
              borderRadius,
            }}
            source={imageUri}
          /> */}
          {isTimeDisplay && (
            <Text style={[styles.timeText, { right: perfectSize(7) }]}>
              {duration}
            </Text>
          )}
        </Block>
      </Block>
      <Block flex={1} style={{ width }}>
        <Text
          style={[
            styles.titleText,
            { fontSize: responsiveScale(textTitleSize) },
          ]}
          numberOfLines={titleTextLines}
        >
          {title}
        </Text>
      </Block>
    </TouchableOpacity>
  );
};

export default memo(SuggestYourPlan);

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
  },
  timeText: {
    position: "absolute",
    bottom: perfectSize(5),
    color: colors.white,
    fontFamily: font.regular,
    fontSize: scaleSize(14),
    fontWeight: "400",
  },
  titleText: {
    marginTop: scaleSize(6),
    overflow: "hidden",
    color: colors.white,
    fontFamily: font.regular,
    fontWeight: "400",
  },
});
