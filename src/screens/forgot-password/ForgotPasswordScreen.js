import React, { useCallback, useState, useRef } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { perfectSize, scaleSize } from "../../styles/mixins";
import { colors, font } from "../../styles/theme";
import i18n from "../../translations/i18n";
import { Backgrounds } from "../../data/background";
import Input from "../../components/input/Input";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackIcon } from "../../icons/back-icon/BackIcon";
import { Formik } from "formik";
import { forgotPassword } from "../../resources/baseServices/auth";
import { requestResetPasswordUsingPhoneNumber } from "../../resources/baseServices/auth";
import { useModal } from "../../context/ModalContext";
import { ErrorDialog } from "../../components/modal/Modal";
import * as yup from "yup";
import { LandingLogo } from "../../icons/landing/landing-logo";
import {
  ERROR_CONTACT_SUPPORT_MESSAGE,
  ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
} from "../../constants/errors";
import PhoneInput from "react-native-phone-number-input";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { isIOS } from "../../utils/platform";

const ForgotPassword = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const phoneInput = useRef(null);
  const modal = useModal();
  const checkIsForEmailVerify =
    route?.params?.isForEmailVerify && route?.params?.title;

  const handleForgotPasswordBtn = useCallback(async (values) => {
    setIsLoading(true);
    const data = values.phoneNumber
      ? { phoneNumber: values.phoneNumber }
      : { email: values.email };
    try {
      const res = values.phoneNumber
        ? await requestResetPasswordUsingPhoneNumber(data)
        : await forgotPassword(data);

      if (res?.data?.status === "success") {
        navigation.navigate("ResetPassword", {
          phoneNumber: values.phoneNumber ?? null,
          email: values.email ?? null,
        });
      }
    } catch (error) {
      modal.show(ErrorDialog, {
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

  const ForgotPasswordSchema = yup.object().shape({
    phoneNumber: yup
      .string()
      .min(10, i18n.t("Invalid phone number")),
    email: yup
      .string()
      .email("Invalid Email")
  });

  const { top, bottom } = useSafeAreaInsets();
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
          paddingHorizontal={scaleSize(20)}
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
            style={{
              marginTop: scaleSize(23),
              letterSpacing: -1,
              lineHeight: 38.4,
            }}
            size={scaleSize(32)}
            medium
            color={colors.white}
            regular
            weight={500}
          >
            {checkIsForEmailVerify ? route?.params?.title : "Reset password"}
          </Text>

          <KeyboardAwareScrollView
            behavior={isIOS ? "padding" : "height"}
            contentContainerStyle={{ flexGrow: 1 }}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <Text
              size={scaleSize(18)}
              style={{
                fontFamily: font.light,
                marginTop: scaleSize(12),
                lineHeight: 23.4,
              }}
              color={colors.kPinkRose}
            >
              We will send you a verification code to your phone number or
              Email.
            </Text>
            <Formik
              initialValues={{
                phoneNumber: "",
                email: "",
              }}
              validationSchema={ForgotPasswordSchema}
              onSubmit={(values) => {
                handleForgotPasswordBtn(values);
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldError,
                setFieldValue,
                values,
                errors,
                touched,
              }) => {
                const isButtonDisabled = !values.email && !values.phoneNumber;

                return (
                  <Block flex={1} marginTop={scaleSize(24)}>
                    {/* Phone Number Input */}
                    {!values.email && (
                      <Block flex={false} margin={[0, 0, 0, 0]}>
                        <PhoneInput
                          ref={phoneInput}
                          value={values.phoneNumber}
                          defaultCode="TH"
                          layout="second"
                          containerStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            width: "100%",
                            height: scaleSize(56),
                            borderRadius: 8,
                            marginTop: scaleSize(9),
                          }}
                          textContainerStyle={{
                            backgroundColor: "transparent",
                            borderTopRightRadius: 8,
                            borderBottomRightRadius: 8,
                            borderLeftWidth: 2,
                            borderLeftColor: "rgba(255, 255, 255, 0.1)",
                          }}
                          codeTextStyle={{
                            color: colors.white,
                          }}
                          textInputStyle={{
                            height: scaleSize(56),
                            color: colors.white,
                          }}
                          placeholder="Phone number*"
                          onChangeFormattedText={(text) => {
                            setFieldError("phoneNumber", "");
                            handleChange("phoneNumber", text);
                            setFieldValue("phoneNumber", text);
                          }}
                        />
                        {touched.phoneNumber && errors.phoneNumber ? (
                          <Text>{errors.phoneNumber}</Text>
                        ) : null}
                      </Block>
                    )}

                    {/* Divider */}
                    {!values.phoneNumber && !values.email && (
                      <View style={styles.container}>
                        <View style={styles.line} />
                        <Text style={styles.text}>or</Text>
                        <View style={styles.line} />
                      </View>
                    )}

                    {/* Email Input */}
                    {!values.phoneNumber && (
                      <Block flex={false} margin={[0, 0, 0, 0]}>
                        <Input
                          placeholder={"Email*"}
                          placeholderStyle={{ color: colors.kPinkRose }}
                          value={values.email}
                          onChangeText={handleChange("email")}
                          onBlur={handleBlur("email")}
                          errorMessage={touched.email && errors.email}
                          type="email"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                          }}
                        />
                      </Block>
                    )}

                    {/* Submit Button */}
                    <Block flex={false} margin={[scaleSize(20), 0]} center>
                      <TouchableOpacity
                        style={[
                          styles.forgotPasswordButton,
                          {
                            backgroundColor: isButtonDisabled
                              ? "rgba(255, 255, 255, 0.4)"
                              : colors.white,
                          },
                        ]}
                        onPress={handleSubmit}
                        disabled={isButtonDisabled}
                      >
                        {isLoading ? (
                          <ActivityIndicator size={25} color={colors.black} />
                        ) : (
                          <Text size={scaleSize(14)} medium color={"#060203"}>
                            {i18n.t("send")}
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
    </ImageBackground>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  background: { flex: 1, alignContent: "center" },
  forgotPasswordButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    height: perfectSize(50),
    borderRadius: perfectSize(8),
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#FFFFFF",
    opacity: 0.5,
  },
  text: {
    marginHorizontal: 10,
    color: "#FFFFFF",
    fontSize: 14,
  },
});
