import React from "react";
import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { Backgrounds } from "../../data/background";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import Block from "../../components/utilities/Block";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackIcon } from "../../icons/back-icon/BackIcon";
import ZoulIcon from "../../assets/icons/zoul-icon.svg";
import Text from "../../components/utilities/Text";
import { colors } from "../../styles/theme";
import i18n from "../../translations/i18n";

const WhyZoul = ({ navigation }) => {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <ImageBackground source={Backgrounds.whyZoulBg} style={[styles.background]}>
      <Block
        flex={1}
        style={{
          paddingTop: top,
          paddingBottom: bottom,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <Block flex={1} margin={[scaleSize(20)]}>
          <Block flex={false} width={"10%"}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <BackIcon size={perfectSize(22)} />
            </TouchableOpacity>
          </Block>
          <Block flex={false} margin={[scaleSize(16), 0, 0, 0]}>
            <ZoulIcon />
          </Block>
          <Block flex={false}>
            <Block
              flex={false}
              margin={[scaleSize(16), 0, 0, 0]}
              row
              center
              gap={3}
            >
              <Block flex={false}>
                <Text
                  size={responsiveScale(28)}
                  weight={600}
                  regular
                  color={colors.white}
                >
                  Why Zoul?
                </Text>
              </Block>
            </Block>
          </Block>
          <Block flex={1} middle>
            <Block flex={false}>
              <Text
                size={responsiveScale(30)}
                regular
                weight={400}
                color={colors.white}
              >
                How do you stay positive and focused?
              </Text>
            </Block>
            <Block flex={false} margin={[scaleSize(28), 0, 0, 0]}>
              <Text
                size={responsiveScale(30)}
                regular
                weight={400}
                color={colors.white}
              >
                Will you let stress hold you back, or will you rise above?
              </Text>
            </Block>
            <Block flex={false} margin={[scaleSize(28), 0, 0, 0]}>
              <Text
                size={responsiveScale(36)}
                regular
                weight={700}
                color={colors.white}
              >
                Zoul
              </Text>
              <Text
                size={responsiveScale(30)}
                regular
                weight={400}
                color={colors.white}
              >
                Meditation | Sleep Aid | 24/7 Life Coach
              </Text>
            </Block>
          </Block>
          <Block flex={0.1} margin={[scaleSize(16), 0, 0, 0]}>
            <TouchableOpacity
              style={[
                styles.nextButton,
                {
                  backgroundColor: colors.buttonBgColor,
                },
              ]}
              onPress={() => navigation.navigate("WhyZoulTwo")}
            >
              <Text
                size={responsiveScale(14)}
                weight={500}
                regular
                color={colors.white}
              >
                {i18n.t("Next")}
              </Text>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
    </ImageBackground>
  );
};

export default WhyZoul;

const styles = StyleSheet.create({
  background: { flex: 1, alignContent: "center" },
  nextButton: {
    alignItems: "center",
    justifyContent: "center",
    height: perfectSize(50),
    borderRadius: perfectSize(8),
    width: "100%",
  },
  keyboard: {
    flex: 1,
  },
});
