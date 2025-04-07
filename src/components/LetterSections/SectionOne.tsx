import React from "react";
import Block from "../utilities/Block";
import Text from "../utilities/Text";
import { colors, font } from "../../styles/theme";
import { Image, StyleSheet, View } from "react-native";
import { Backgrounds } from "../../data/background";
import { perfectSize, scaleSize } from "../../styles/mixins";
import { generateLineHeight } from "../../utils/utils";
import i18n from "../../translations/i18n";
import { useSelector } from "react-redux";

const SectionOne = () => {
  const selectedLanguage = useSelector(
    (state) => state?.language.selectedLanguage
  );

  return (
    <Block flex={1} row between>
      <Block
        flex={1}
        column
        padding={[
          perfectSize(0),
          perfectSize(19),
          perfectSize(0),
          perfectSize(10),
        ]}
      >
        <Text
          size={scaleSize(35)}
          style={{
            fontFamily: font.optinoval,
            lineHeight: generateLineHeight(scaleSize(35), 130),
          }}
          color={colors.sandBrown}
        >
          {i18n.t("Dear all")}
        </Text>
        <Block
          flex={false}
          padding={[perfectSize(3), perfectSize(4), 0, perfectSize(6)]}
        >
          <Text
            size={scaleSize(15)}
            style={{
              lineHeight: generateLineHeight(scaleSize(15), 150),
              letterSpacing: 0.5,
            }}
            regular
            color={colors.white}
          >
            {i18n.t("I hope this message finds you well")}
          </Text>
        </Block>
      </Block>
      {/* Image container with bottom overlay */}
      <View style={styles.imageContainer}>
        <Image
          resizeMode="cover"
          style={styles.imageStyle}
          source={Backgrounds.letterSection1}
        />
        <View style={styles.bottomOverlay} />
        <Text style={styles.textTop}>{i18n.t("Duchess’s")}</Text>
        <Text
          style={[
            styles.textBottom,
            {
              bottom: perfectSize(selectedLanguage === "en" ? -14 : -6), // Dynamic adjustment
            },
          ]}
        >
          {i18n.t("letter")}
        </Text>
      </View>
    </Block>
  );
};

export default SectionOne;

const styles = StyleSheet.create({
  imageStyle: {
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    width: "60%",
    aspectRatio: 1132 / 1444,
    marginTop: perfectSize(10),
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    height: "35%", // Covers the bottom 35%
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Black with 50% opacity
  },
  textContainer: {
    position: "absolute",
    bottom: perfectSize(-8), // Position container near the bottom
    right: "7%", // Align container to the right
  },
  textTop: {
    position: "absolute",
    bottom: "16%", // Adjust to center text inside the overlay
    right: "9%", // Align text to the right
    color: colors.white,
    fontSize: scaleSize(42),
    fontFamily: font.optinoval,
    textAlign: "right",
  },
  textBottom: {
    position: "absolute",
    right: "8%",
    color: colors.white,
    fontSize: scaleSize(73),
    fontFamily: font.Beyond_Infinity_Demo,
    textAlign: "right",
  },
});
