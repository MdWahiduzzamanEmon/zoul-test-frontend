import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { perfectSize, scaleSize } from "../../styles/mixins";
import { colors, font } from "../../styles/theme";
import i18n from "../../translations/i18n";
import { Backgrounds } from "../../data/background";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackIcon } from "../../icons/back-icon/BackIcon";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { isIOS } from "../../utils/platform";
import { Formik } from "formik";
import ZoulIcon from "../../assets/icons/zoul-icon.svg";
import { verifyEmail } from "../../resources/baseServices/auth";
import { setRefreshToken, storeSignupAuthToken } from "../../helpers/auth";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/ModalContext";
import { ErrorDialog } from "../../components/modal/Modal";
import { setLogoutFlag } from "../../store/auth";
import {
  ERROR_CONTACT_SUPPORT_MESSAGE,
  ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
} from "../../constants/errors";

const VerifyEmail = ({ navigation, route }) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const modal = useModal();
  const { top, bottom } = useSafeAreaInsets();
  const email = route?.params?.email;
  const inputRefs = useRef([]);

  //----------- DO NOT REMOVE -------------//
  // const [timer, setTimer] = useState(60);
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setTimer((prevCounter) => prevCounter - 1); // DECREMENT THE TIMER BY 1
  //   }, 1000); // TIMER INTERVAL FOR 1 MINUTE

  //   // CLEANUP FUNCTION
  //   return () => clearInterval(intervalId);
  // }, []);

  const handleEmailVerification = useCallback(async (values) => {
    setIsLoading(true);
    const data = {
      email: route?.params?.email ?? "",
      code: values.codeArray.join(""),
    };
    try {
      const res = await verifyEmail(data);

      if (res?.data?.status === "success" && route?.params?.isSetting) {
        navigation.navigate("Personalinfo", {
          updatedEmail: route?.params?.email,
        });
        return;
      }

      if (res?.data?.status === "success") {
        if (res?.data?.response?.accessToken) {
          await storeSignupAuthToken(res?.data?.response?.accessToken, true);
          await setRefreshToken(res?.data?.response?.refreshToken);
          dispatch(setLogoutFlag(false));
          navigation.navigate("BirthDayDetail");
        }
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      modal.show(ErrorDialog, {
        isShowButton: true,
        buttonName: "contact support",
        navigation: navigation,
        isNotLoggedIn: route?.params?.isSetting ? false : true,
        messageTitle:
          error?.response?.data?.errorTitle ??
          ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
        message:
          error?.response?.data?.errorBody ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ImageBackground
      source={Backgrounds.verifyEmailBackground}
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
        <Block flex={1}>
          <Block
            flex={false}
            paddingLeft={perfectSize(20)}
            marginTop={perfectSize(16)}
          >
            <TouchableOpacity
              style={{ padding: perfectSize(6), marginBottom: perfectSize(16) }}
              onPress={() => navigation.goBack()}
            >
              <BackIcon size={perfectSize(22)} />
            </TouchableOpacity>
            <ZoulIcon width={52} height={40.06} />
          </Block>
          <Block flex={false} paddingHorizontal={perfectSize(8)}>
            <Text
              size={scaleSize(32)}
              medium
              center
              style={{ letterSpacing: -1 }}
              color={colors.white}
            >
              {i18n.t("verify_email")}
            </Text>
            <Text
              center
              size={scaleSize(16)}
              style={{ fontFamily: font.light, marginBottom: perfectSize(12) }}
              color={colors.white}
            >
              {`Your verification code has been sent to your email. ${
                email ? `(${email})` : ""
              }`}
            </Text>
            <Text size={scaleSize(20)} medium center color={colors.white}>
              Please check your inbox or
              <Text
                size={scaleSize(20)}
                style={{ fontFamily: font.extra_bold }}
              >
                {` junk/spam `}
              </Text>
              folder. The email was sent from
              <Text
                size={scaleSize(20)}
                style={{ fontFamily: font.extra_bold }}
              >
                {` admin@zoulapp.info.`}
              </Text>
            </Text>
          </Block>
          <Block
            flex={false}
            marginTop={perfectSize(21)}
            paddingHorizontal={perfectSize(20)}
          >
            <Text
              center
              size={scaleSize(16)}
              color={colors.white}
              style={{ fontFamily: font.light }}
            >
              The code will expire in 5 minutes.
            </Text>
          </Block>
          <Block
            flex={false}
            marginTop={perfectSize(2)}
            paddingHorizontal={perfectSize(25)}
          >
            <Text
              center
              size={scaleSize(24)}
              color={colors.white}
              style={{ fontFamily: font.SemiBold, letterSpacing: -1 }}
            >
              Enter the 4-digit code
            </Text>
          </Block>
          <KeyboardAwareScrollView
            behavior={isIOS ? "padding" : "height"}
            style={styles.keyboard}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <Formik
              initialValues={{ codeArray: ["", "", "", ""] }}
              onSubmit={(values) => {
                handleRegisterBtn(values);
              }}
            >
              {({ setFieldValue, values }) => {
                const isButtonDisabled = values.codeArray.some(
                  (digit) => digit === ""
                );
                const handleCodeChange = (index, value) => {
                  const numericValue = value.replace(/[^0-9]/g, "");
                  if (numericValue) {
                    const newCodeArray = [...values.codeArray];
                    newCodeArray[index] = numericValue;
                    setFieldValue("codeArray", newCodeArray);

                    // Move to next input if available
                    if (index < inputRefs.current.length - 1) {
                      inputRefs.current[index + 1].focus();
                    }
                  }
                };

                const handleBackspace = (index) => {
                  const newCodeArray = [...values.codeArray];

                  // If the current input is empty, move focus to the previous input and clear it
                  if (index > 0 && newCodeArray[index] === "") {
                    inputRefs.current[index - 1].focus();
                    newCodeArray[index - 1] = "";
                  } else {
                    // Clear the current input field
                    newCodeArray[index] = "";
                  }
                  setFieldValue("codeArray", newCodeArray);
                };

                useEffect(() => {
                  if (!values.codeArray.includes("")) {
                    // If all the values in codeArray are filled, trigger API call
                    handleEmailVerification(values);
                  }
                }, [values.codeArray]);

                return (
                  <Block flex={1} margin={[scaleSize(16), 0, 0, 0]}>
                    <Block
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 12,
                      }}
                      flex={1}
                    >
                      {values.codeArray.map((digit, index) => (
                        <TextInput
                          key={index}
                          ref={(ref) => (inputRefs.current[index] = ref)}
                          style={[
                            styles.codeInput,
                            {
                              borderBottomColor:
                                focusedIndex === index
                                  ? colors.white
                                  : "rgba(255, 255, 255, 0.3)", // White when focused, transparent otherwise
                            },
                          ]}
                          maxLength={1}
                          keyboardType="numeric"
                          value={digit}
                          onChangeText={(text) => handleCodeChange(index, text)}
                          onFocus={() => setFocusedIndex(index)}
                          onBlur={() => setFocusedIndex(-1)}
                          onKeyPress={({ nativeEvent }) => {
                            // Handle backspace to clear the current input and move to the previous one
                            if (nativeEvent.key === "Backspace") {
                              handleBackspace(index);
                            }
                          }}
                        />
                      ))}
                    </Block>
                  </Block>
                );
              }}
            </Formik>
            {/* <Block
              marginTop={perfectSize(12)}
              flex={false}
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                disabled={timer !== 0}
                onPress={() => LOG("CLICKED!!!!")}
              >
                <Text
                  size={scaleSize(16)}
                  style={{
                    fontFamily: font.light,
                  }}
                >{`Resend code (0:${timer})`}</Text>
              </TouchableOpacity>
            </Block> */}
          </KeyboardAwareScrollView>
        </Block>
      </Block>
      {isLoading && (
        <Block flex={1} style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={colors.white} />
        </Block>
      )}
    </ImageBackground>
  );
};

export default VerifyEmail;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start",
  },
  verifyEmailButton: {
    alignItems: "center",
    justifyContent: "center",
    height: perfectSize(50),
    borderRadius: perfectSize(8),
    width: "100%",
  },
  verifyEmailSubHeading: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  codeInput: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    height: perfectSize(65),
    width: perfectSize(58),
    borderTopLeftRadius: perfectSize(8), // Apply top left radius
    borderTopRightRadius: perfectSize(8),
    textAlign: "center",
    fontSize: scaleSize(32),
    color: colors.white,
    borderBottomWidth: 3, // Add the bottom border
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject, // Full-screen overlay
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
});
