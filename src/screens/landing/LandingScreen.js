import React from "react";
import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { perfectSize, scaleSize } from "../../styles/mixins";
import { LandingLogo } from "../../icons/landing/landing-logo";
import { colors, font } from "../../styles/theme";
import { Backgrounds } from "../../data/background";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useInAppBrowser } from "../../helpers/in-app-browser";
import { useRoute } from "@react-navigation/native";
import {
  PRIVACY_POLICY_URL,
  TERMS_AND_CONDITIONS_URL,
} from "../../utils/utils";

const LandingScreen = ({ navigation }) => {
  const { handleInAppBrowser } = useInAppBrowser();
  const { top, bottom } = useSafeAreaInsets();
  const route = useRoute();
  const { promoCodeData, isPromoRedeemable } = route.params;

  return (
    <ImageBackground
      source={Backgrounds.landingScreenBackground}
      style={[styles.background]}
    >
      <Block
        flex={1}
        width={"100%"}
        style={{
          paddingTop: top,
          paddingBottom: bottom,
        }}
      >
        <Block
          flex={1}
          padding={[0, perfectSize(20), 0, perfectSize(20)]}
          column
        >
          <Block flex={1} bottom center>
            <LandingLogo width={perfectSize(76)} height={perfectSize(59.16)} />
          </Block>

          <Block flex={false} marginTop={scaleSize(14.84)} center>
            <Text center size={scaleSize(28)} color={colors.white} medium>
              Welcome to Zoul
            </Text>
          </Block>
          <Block flex={false} bottom center>
            <Block
              flex={false}
              style={{ width: "100%" }}
              marginTop={scaleSize(33)}
              column
            >
              <TouchableOpacity
                onPress={async () => {
                  if (isPromoRedeemable) {
                    navigation.navigate("Register", {
                      promocode: promoCodeData,
                    });
                  } else {
                    navigation.navigate("Register");
                  }
                }}
                style={styles.createAccountButton}
              >
                <Text size={scaleSize(20)} medium color={colors.white}>
                  Create my free Zoul account
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate("Login")}
              >
                <Text size={scaleSize(18)} medium color={colors.white}>
                  I already have an account
                </Text>
              </TouchableOpacity>
            </Block>

            <Block
              flex={false}
              margin={[scaleSize(16), 0, scaleSize(45), 0]}
              center
            >
              <Text size={scaleSize(16)} color={colors.kPinkRose} regular>
                By proceeding to use Zoul, you agree to our
              </Text>
              <Text
                size={scaleSize(16)}
                color={colors.white}
                style={{ fontFamily: font.SemiBold }}
                onPress={() => handleInAppBrowser(TERMS_AND_CONDITIONS_URL)}
              >
                Terms & Conditions
                <Text size={scaleSize(16)} color={colors.kPinkRose} regular>
                  {` and `}
                </Text>
                <Text
                  size={scaleSize(16)}
                  color={colors.white}
                  style={{ fontFamily: font.SemiBold }}
                  onPress={() => handleInAppBrowser(PRIVACY_POLICY_URL)}
                >
                  Privacy Policy.
                </Text>
              </Text>
            </Block>
          </Block>
        </Block>
      </Block>
    </ImageBackground>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  createAccountButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mustardYellow,
    height: perfectSize(56),
    borderRadius: perfectSize(8),
    width: "100%",
  },
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    height: perfectSize(56),
    marginTop: scaleSize(12),
    borderRadius: perfectSize(8),
    width: "100%",
  },
  footerText: {
    width: "100%",
  },
});
