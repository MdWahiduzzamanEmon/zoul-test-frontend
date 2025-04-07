import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  InputAccessoryView,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthTokenAction,
  setLanguage,
  setLogoutFlag,
} from "../../store/auth";
import { setAuthToken, setRefreshToken } from "../../helpers/auth";
import { getUserProfile, login } from "../../resources/baseServices/auth";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { perfectSize, scaleSize } from "../../styles/mixins";
import { colors, font } from "../../styles/theme";
import { Backgrounds } from "../../data/background";
import Input from "../../components/input/Input";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackIcon } from "../../icons/back-icon/BackIcon";
import Divider from "../../components/divider/Divider";
import { SocialLoginIButtons } from "../../components/social-button/SocialLogInButtons";
import { LandingLogo } from "../../icons/landing/landing-logo";
import { isIOS } from "../../utils/platform";
import { Formik } from "formik";
import * as yup from "yup";
import { useModal } from "../../context/ModalContext";
import { ErrorDialog } from "../../components/modal/Modal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { setIntroVideoVisibility } from "../../store/introvideo";
import { fetchReminders } from "../../resources/baseServices/app";
import {
  ERROR_CONTACT_SUPPORT_MESSAGE,
  ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
} from "../../constants/errors";
import i18n from "../../translations/i18n";
import PhoneInput from "react-native-phone-number-input";
import { Typography } from "../../components/typography/Typography";

