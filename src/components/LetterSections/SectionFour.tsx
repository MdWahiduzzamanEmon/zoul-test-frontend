import React from "react";
import Block from "../utilities/Block";
import { Image, ImageBackground, StyleSheet } from "react-native";
import { Backgrounds } from "../../data/background";
import { perfectSize, scaleSize } from "../../styles/mixins";
import Text from "../utilities/Text";
import { generateLineHeight } from "../../utils/utils";
import { colors, font } from "../../styles/theme";
import i18n from "../../translations/i18n";
import { useSelector } from "react-redux";

export const SectionFour = () => {
  const selectedLanguage = useSelector(
    (state) => state?.language.selectedLanguage
  );

  return (
    <ImageBackground
      source={Backgrounds.letterSectionBackground4}
      style={{
        width: "100%",
      }}
    >
      <Block flex={false}>
        <Block flex={1} row between>
          <Image
            resizeMode="cover"
            style={styles.imageStyle}
            source={Backgrounds.letterSection4}
          />
          <Block flex={1}>
            <Block
              flex={false}
              marginTop={perfectSize(23)}
              padding={[0, perfectSize(12), 0, perfectSize(15)]}
            >
              <Text
                size={scaleSize(20)}
                style={{
                  lineHeight: generateLineHeight(scaleSize(20), 130),
                }}
                medium
                weight={500}
                color={colors.darkRed}
              >
                {i18n.t("​This year")}
              </Text>
            </Block>
            <Block
              flex={false}
              margin={[
                perfectSize(0),
                perfectSize(8),
                perfectSize(24),
                perfectSize(20),
              ]}
            >
              <Text
                size={scaleSize(18)}
                regular
                style={{
                  paddingTop: perfectSize(5),
                  lineHeight: generateLineHeight(scaleSize(18), 150),
                }}
                color={colors.darkRed}
              >
                {i18n.t("Ive also decided to seek")}
              </Text>
            </Block>
          </Block>
        </Block>
        <Block
          marginTop={perfectSize(26)}
          padding={[0, perfectSize(12), 0, perfectSize(27)]}
        >
          <Text
            size={scaleSize(18)}
            style={{
              lineHeight: generateLineHeight(scaleSize(18), 145),
            }}
            regular
            color={colors.darkRed}
          >
            {i18n.t("Thats why Im partnering with Zoul")}
          </Text>
        </Block>
        <Block
          flex={false}
          margin={[
            perfectSize(15),
            perfectSize(5),
            perfectSize(53),
            perfectSize(28),
          ]}
          row
          center
        >
          <Block flex={false} marginTop={perfectSize(-20)}>
            <Text
              size={scaleSize(32)}
              style={{
                fontFamily: font.Playfair_Display_Regular,
              }}
              color={colors.darkRed}
            >
              {i18n.t("Zoul")},{" "}
            </Text>
          </Block>
          <Block flex={false}>
            <Text
              size={scaleSize(31)}
              style={{
                fontFamily: font.Caveat_Regular,
                paddingTop: perfectSize(10),
                lineHeight: generateLineHeight(scaleSize(31), 100),
              }}
              color={colors.darkRed}
              width={selectedLanguage === "en" ? 250 : 270}
            >
              {i18n.t("the meditation, sleep and wellness app")}
            </Text>
          </Block>
        </Block>
      </Block>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: "46%",
    aspectRatio: 692 / 1020,
    top: perfectSize(-20),
  },
});
