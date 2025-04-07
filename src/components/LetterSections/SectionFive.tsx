import React from "react";
import Block from "../utilities/Block";
import { Image } from "react-native";
import { Backgrounds } from "../../data/background";
import Text from "../utilities/Text";
import { perfectSize, scaleSize } from "../../styles/mixins";
import { colors, font } from "../../styles/theme";
import { generateLineHeight } from "../../utils/utils";
import i18n from "../../translations/i18n";

const SectionFive = () => {
  return (
    <Block>
      {/* TOP SECTION */}
      <Block flex={1} row between style={{ width: "100%" }}>
        {/* LEFT SIDE TEXT CONTAINER */}
        <Block
          flex={1}
          padding={[perfectSize(34), perfectSize(8), 0, perfectSize(18)]}
        >
          <Text
            color={colors.sandBrown}
            regular
            marginBottom={scaleSize(13)}
            size={scaleSize(20)}
          >
            {i18n.t("Even better")}
          </Text>
          <Text
            size={scaleSize(17)}
            color={colors.white}
            regular
            style={{ lineHeight: generateLineHeight(scaleSize(17), 145) }}
          >
            <Text
              size={scaleSize(24)}
              style={{ fontFamily: font.Playfair_Display_Regular }}
              color={colors.white}
            >
              {i18n.t("Zoul")}
            </Text>{" "}
            {i18n.t("Zoul has agreed to make sections of their app available")}
          </Text>
        </Block>

        {/* RIGHT SIDE IMAGE */}
        <Image
          style={{
            width: "48%",
            aspectRatio: 704 / 1404,
          }}
          resizeMode="cover"
          source={Backgrounds.latterSection5}
        />
      </Block>
      {/* BOTTOM SECTION */}
      <Block>
        <Block
          flex={false}
          marginTop={scaleSize(13)}
          padding={[0, perfectSize(16), 0, perfectSize(20)]}
        >
          <Text
            size={scaleSize(24)}
            color={colors.sandBrown}
            style={{
              fontFamily: font.Playfair_Display_Regular,
              lineHeight: generateLineHeight(scaleSize(24), 140),
            }}
          >
            <Text
              size={scaleSize(30)}
              color={colors.sandBrown}
              style={{
                fontFamily: font.Playfair_Display_Regular,
              }}
            >
            </Text>
            {i18n.t("Zoul will also donate a portion of your subscriptions to")}
          </Text>
        </Block>
        <Block
          flex={false}
          marginTop={scaleSize(10)}
          marginBottom={scaleSize(31)}
          padding={[0, perfectSize(31), 0, perfectSize(20)]}
        >
          <Text
            regular
            size={scaleSize(17)}
            style={{ lineHeight: generateLineHeight(scaleSize(17), 145) }}
            color={colors.white}
          >
           {i18n.t("Trust to support mental health and wellness")}
          </Text>
        </Block>
      </Block>
    </Block>
  );
};

export default SectionFive;

// 180 / 375 = 0.48
