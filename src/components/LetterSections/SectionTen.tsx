import React from "react";
import Block from "../utilities/Block";
import { perfectSize, scaleSize } from "../../styles/mixins";
import Text from "../utilities/Text";
import { colors, font } from "../../styles/theme";
import { generateLineHeight } from "../../utils/utils";
import { Image } from "react-native";
import { Backgrounds } from "../../data/background";
import i18n from "../../translations/i18n";

const SectionTen = () => {
  return (
    <Block>
      {/* TOP SECTION */}
      <Block flex={1} row between style={{ width: "100%" }}>
        {/* LEFT SIDE TEXT CONTAINER */}
        <Block flex={1}>
          <Block
            flex={false}
            marginTop={scaleSize(61)}
            padding={[0, perfectSize(16), 0, perfectSize(11)]}
          >
            <Text
              color={colors.sandBrown}
              regular
              center
              style={{ lineHeight: generateLineHeight(scaleSize(18), 145) }}
              size={scaleSize(18)}
            >
              {i18n.t("In those times when I needed a reminder that")}
            </Text>
          </Block>
          <Block
            marginTop={scaleSize(32)}
            flex={false}
            padding={[0, perfectSize(16), 0, perfectSize(6)]}
          >
            <Text
              size={scaleSize(33)}
              color={colors.white}
              style={{ fontFamily: font.Caveat_Regular }}
              regular
              center
            >
              {i18n.t("Everything will be OK")}
            </Text>
          </Block>
        </Block>

        {/* RIGHT SIDE IMAGE */}
        <Image
          style={{
            width: "49.0666%",
            aspectRatio: 736 / 1064,
          }}
          resizeMode="cover"
          source={Backgrounds.letterSection10}
        />
      </Block>
      {/* BOTTOM SECTION */}
      <Block>
        <Block
          flex={false}
          marginTop={scaleSize(35)}
          marginBottom={scaleSize(43)}
          padding={[0, perfectSize(12), 0, perfectSize(27)]}
        >
          <Text
            size={scaleSize(20)}
            color={colors.sandBrown}
            regular
            style={{
              lineHeight: generateLineHeight(scaleSize(20), 145),
            }}
          >
            <Text
              size={scaleSize(28)}
              color={colors.white}
              style={{
                fontFamily: font.Playfair_Display_Regular,
              }}
            >
              {i18n.t("Zoul's")}{" "}
            </Text>
            {i18n.t("Zouls personalized voice has helped me to be quiet")}
          </Text>
        </Block>
      </Block>
    </Block>
  );
};

export default SectionTen;

// 184 / 375 = 0.49066666666666664
