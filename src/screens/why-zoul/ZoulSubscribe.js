import React, { useEffect, useState } from "react";
import { ImageBackground, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Backgrounds } from "../../data/background";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import Block from "../../components/utilities/Block";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ZoulIcon from "../../assets/icons/zoul-icon.svg";
import Text from "../../components/utilities/Text";
import { colors } from "../../styles/theme";
import DeviceInfo from "react-native-device-info";
import useDynamicLinkHandler from "../../hooks/useDynamicLinkHandler";
import firestore from "@react-native-firebase/firestore";
import { SUB_TEXTS } from "../../constants/zoulSubscribeConstant";

const ZoulSubscribe = ({ navigation }) => {
  const { top, bottom } = useSafeAreaInsets();

  const [isInReview, setIsInReview] = useState(false);

  useEffect(() => {
    const docRef = firestore()
      .collection("appsettings")
      .doc(DeviceInfo.getVersion()?.toString());

    const unsubscribe = docRef.onSnapshot((snapShot) => {
      if (snapShot.exists && snapShot.data()) {
        setIsInReview(snapShot?.data()?.isInReview);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const checkIsEmulator = () => {
    try {
      DeviceInfo.isEmulator().then((isEmulator) => {
        if (isEmulator) {
          navigation.navigate("Register");
        } else {
          if (isVerifiedPromo && isPromoRedeemable) {
            navigation.navigate("Register", { promocode: promoCodeData });
            return;
          }
          if (isInReview && Platform.OS === "android") {
            navigation.navigate("Register");
            return;
          }
          navigation.navigate("subscribe");
        }
      });
    } catch (error) {
      console.error("error checkIsEmulator =--->", error);
    }
  };

  return (
    <ImageBackground
      source={Backgrounds.zoulSubscribeBg}
      style={[styles.background]}
    >
      <Block
        flex={1}
        style={{
          paddingTop: top,
          paddingBottom: bottom,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <Block
          flex={1}
          padding={[0, scaleSize(14), scaleSize(60), scaleSize(49)]}
        >
          <Block flex={1} bottom>
            <Block flex={false} margin={[scaleSize(16), 0, 0, 0]}>
              <ZoulIcon height={58} width={75} />
            </Block>
            <Block flex={false} margin={[scaleSize(16), 0, 0, 0]}>
              <Text
                size={scaleSize(24)}
                style={{ letterSpacing: -1 }}
                weight={500}
                regular
                color={colors.white}
              >
                {SUB_TEXTS.PRETEXT1}
              </Text>
            </Block>
            <Block flex={false} margin={[scaleSize(26), 0, 0, 0]}>
              <Text
                size={scaleSize(24)}
                regular
                weight={500}
                style={{ letterSpacing: -1 }}
                color={colors.white}
              >
                {SUB_TEXTS.PRETEXT2}
              </Text>
            </Block>
            <Block flex={false} margin={[scaleSize(28), 0, 0, 0]}>
              <Text
                size={scaleSize(24)}
                style={{ letterSpacing: -1 }}
                regular
                weight={500}
                color={colors.white}
              >
                {SUB_TEXTS.PRETEXT3}
              </Text>
            </Block>
            <Block
              flex={false}
              style={{ borderRadius: 15, borderWidth: 1, borderColor: "white" }}
              margin={[scaleSize(28), 0, 0, 0]}
            >
              <TouchableOpacity
                style={{
                  height: perfectSize(40),
                }}
                onPress={() => navigation.navigate("Register")}
              >
                <Text
                  size={scaleSize(24)}
                  regular
                  center
                  weight={700}
                  color={colors.white}
                >
                  Register now!
                </Text>
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>
      </Block>
    </ImageBackground>
  );
};

export default ZoulSubscribe;

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
