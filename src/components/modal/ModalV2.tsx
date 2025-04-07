import React, { memo, useState } from "react";
import {
  findNodeHandle,
  ImageBackground,
  ImageSourcePropType,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { perfectSize, scaleSize } from "../../styles/mixins";
import Block from "../utilities/Block";
import Text from "../utilities/Text";
import { colors } from "../../styles/theme";
import { BlurView } from "@react-native-community/blur";
import { setRefreshToken, storeSignupAuthToken } from "../../helpers/auth";
import { setLogoutFlag } from "../../store/auth";
import { useDispatch } from "react-redux";

interface ModalV2Props {
  onClose: () => void;
  messageTitle?: string;
  messageBody?: string;
  imageSrc: string;
  buttonName?: string;
  onButtonClickProcess: () => void;
  response?: any;
  isPremiumAccount?: boolean;
  values?: any;
  selectedLanguage?: string;
  navigation: any;
}

const ModalV2 = (props: ModalV2Props) => {

  const {
    onClose,
    messageTitle,
    messageBody,
    imageSrc,
    buttonName,
    response,
    isPremiumAccount,
    values,
    selectedLanguage,
    navigation,
  } = props;
  const dispatch = useDispatch();

  const handleOkPress = async () => {
    if (isPremiumAccount && navigation) {
      navigateToSubscribe();
    } else if (!isPremiumAccount) {
      await handleNonPremiumAccount();
    }

    onClose();
  };

  const navigateToSubscribe = () => {
    navigation.navigate("subscribe", {
      userData: values,
      selectedLanguage: selectedLanguage,
      registerResponse: response,
    });
  };

  const handleNonPremiumAccount = async () => {
    if (response?.data?.response?.accessToken && navigation) {
      await storeSignupAuthToken(response?.data?.response?.accessToken, true);
      await setRefreshToken(response?.data?.response?.refreshToken);
      dispatch(setLogoutFlag(false));
      navigation.navigate("BirthDayDetail");
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
    >
        <BlurView
          style={styles.blurView}
          blurAmount={Platform.OS === "ios" ? 1 : undefined}
          blurRadius={Platform.OS === "android" ? 5 : undefined} 
          blurType="light"
        >
          <Pressable style={styles.overlay} onPress={onClose}>
            <Block flex={false} style={styles.dialog}>
              <ImageBackground
                source={imageSrc as ImageSourcePropType}
                style={styles.background}
                // resizeMode="cover"
              >
                {messageTitle ? (
                  <Block flex={false} style={styles.header}>
                    <Text
                      weight={500}
                      regular
                      size={scaleSize(24)}
                      color={colors.white}
                      center
                      style={{
                        lineHeight: 28.8,
                        textShadowColor: "rgba(0, 0, 0, 0.75)", // Shadow color with transparency
                        textShadowOffset: { width: 1, height: 1 }, // Horizontal and vertical shadow offset
                        textShadowRadius: 4,
                      }}
                    >
                      {messageTitle ?? ""}
                    </Text>
                  </Block>
                ) : null}
                <Block
                  flex={false}
                  style={styles.messageBody}
                  marginTop={
                    messageBody && messageTitle ? scaleSize(24) : scaleSize(37)
                  }
                  marginBottom={
                    messageBody && messageTitle ? scaleSize(21) : scaleSize(42)
                  }
                >
                  {messageBody ? (
                    <Text
                      weight={500}
                      regular
                      size={scaleSize(24)}
                      color={colors.white}
                      style={{
                        lineHeight: 28.8,
                        textShadowColor: "rgba(0, 0, 0, 0.75)", // Shadow color with transparency
                        textShadowOffset: { width: 2, height: 2 }, // Horizontal and vertical shadow offset
                        textShadowRadius: 4,
                      }}
                    >
                      {messageBody ?? ""}
                    </Text>
                  ) : null}
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleOkPress}
                  >
                    <Text
                      size={scaleSize(18)}
                      weight={500}
                      regular
                      color={colors.blackCherry}
                    >
                      {buttonName ?? "OK"}
                    </Text>
                  </TouchableOpacity>
                </Block>
              </ImageBackground>
            </Block>
          </Pressable>
        </BlurView>
    </Modal>
  );
};

export default memo(ModalV2);

const styles = StyleSheet.create({
  blurView: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: scaleSize(20),
  },
  dialog: {
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
    borderColor: "#9D9D9F",
    borderWidth: 1,
  },
  background: {
    width: "100%",
  },
  header: {
    marginTop: scaleSize(33),
    marginHorizontal: scaleSize(20),
  },
  modalButton: {
    alignItems: "center",
    justifyContent: "center",
    height: perfectSize(50),
    borderRadius: perfectSize(8),
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  messageBody: {
    marginHorizontal: scaleSize(20),
    // marginTop: scaleSize(10),
  },
});