const LogIn = ({ navigation }) => {
  const { isSocialLoading } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const modal = useModal();
  const { top, bottom } = useSafeAreaInsets();
  const phoneInput = useRef(null);

  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const handleLoginBtn = async (values) => {
    setIsLoginLoading(true);
    let data = {};
    if (values?.email !== "") {
      data = {
        email: values?.email,
        type: "email",
      };
    } else {
      data = {
        phoneNumber: values?.phoneNumber,
        type: "phone",
      };
    }

    // const data = {
    //   // userName: "thefastapp@gmail.com",
    //   // password: "P@jepaje00",
    //   userName:"verify@gmail.com",
    //   password:"Qwerty@123" ,
    //   // userName: values?.userName,
    //   // password: values?.password,
    //   // email: values?.email,
    //   // phoneNumber: values?.phoneNumber
    // };
    try {
      const res = await login(data);
      if (res?.data?.status === "success") {
        dispatch(setIntroVideoVisibility(false));
        await setAuthToken(res?.data?.response?.accessToken);
        await setRefreshToken(res?.data?.response?.refreshToken);
        dispatch(setLogoutFlag(false));
        const user = await handleUserProfile();
        dispatch(setLanguage(user?.preferred_language?.toLowerCase()));
        const reminderList = await fetchAllReminders();
        const reminders = reminderList?.filter((reminder) => reminder.toggle);
        if (!user?.birthDate) {
          navigation.navigate("BirthDayDetail", {
            isBirthDayPageViaLogin: true,
            isReminderListLength: reminders?.length === 0,
            authToken: res?.data?.response?.accessToken,
          });
        } else if (reminders?.length === 0) {
          navigation.navigate("Reminder", {
            isBirthDayPageViaLogin: true,
            isReminderListLength: reminders?.length === 0,
          });
        } else {
          dispatch(setAuthTokenAction(res?.data?.response?.accessToken));
          dispatch(setLogoutFlag(false));
        }
      }
    } catch (error) {
      console.log("error Login=--->", error);
      console.error(error?.response?.data);
      modal.show(ErrorDialog, {
        isForEmailVerify: true,
        navigation,
        messageTitle:
          error?.response?.data?.errorTitle ??
          ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
        message:
          error?.response?.data?.errorBody ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleUserProfile = useCallback(async () => {
    try {
      const res = await getUserProfile(true);
      if (res?.status == 200) {
        return res?.data;
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
    }
  }, []);

  const fetchAllReminders = useCallback(async () => {
    try {
      const res = await fetchReminders();
      if (res?.data) {
        const { reminders } = res?.data;
        const reminderList = Object.keys(reminders).map((key) => ({
          payloadTitle: key,
          time: reminders[key].time,
          toggle: reminders[key].enabled,
        }));
        return reminderList;
      }
    } catch (error) {
      console.error("error fetching reminders =--->", error);
      modal.show(ErrorDialog, {
        message:
          error?.response?.data?.message ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    }
  }, []);

  const LoginSchema = yup
    .object()
    .shape({
      email: yup.string().email("Invalid Email"),
      phoneNumber: yup
        .string()
        .matches(/^\+?\d+$/, "Phone number must contain only numbers")
        .min(10, "Invalid phone number"),
    })
    .test(
      "email-or-phone",
      "Either Email or Phone Number is required",
      (values) => {
        return !!(values.email || values.phoneNumber);
      }
    );

  // const LoginSchema = yup.object().shape({
  //   // email: yup
  //   //   .string()
  //   //   .email(i18n.t("Invalid Email"))
  //   //   .required(i18n.t("Email Required")),
  //   // phoneNumber: yup
  //   //   .string()
  //   //   .required("Phone Number Required") // Field is mandatory
  //   //   .min(10, "Invalid phone number") // Phone number must be at least 10 characters long
  //   //   .matches(/^\+?\d+$/, "Phone number must contain only numbers"),
  //   email: yup.string().email("Invalid Email"),
  //   phoneNumber: yup
  //     .string()
  //     .matches(/^\+?\d+$/, "Phone number must contain only numbers")
  //     .min(10, "Invalid phone number"),

  //   // phoneNumber: yup
  //   //   .string()
  //   //   .phoneNumber(i18n.t("Invalid phone number/email"))
  //   //   .required(i18n.t("Email/phone number Required")),
  //   // password: yup
  //   //   .string()
  //   //   .required(i18n.t("Password Required"))
  //   //   .min(8, i18n.t("Password Minimum Length"))
  //   //   .matches(/[A-Z]/, i18n.t("Password Uppercase Requirement"))
  //   //   .matches(/[0-9]/, i18n.t("Password Number Requirement")),
  //   // userName: yup
  //   //   .string()
  //   //   .min(4, "Username must be at least 4 characters long")
  //   //   .required("Username is Required")
  //   //   .matches(/^[^\s]/, "Username cannot start with a space")
  //   //   .matches(/[^\s]$/, "Username cannot end with a space")
  //   //   .matches(/^\S*$/, "Username cannot have spaces between characters"),
  //   // password: yup
  //   //   .string()
  //   //   .required(i18n.t("Password Required"))
  //   //   .min(6, "Password must be at least 6 characters")
  //   //   .matches(/^\S*$/, "Password no spaces allowed"),
  // });
  // const LoginSchema = yup.object().shape({
  //   email: yup
  //     .string()
  //     .email(i18n.t("Invalid Email"))
  //     .required(i18n.t("Email Required")),
  //   phoneNumber: yup
  //     .string()
  //     .required("Phone Number Required") // Field is mandatory
  //     .min(10, "Invalid phone number") // Phone number must be at least 10 characters long
  //     .matches(/^\+?\d+$/, "Phone number must contain only numbers"),
  //   // phoneNumber: yup
  //   //   .string()
  //   //   .phoneNumber(i18n.t("Invalid phone number/email"))
  //   //   .required(i18n.t("Email/phone number Required")),
  //   // password: yup
  //   //   .string()
  //   //   .required(i18n.t("Password Required"))
  //   //   .min(8, i18n.t("Password Minimum Length"))
  //   //   .matches(/[A-Z]/, i18n.t("Password Uppercase Requirement"))
  //   //   .matches(/[0-9]/, i18n.t("Password Number Requirement")),
  //   // userName: yup
  //   //   .string()
  //   //   .min(4, "Username must be at least 4 characters long")
  //   //   .required("Username is Required")
  //   //   .matches(/^[^\s]/, "Username cannot start with a space")
  //   //   .matches(/[^\s]$/, "Username cannot end with a space")
  //   //   .matches(/^\S*$/, "Username cannot have spaces between characters"),
  //   // password: yup
  //   //   .string()
  //   //   .required(i18n.t("Password Required"))
  //   //   .min(6, "Password must be at least 6 characters")
  //   //   .matches(/^\S*$/, "Password no spaces allowed"),
  // });
  const inputAccessoryViewID = "uniqueID";
  return (
    <ImageBackground
      source={Backgrounds.loginBackground}
      style={[styles.background]}
    >
      <StatusBar barStyle={"light-content"} />
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
          <Block flex={false} width={"10%"}>
            <TouchableOpacity
              onPress={() => {
                navigation.canGoBack()
                  ? navigation.goBack()
                  : navigation.replace("Landing");
              }}
            >
              <BackIcon size={perfectSize(22)} />
            </TouchableOpacity>
          </Block>
          <Block marginTop={scaleSize(8)}>
            <Block flex={false}>
              <Text
                size={scaleSize(32)}
                style={{ letterSpacing: -1 }}
                medium
                color={colors.white}
              >
                {i18n.t("log_in")}
              </Text>
            </Block>
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="handled"
              behavior={isIOS ? "padding" : "height"}
              contentContainerStyle={{ flex: 1 }}
              bounces={false}
              showsVerticalScrollIndicator={false}
            >
              <Formik
                initialValues={{
                  // password: "",
                  // userName: "",
                  email: "",
                  phoneNumber: "",
                }}
                validationSchema={LoginSchema}
                onSubmit={(values) => {
                  handleLoginBtn(values);
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
                  const isButtonDisabled = !values.phoneNumber && !values.email;
                  // const isButtonDisabled = !values.email && !values.phoneNumber;

                  return (
                    <Block flex={1} marginTop={scaleSize(23)}>
                      <Block
                        // row
                        flex={false}
                        style={
                          {
                            // backgroundColor:"red",
                            // alignItems:"flex-start"
                            // height: scaleSize(100)
                          }
                        }
                      >
                        <PhoneInput
                         
                          ref={phoneInput}
                          value={values.phoneNumber}
                          defaultCode="TH" // Default country code
                          layout="second"
                          onChangeText={handleChange("phoneNumber")}
                      
                          onChangeFormattedText={(text) => {
                            setFieldError("phoneNumber", "");
                            handleChange("phoneNumber", text);
                            setFieldValue("phoneNumber", text);
                            setFieldValue("email", "");
                          }}
                          containerStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
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
                            borderLeftColor: "rgba(255, 255, 255, 0.3)",
                            // backgroundColor: "white",
                          }}
                          codeTextStyle={{
                            color: colors.white,
                          }}
                          textInputStyle={{
                            height: scaleSize(56),
                            color: colors.white,
                          }}
                          placeholder="Phone number"
                          textInputProps={{
                            placeholderTextColor: colors.white,
                            // style: {
                            //   fontFamily: font.regular,
                            //   fontSize: scaleSize(17),
                            //   color: colors.white
                            // },
                          }}
                        />

                        {touched.phoneNumber && errors.phoneNumber ? (
                          <Typography style={styles.errorText}>
                            {touched.phoneNumber && errors.phoneNumber}
                          </Typography>
                        ) : null}
                        {/* <Block
                          flex={false}
                          style={{
                            width: scaleSize(60)
                          }}
                        >
                          <Input
                            //  placeholder={"+44"}
                            onChangeText={handleChange("numberCode")}
                            value={values.numberCode}
                            onBlur={handleBlur("numberCode")}
                            type="number"
                            errorMessage={touched.numberCode && errors.numberCode}
                            placeholderStyle={{
                              fontFamily: font.regular,
                              fontSize: scaleSize(5),
                            }}
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.3)",
                            }}
                          />
                        </Block>
                        <Block
                          // flex={false}
                          style={{
                            marginLeft: scaleSize(10)
                          }}
                        >
                          <Input
                            placeholder={"Phone number"}
                            onChangeText={handleChange("phoneNumber")}
                            value={values.phoneNumber}
                            onBlur={handleBlur("phoneNumber")}
                            type="number"
                            errorMessage={touched.phoneNumber && errors.phoneNumber}
                            placeholderStyle={{
                              fontFamily: font.regular,
                              fontSize: scaleSize(18),
                            }}
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.3)",
                            }}
                          />
                        </Block> */}
                      </Block>
                      <Block
                        flex={false}
                        style={{
                          marginTop: 0,
                        }}
                        // gap={0}
                      >
                        <Divider
                          title={"OR"}
                          extraTitleStyle={{
                            fontFamily: font.SemiBold,
                            fontSize: scaleSize(18),
                          }}
                        />
                      </Block>
                      <Block flex={false}>
                        <Input
                          placeholder={"Email"}
                          onChangeText={(text) => {
                            handleChange("email")(text);
                            setFieldValue("email", text);

                            handleChange("phoneNumber", "");
                            setFieldValue("phoneNumber", "");
                          }}
                          value={values.email}
                          onBlur={handleBlur("email")}
                          type="email"
                          errorMessage={touched.email && errors.email}
                          placeholderStyle={{
                            fontFamily: font.regular,
                            fontSize: scaleSize(17),
                          }}
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                          }}
                        />
                      </Block>
                      {/* <Block flex={false}>
                        <Input
                          placeholder={"User name*"}
                          onChangeText={handleChange("userName")}
                          value={values.userName}
                          onBlur={handleBlur("userName")}
                          type="email"
                          errorMessage={touched.userName && errors.userName}
                          placeholderStyle={{
                            fontFamily: font.regular,
                            fontSize: scaleSize(18),
                          }}
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                          }}
                        />
                      </Block> */}
                      {/* <Block flex={false} marginTop={scaleSize(12)}>
                        <Input
                          placeholder={"Password*"}
                          onChangeText={handleChange("password")}
                          value={values.password}
                          onBlur={handleBlur("password")}
                          type="password"
                          placeholderStyle={{
                            fontFamily: font.regular,
                            fontSize: scaleSize(18),
                          }}
                          errorMessage={touched.password && errors.password}
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                          }}
                        />
                      </Block> */}
                      {/*
                      <Block flex={false} marginTop={scaleSize(15)} row left>
                        <TouchableOpacity
                          onPress={() => navigation.navigate("ForgotPassword")}
                        >
                          <Text
                            size={scaleSize(18)}
                            regular
                            color={colors.white}
                          >
                        // {i18n.t("forgot_password")} 
                            Reset password?
                          </Text>
                        </TouchableOpacity>
                      </Block>
                      
                      */}
                      <Block flex={false} marginTop={scaleSize(30)} center>
                        <TouchableOpacity
                          style={[
                            styles.loginButton,
                            {
                              backgroundColor: isButtonDisabled
                                ? "rgba(255, 255, 255, 0.3)" // Disabled color
                                : colors.mustardYellow, // Enabled color
                            },
                          ]}
                          onPress={handleSubmit}
                          // onPress={()=>{
                          //   console.log("Yes")
                          //   handleSubmit
                          // }}
                          disabled={isButtonDisabled || isLoginLoading} // Disable if loading or button is disabled
                        >
                          {isLoginLoading ? (
                            <Block flex={false}>
                              <ActivityIndicator
                                size={25}
                                color={colors.white}
                              />
                            </Block>
                          ) : (
                            <Text
                              size={scaleSize(18)}
                              medium
                              color={colors.white} // Text color based on button state
                            >
                              {/* {i18n.t("log_in")} */}
                              Login
                            </Text>
                          )}
                        </TouchableOpacity>
                      </Block>
                      <Block flex={false}>
                        <Block flex={false}>
                          <Divider
                            title={"or continue with"}
                            extraTitleStyle={{
                              fontFamily: font.SemiBold,
                              fontSize: scaleSize(18),
                            }}
                          />
                        </Block>
                        <Block flex={false} marginTop={scaleSize(24)} middle>
                          <SocialLoginIButtons />
                        </Block>
                      </Block>
                    </Block>
                  );
                }}
              </Formik>
              <Block flex={false} marginBottom={scaleSize(47)} center bottom>
                <LandingLogo
                  height={perfectSize(59.14)}
                  width={perfectSize(76)}
                />
              </Block>
            </KeyboardAwareScrollView>
          </Block>
        </Block>
      </Block>
      {isSocialLoading && (
        <Block flex={1} style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={colors.white} />
        </Block>
      )}
    </ImageBackground>
  );
};

export default LogIn;
const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignContent: "center",
    opacity: 1,
  },
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    height: perfectSize(50),
    borderRadius: perfectSize(8),
    width: "100%",
  },
  // keyboard: {
  //   flex: 1,
  // },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject, // Full-screen overlay
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 12,
    lineHeight: scaleSize(16),
    marginTop: 1,
  },
  // overlay: {
  //   ...StyleSheet.absoluteFillObject, // Ensures the overlay covers the entire background
  //   backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black to dull the background (adjust the color and opacity as needed)
  // },
});
