import React from "react";
import Block from "../utilities/Block";
import { perfectSize, scaleSize } from "../../styles/mixins";
import Text from "../utilities/Text";
import { colors, font } from "../../styles/theme";
import { generateLineHeight } from "../../utils/utils";
import { Image, StyleSheet } from "react-native";
import { Backgrounds } from "../../data/background";
import i18n from "../../translations/i18n";

const SectionThree = () => {
  return (
    <Block flex={1}>
      <Block flex={false}>
        <Block flex={1} row between>
          <Block
            flex={1}
            marginTop={perfectSize(15)}
            padding={[0, perfectSize(10), 0, perfectSize(15)]}
          >
            <Text
              size={scaleSize(20)}
              style={{
                paddingTop: perfectSize(5),
                lineHeight: generateLineHeight(scaleSize(16), 150),
              }}
              regular
              color={colors.sandBrown}
            >
              {i18n.t("Sometimes")}{" "}
              <Text size={scaleSize(16)} regular color={colors.sandBrown}>
                {i18n.t("we are overwhelmed by loneliness or sleeplessness")}
              </Text>
            </Text>
            <Text
              size={scaleSize(16)}
              style={{
                paddingTop: perfectSize(20),
                lineHeight: generateLineHeight(scaleSize(16), 150),
              }}
              regular
              color={colors.sandBrown}
            >
              {i18n.t("We struggle with our thoughts")}
            </Text>
          </Block>
          <Image
            resizeMode="cover"
            style={styles.imageStyle1}
            source={Backgrounds.letterSection3}
          />
        </Block>
        <Block flex={1} row between>
          <Image
            resizeMode="cover"
            style={styles.imageStyle2}
            source={Backgrounds.letterSection3_1}
          />
          <Block
            flex={1}
            marginTop={perfectSize(28)}
            padding={[0, perfectSize(12), 0, perfectSize(22)]}
          >
            <Text
              size={scaleSize(16)}
              style={{
                paddingTop: perfectSize(5),
                lineHeight: generateLineHeight(scaleSize(16), 145),
              }}
              regular
              color={colors.sandBrown}
            >
              {i18n.t("I relate to all of these at times")}
            </Text>
            <Text
              size={scaleSize(16)}
              style={{
                paddingTop: perfectSize(20),
                lineHeight: generateLineHeight(scaleSize(16), 150),
              }}
              regular
              color={colors.sandBrown}
            >
              {i18n.t("And yet I feel so lucky")}
            </Text>
          </Block>
        </Block>
        <Block
          marginTop={perfectSize(36)}
          padding={[0, perfectSize(13), 0, perfectSize(8)]}
        >
          <Text
            size={scaleSize(16)}
            style={{
              textAlign: "center",
              paddingTop: perfectSize(5),
              lineHeight: generateLineHeight(scaleSize(16), 145),
            }}
            regular
            color={colors.sandBrown}
          >
            {i18n.t("I try to use whatever platform")}
          </Text>
        </Block>
        <Block
          padding={[0, perfectSize(5), 0, perfectSize(5)]}
          marginTop={perfectSize(44)}
          marginBottom={perfectSize(55)}
        >
          <Text
            size={scaleSize(30)}
            style={{
              textAlign: "center",
              lineHeight: generateLineHeight(scaleSize(30), 95),
              paddingTop: perfectSize(10),
              fontFamily: font.Caveat_Regular,
            }}
            regular
            color={colors.white}
          >
            {i18n.t("​When you feel bad about yourself")}
          </Text>
        </Block>
      </Block>
    </Block>
  );
};

export default SectionThree;

const styles = StyleSheet.create({
  imageStyle1: {
    width: "49.86%",
    aspectRatio: 744 / 1248,
  },
  imageStyle2: {
    width: "49.86%",
    aspectRatio: 748 / 1099,
  },
});
