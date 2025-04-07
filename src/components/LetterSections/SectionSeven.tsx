import React from "react";
import Block from "../utilities/Block";
import { perfectSize, scaleSize } from "../../styles/mixins";
import Text from "../utilities/Text";
import { colors, font } from "../../styles/theme";
import { generateLineHeight } from "../../utils/utils";
import { Image } from "react-native";
import { Backgrounds } from "../../data/background";
import i18n from "../../translations/i18n";

const SectionSeven = () => {
  return (
    <Block flex={1} row between style={{ width: "100%" }}>
      {/* LEFT SIDE TEXT CONTAINER */}
      <Image
        style={{
          width: "45.333%",
          aspectRatio: 680 / 856,
        }}
        resizeMode="cover"
        source={Backgrounds.latterSection7}
      />

      {/* RIGHT SIDE IMAGE */}
      <Block
        flex={1}
        marginTop={scaleSize(26)}
        padding={[0, perfectSize(12), 0, perfectSize(15)]}
      >
        <Text
          color={colors.sandBrown}
          style={{
            fontFamily: font.Playfair_Display_Regular,
          }}
          size={scaleSize(25)}
        >
          {i18n.t("Im excited for 2025")}
        </Text>
        <Text
          size={scaleSize(18)}
          color={colors.sandBrown}
          regular
          style={{ lineHeight: generateLineHeight(scaleSize(18), 145) }}
          marginTop={scaleSize(14)}
        >
          {i18n.t(
            "There will be challenges, and moments of struggle, for all of us"
          )}
        </Text>
      </Block>
    </Block>
  );
};

export default SectionSeven;
