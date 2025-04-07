import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors, font } from "../../styles/theme";
import { isIOS } from "../../utils/platform";
import { Backgrounds } from "../../data/background";
import Input from "../../components/input/Input";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackIcon } from "../../icons/back-icon/BackIcon";
import { Formik } from "formik";
import {
  resetPassword,
  resetPasswordUsingPhoneNumber,
} from "../../resources/baseServices/auth";
import { useModal } from "../../context/ModalContext";
import { ErrorDialog } from "../../components/modal/Modal";
import * as yup from "yup";
import { LandingLogo } from "../../icons/landing/landing-logo";
import {
  ERROR_CONTACT_SUPPORT_MESSAGE,
  ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
} from "../../constants/errors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomToast from "../../components/customToast/CustomToast";
import RightIcon from "../../assets/appImages/svgImages/RightIcon";
import ModalV2 from "../../components/modal/ModalV2";

const ResetPassword = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const modal = useModal();
  const inputRefs = useRef([]);
  const { top, bottom } = useSafeAreaInsets();

  const ResetPasswordSchema = yup.object().shape({
    newPassword: yup
      .string()
      .required("Password Required")
      .min(6, "Password must be at least 6 characters")
      .matches(/^[^\s]/, "Password cannot start with a space")
      .matches(/[^\s]$/, "Password cannot end with a space")
      .matches(/^\S*$/, "Password no spaces allowed"),
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf(
        [yup.ref("newPassword"), null],
        "Passwords do not match. Please try again."
      ),
  });

  const handleResetPasswordBtn = useCallback(async (values) => {
    if (values.codeArray.includes("")) return;
    setIsLoading(true);
    const resetPasswordCode = values.codeArray.join("");
    const data =
      route?.params?.phoneNumber ?? ""
        ? {
            phoneNumber: route.params.phoneNumber,
            newPassword: values.newPassword,
            resetPasswordCode,
          }
        : {
            email: route?.params?.email ?? "",
            newPassword: values.newPassword,
            resetPasswordCode,
          };
    try {
      const res = route.params.phoneNumber
        ? await resetPasswordUsingPhoneNumber(data)
        : await resetPassword(data);
      if (res?.data?.status === "success") {
        setIsPasswordReset(true);
        modal.show(ModalV2, {
          messageTitle: "Password Changed",
          imageSrc: Backgrounds.resetPasswordModalV2,
          onConfirm: () => modal.close(),
        });
      }
    } catch (error) {
      modal.show(ErrorDialog, {
        isShowButton: true,
        buttonName: "Resend",
        email: route?.params?.email,
        isResendCode:
          error?.response?.data?.errorTitle ===
          "Password reset code is invalid or has expired."
            ? true
            : false,
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
      source={Backgrounds.redBackgroundImage}
      style={[styles.background]}
    >
      <Block
        flex={1}
        style={{
          paddingTop: top,
          paddingBottom: bottom,
        }}
      >
        <Block
          flex={1}
          marginTop={scaleSize(16)}
          paddingHorizontal={perfectSize(20)}
        >
          <Block style={{ flexDirection: "row" }} flex={false}>
            <TouchableOpacity
              style={{ padding: perfectSize(6) }}
              onPress={() => navigation.goBack()}
            >
              <BackIcon size={perfectSize(22)} />
            </TouchableOpacity>
          </Block>

          <Text
            style={{ marginTop: scaleSize(24), letterSpacing: -1 }}
            size={scaleSize(32)}
            // medium
            regular
            weight={500}
            color={colors.white}
          >
            Reset Password
          </Text>

          <KeyboardAwareScrollView
            behavior={isIOS ? "padding" : "height"}
            contentContainerStyle={{ flexGrow: 1 }}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <Block flex={false} gap={scaleSize(10)} marginTop={scaleSize(12)}>
              <Text
                size={scaleSize(18)}
                style={{ fontFamily: font.light, lineHeight: 23.4 }}
                color={colors.kPinkRose}
              >
                Enter new password & verification code to change your password.
              </Text>
              <Text
                size={scaleSize(18)}
                style={{ fontFamily: font.light, lineHeight: 23.4 }}
                color={colors.kPinkRose}
              >
                {route.params.phoneNumber ? (
                  "Your verification code has been sent to your phone number."
                ) : (
                  <Text>
                    Your verification code has been sent to your email. Please
                    check your{" "}
                    <Text style={{ fontFamily: font.bold }}>
                      inbox or junk/spam{" "}
                    </Text>
                    folder. The email was sent from{" "}
                    <Text style={{ fontFamily: font.bold }}>
                      {`admin@zoulapp.info.`}
                    </Text>
                    .
                  </Text>
                )}
                {/* <Text
                  color={colors.kPinkRose}
                  size={scaleSize(20)}
                  style={{ fontFamily: font.bold }}
                >
                  {` inbox or junk/spam `}
                </Text>
                {`folder. The email was sent from `}
                <Text
                  color={colors.kPinkRose}
                  size={scaleSize(20)}
                  style={{ fontFamily: font.bold }}
                >
                  admin@zoulmeditation.info.
                </Text> */}
              </Text>
            </Block>
            <Formik
              initialValues={{
                codeArray: ["", "", "", ""],
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={ResetPasswordSchema}
              onSubmit={(values) => {
                handleResetPasswordBtn(values);
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => {
                const isButtonDisabled = !values.newPassword;

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

                return (
                  <Block flex={1} marginTop={scaleSize(40)}>
                    <Block row between flex={false}>
                      {values?.codeArray?.map((digit, index) => (
                        <TextInput
                          key={index}
                          ref={(ref) => (inputRefs.current[index] = ref)}
                          style={[
                            styles.codeInput,
                            {
                              borderBottomColor:
                                focusedIndex === index
                                  ? colors.white
                                  : "rgba(255, 255, 255, 0.4)", // White when focused, transparent otherwise
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
                    <Block flex={false} marginTop={scaleSize(12)}>
                      <Input
                        placeholder={"New Password*"}
                        placeholderStyle={{ color: colors.kPinkRose }}
                        value={values.newPassword}
                        onChangeText={handleChange("newPassword")}
                        onBlur={handleBlur("newPassword")}
                        errorMessage={touched.newPassword && errors.newPassword}
                        type="password"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        }}
                      />
                    </Block>
                    <Block flex={false} marginTop={scaleSize(12)}>
                      <Input
                        placeholder={"Confirm Password*"}
                        placeholderStyle={{ color: colors.kPinkRose }}
                        value={values.confirmPassword}
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        errorMessage={
                          touched.confirmPassword && errors.confirmPassword
                        }
                        type="password"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        }}
                      />
                    </Block>
                    <Block flex={false} marginTop={scaleSize(24)} center>
                      <TouchableOpacity
                        style={[
                          styles.resetPasswordButton,
                          {
                            backgroundColor: isButtonDisabled
                              ? "rgba(255, 255, 255, 0.4)"
                              : colors.white,
                          },
                        ]}
                        onPress={handleSubmit}
                      >
                        {isLoading ? (
                          <Block flex={false}>
                            <ActivityIndicator size={25} color={colors.black} />
                          </Block>
                        ) : (
                          <Text
                            size={responsiveScale(14)}
                            medium
                            color={"#060203"}
                          >
                            Change Password
                          </Text>
                        )}
                      </TouchableOpacity>
                    </Block>
                  </Block>
                );
              }}
            </Formik>
            <Block flex={0.2} center bottom>
              <LandingLogo height={perfectSize(100)} width={perfectSize(100)} />
            </Block>
          </KeyboardAwareScrollView>
        </Block>
      </Block>
      <CustomToast
        hideOn={2000}
        visible={isPasswordReset}
        message="Password updated successfully!"
        onHide={() => {
          setIsPasswordReset(false);
          navigation.navigate("Login");
        }}
        actionIcon={<RightIcon height={24} width={24} style={styles.icon} />}
      />
    </ImageBackground>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  background: { flex: 1, alignContent: "center" },
  resetPasswordButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    height: 50,
    borderRadius: perfectSize(8),
    width: "100%",
  },
  forgotSubHeading: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  codeInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    height: perfectSize(65),
    width: perfectSize(56),
    borderTopLeftRadius: perfectSize(8), // Apply top left radius
    borderTopRightRadius: perfectSize(8),
    textAlign: "center",
    fontSize: scaleSize(32),
    color: colors.white,
    borderBottomWidth: 2, // Add the bottom border
  },
  icon: {
    marginLeft: 10, // Adjust spacing as needed
  },
});
