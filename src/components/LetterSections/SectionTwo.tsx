import React from "react";
import Block from "../utilities/Block";
import Text from "../utilities/Text";
import { perfectSize, scaleSize } from "../../styles/mixins";
import { Image, ImageBackground, StyleSheet } from "react-native";
import { Backgrounds } from "../../data/background";
import { colors, font } from "../../styles/theme";
import { generateLineHeight } from "../../utils/utils";
import i18n from "../../translations/i18n";

const SectionTwo = () => {
  // const width = Dimensions.get("window").width;
  // const IMAGE_ASPECT_RATIO = 1500 / 3256;
  // const calculatedHeight = width / IMAGE_ASPECT_RATIO;
  return (
    <ImageBackground
      source={Backgrounds.letterSectionBackground2}
      style={{
        width: "100%",
      }}
    >
      <Block flex={false}>
        <Block flex={false} row between>
          <Image
            resizeMode="cover"
            style={styles.imageStyle}
            source={Backgrounds.letterSection2}
          />
          <Block flex={1}>
            <Block
              flex={false}
              margin={[perfectSize(30), 0, 0, perfectSize(14)]}
              padding={[0, perfectSize(12), 0, perfectSize(1)]}
            >
              <Text
                size={scaleSize(20)}
                style={{
                  lineHeight: generateLineHeight(scaleSize(20), 130),
                }}
                color={colors.darkRed}
                weight={500}
              >
                {i18n.t("In my life")}
              </Text>
            </Block>
            <Block
              flex={false}
              marginBottom={perfectSize(25)}
              padding={[0, perfectSize(12), 0, perfectSize(14)]}
            >
              <Text
                size={scaleSize(16)}
                regular
                style={{
                  lineHeight: generateLineHeight(scaleSize(16), 145),
                  paddingTop: perfectSize(4),
                }}
                color={colors.darkRed}
              >
                {i18n.t("I was diagnosed with skin cancer and breast cancer")}
              </Text>
            </Block>
          </Block>
        </Block>
        <Block flex={false} row between>
          <Block flex={1}>
            <Block
              flex={false}
              marginTop={perfectSize(43)}
              marginBottom={perfectSize(15)}
              padding={[0, perfectSize(12), 0, perfectSize(19)]}
            >
              <Text
                size={scaleSize(16)}
                regular
                style={{
                  lineHeight: generateLineHeight(scaleSize(16), 145),
                  paddingTop: perfectSize(9),
                }}
                color={colors.darkRed}
              >
                {i18n.t("​I am not out of the woods")}
              </Text>
            </Block>
          </Block>
          <Image
            resizeMode="cover"
            style={styles.imageStyle2}
            source={Backgrounds.letterSection2_1}
          />
        </Block>
        <Block
          flex={false}
          marginTop={perfectSize(34)}
          padding={[0, perfectSize(20), 0, perfectSize(20)]}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: font.Caveat_Regular,
              paddingTop: perfectSize(10),
              lineHeight: generateLineHeight(scaleSize(33), 120),
            }}
            size={scaleSize(33)}
            color={colors.darkRed}
          >
            {i18n.t("Im not ashamed")}
          </Text>
        </Block>
        <Block
          flex={false}
          marginTop={perfectSize(34)}
          paddingBottom={perfectSize(46)}
          padding={[0, perfectSize(14), 0, perfectSize(14)]}
        >
          <Text
            style={{
              lineHeight: generateLineHeight(scaleSize(16), 130),
              textAlign: "center",
            }}
            regular
            size={scaleSize(16)}
            color={colors.darkRed}
          >
            {i18n.t("But Im finding my way")}
          </Text>
        </Block>
      </Block>
    </ImageBackground>
  );
};

export default SectionTwo;

const styles = StyleSheet.create({
  imageStyle: {
    width: "47%",
    aspectRatio: 712 / 1256,
  },
  imageStyle2: {
    width: "52%",
    aspectRatio: 784 / 1136,
  },
});
