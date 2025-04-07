import React, { memo, useCallback } from "react";
import { Modal, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import Block from "../utilities/Block";
import { colors } from "../../styles/theme";
import Text from "../utilities/Text";
import { useInAppBrowser } from "../../helpers/in-app-browser";
import { envConfig } from "../../config/config";
import { usePlayer } from "../../modules/player";
import { useSmallPlayer } from "../../modules/player/SmallPlayerProvider";
import { deleteLocalDataFile } from "../../helpers/app";
import { setIntroVideoVisibility } from "../../store/introvideo";
import { useDispatch } from "react-redux";
import {
  removeAuthTokenAction,
  setIsUnAuthorized,
  setLogoutFlag,
} from "../../store/auth";
import { clearAsyncStorage } from "../../helpers/auth";
import { setUserProfile } from "../../store/user/user";
import {
  setIsUserSubscribed,
  setSubscribedUser,
} from "../../store/storeAppData/actions/subscriptionAction";
import { forgotPassword } from "../../resources/baseServices/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
const CONTACT_SUPPORT_PAGE = envConfig.CONTACT_SUPPORT_PAGE;

export const ErrorDialog = memo((props) => {
  const {
    onClose,
    message,
    messageTitle,
    isShowButton,
    buttonName,
    isNotLoggedIn,
    navigation,
    isForEmailVerify,
    isSignup,
    statusCode,
    isResendCode,
    email,
  } = props;
  const { handleInAppBrowser } = useInAppBrowser();
  const player = usePlayer();
  const smallPlayer = useSmallPlayer();
  const dispatch = useDispatch();

  const resendCode = useCallback(async (email) => {
    try {
      const response = await forgotPassword({ email });
      return response?.data;
    } catch (error) {
      console.error("Error while resend verification code", error);
    }
  }, []);

  const handleOkPress = async () => {
    if (statusCode === 401) {
      player?.reset();
      smallPlayer?.hideSmallPlayer();
      await deleteLocalDataFile();
      dispatch(setIntroVideoVisibility(false));
      dispatch(setLogoutFlag(true));
      await clearAsyncStorage();
      dispatch(setUserProfile(null));
      dispatch(removeAuthTokenAction());
      dispatch(setIsUserSubscribed(false));
      dispatch(setSubscribedUser(null));
      AsyncStorage.removeItem("launchCount");
      AsyncStorage.removeItem("hasSubmittedReview");
    }
    const shouldNavigateToForgotPassword =
      isForEmailVerify &&
      navigation &&
      messageTitle === "Please verify your email";

    if (shouldNavigateToForgotPassword) {
      navigation.navigate("ForgotPassword", {
        isForEmailVerify: true,
        title: "Verify your email",
      });
    }
    onClose();
  };

  const handleContactSupportPress = async () => {
    if (isResendCode && email) {
      await resendCode(email);
    } else if (isSignup && navigation) {
      navigateToForgotPassword();
    } else if (isNotLoggedIn) {
      handleInAppBrowser(CONTACT_SUPPORT_PAGE);
    } else if (navigation) {
      navigateToSupport();
    }
    onClose();
  };

  const navigateToForgotPassword = () => {
    navigation.navigate("ForgotPassword", {
      isForEmailVerify: true,
      title: "Verify your email",
    });
  };

  const navigateToSupport = () => {
    if (navigation.replace) {
      navigation.replace("Support");
    } else {
      navigation.navigate("Support");
    }
  };

  return (
    <Modal animationType={"fade"} transparent={true} visible={true}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Block flex={false} style={styles.dialog}>
          {messageTitle ? (
            <Block flex={false} style={styles.header}>
              <Text weight={400} size={scaleSize(18)} color={colors.white}>
                {messageTitle ?? ""}
              </Text>
            </Block>
          ) : null}
          <Block flex={false} style={styles.message}>
            <Text size={scaleSize(18)} weight={300} color={colors.kPinkRose}>
              {message}
            </Text>
          </Block>
          <Block flex={false} row>
            {isShowButton ? (
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleContactSupportPress}
              >
                <Text
                  size={responsiveScale(18)}
                  weight={500}
                  color={colors.black}
                >
                  {buttonName}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleOkPress}
              >
                <Text
                  size={responsiveScale(18)}
                  weight={500}
                  color={colors.black}
                >
                  Ok
                </Text>
              </TouchableOpacity>
            )}
          </Block>
        </Block>
      </Pressable>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center", // Center the dialog
    alignItems: "center", // Center the dialog horizontally
    padding: responsiveScale(20),
  },
  dialog: {
    backgroundColor: "#3d0011",
    borderRadius: 8,
    padding: 20,
    width: "100%", // Control the dialog's width
    height: "auto",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
  },
  header: {
    marginBottom: 16,
  },
  message: {
    marginBottom: 24,
  },
  modalButton: {
    alignItems: "center",
    justifyContent: "center",
    height: perfectSize(50),
    borderRadius: perfectSize(4),
    width: "100%",
    backgroundColor: colors.white,
  },
});
