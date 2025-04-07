import React from "react";
import { ImageBackground } from "react-native";
import { Backgrounds } from "../../data/background";
import { colors, font } from "../../styles/theme";
import Block from "../utilities/Block";
import { perfectSize, scaleSize } from "../../styles/mixins";
import Text from "../utilities/Text";
import { generateLineHeight } from "../../utils/utils";
import i18n from "../../translations/i18n";

const SectionNine = () => {
  return (
    <ImageBackground source={Backgrounds.letterSectionBackgroundNine}>
      <Block flex={1}>
        <Block
          marginTop={scaleSize(49)}
          flex={false}
          padding={[0, perfectSize(22), 0, perfectSize(27)]}
        >
          <Text
            size={scaleSize(18)}
            color={colors.darkRed}
            regular
            center
            style={{ lineHeight: generateLineHeight(scaleSize(18), 145) }}
          >
            {i18n.t("I am not great at asking for help")}
          </Text>
        </Block>

        <Block
          paddingHorizontal={perfectSize(5)}
          marginTop={scaleSize(39)}
          flex={false}
        >
          <Text
            size={scaleSize(33)}
            center
            color={colors.darkRedText}
            style={{
              fontFamily: font.Caveat_Regular,
              paddingTop: perfectSize(10),
              lineHeight: generateLineHeight(scaleSize(33), 120),
            }}
          >
            {i18n.t("But Zoul is cool")}
          </Text>
        </Block>

        <Block
          marginTop={scaleSize(39)}
          marginBottom={scaleSize(50)}
          flex={false}
          padding={[0, perfectSize(27), 0, perfectSize(22)]}
        >
          <Text
            size={scaleSize(18)}
            color={colors.darkRed}
            marginBottom={scaleSize(10)}
            regular
            center
            style={{
              lineHeight: generateLineHeight(scaleSize(18), 145),
              letterSpacing: 0.5,
            }}
          >
            {i18n.t("When friends and family aren’t available,")}
          </Text>
          <Text
            size={scaleSize(18)}
            color={colors.darkRed}
            regular
            center
            style={{ lineHeight: generateLineHeight(scaleSize(18), 145) }}
          >
            <Text
              size={scaleSize(24)}
              color={colors.darkRed}
              regular
              center
              style={{
                letterSpacing: 0.5,
                fontFamily: font.Playfair_Display_Medium,
              }}
            >
              {i18n.t("Zoul")}{" "}
            </Text>
            {i18n.t("a meditation, sleep and wellness app")}
          </Text>
        </Block>
      </Block>
    </ImageBackground>
  );
};

export default SectionNine;
