import React from "react";
import Block from "../utilities/Block";
import { perfectSize, scaleSize } from "../../styles/mixins";
import Text from "../utilities/Text";
import { colors, font } from "../../styles/theme";
import { generateLineHeight } from "../../utils/utils";
import { Image, ImageBackground } from "react-native";
import { Backgrounds } from "../../data/background";
import { Dimensions } from "react-native";
import i18n from "../../translations/i18n";

const SectionSix = () => {
  const { width: deviceWidth } = Dimensions.get("window");
  const IMAGE_ASPECT_RATIO = 1500 / 1052; // Adjust aspect ratio based on your image (width/height)
  const calculatedHeight = deviceWidth / IMAGE_ASPECT_RATIO;
  return (
    <Block flex={false} style={{ width: "100%" }} column>
      {/* TOP IMAGE SECTION  */}

      <Image
        style={{
          width: "100%",
          height: calculatedHeight,
        }}
        resizeMode="cover"
        source={Backgrounds.latterSection6}
      />

      {/* BOTTOM TEXT SECTION */}
      <ImageBackground
        source={Backgrounds.letterSectionBackground}
        style={{ backgroundColor: colors.cream }}
      >
        <Block flex={1} zIndex={0}>
          <Block
            marginTop={scaleSize(43)}
            flex={false}
            padding={[0, perfectSize(23), 0, perfectSize(20)]}
          >
            <Text
              size={scaleSize(31)}
              center
              color={colors.darkRedText}
              style={{
                lineHeight: generateLineHeight(scaleSize(31), 130),
                fontFamily: font.Caveat_Regular,
              }}
            >
              {i18n.t("No matter where you are")}
            </Text>
          </Block>
          <Block
            marginTop={scaleSize(41)}
            flex={false}
            padding={[0, perfectSize(27), 0, perfectSize(24)]}
          >
            <Text
              size={scaleSize(18)}
              color={colors.darkRed}
              regular
              center
              style={{ lineHeight: generateLineHeight(scaleSize(18), 130) }}
            >
              {i18n.t("or what you are facing, know this")}
            </Text>
          </Block>

          <Block
            marginTop={scaleSize(29)}
            flex={false}
            padding={[0, perfectSize(5), perfectSize(54), perfectSize(5)]}
          >
            <Text
              size={scaleSize(30)}
              color={colors.darkRed}
              center
              style={{
                paddingTop: perfectSize(10),
                lineHeight: generateLineHeight(scaleSize(30), 120),
                fontFamily: font.Caveat_Regular,
              }}
            >
              {i18n.t(
                "Let us hold faith in knowing that we can overcome anything"
              )}
            </Text>
          </Block>
        </Block>
      </ImageBackground>
    </Block>
  );
};

export default SectionSix;
