import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import React, { memo } from "react";
import Block from "../utilities/Block";
import Text from "../utilities/Text";
import { perfectSize, scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import i18n from "../../translations/i18n";
import * as images from "../../assets/appImages/zodiac_banner/bannerImages";

const HoroscopeView = ({ user, onRead = () => {} }) => {
  return (
    <Block flex={false} style={styles.imageContainer}>
      <ImageBackground
        source={images[user?.zodiacSign ? user?.zodiacSign : "Libra"]}
        style={styles.imageBackground}
      >
        <Block flex={1} between padding={[perfectSize(14)]}>
          <Block flex={false}>
            <Text regular size={scaleSize(20)} color={colors.white}>
              {i18n.t("Horoscope")}
            </Text>
          </Block>
          <Block flex={1} marginTop={perfectSize(5)} style={{ width: "30%" }}>
            <Text regular size={scaleSize(14)} color={colors.white}>
              {i18n.t("How the stars affect your surroundings today")}
            </Text>
          </Block>
        </Block>
        <Block flex={false} row right>
          <TouchableOpacity onPress={onRead}>
            <Text
              regular
              size={scaleSize(18)}
              style={{
                paddingRight: perfectSize(14),
                paddingBottom: perfectSize(12),
              }}
              color={colors.white}
            >
              {i18n.t("Read Now")}
            </Text>
          </TouchableOpacity>
        </Block>
      </ImageBackground>
    </Block>
  );
};

export default memo(HoroscopeView);

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: perfectSize(36),
  },

  imageBackground: {
    width: "100%",
    aspectRatio: 16 / 8,

    overflow: "hidden",
  },
});
