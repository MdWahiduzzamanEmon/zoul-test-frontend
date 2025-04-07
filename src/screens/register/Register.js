import React, { useRef, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setAuthTokenAction } from "../../store/auth";
import { removeUUID, setUUID } from "../../helpers/auth";
import {
  signUp,
  signUpWithPhoneNumber,
} from "../../resources/baseServices/auth";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { perfectSize, scaleSize } from "../../styles/mixins";
import { colors, font } from "../../styles/theme";
import { Backgrounds } from "../../data/background";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackIcon } from "../../icons/back-icon/BackIcon";
import Input from "../../components/input/Input";
import Divider from "../../components/divider/Divider";
import { SocialLoginIButtons } from "../../components/social-button/SocialLogInButtons";
import { isIOS } from "../../utils/platform";
import { ErrorMessage, Formik } from "formik";
import * as yup from "yup";
import { useModal } from "../../context/ModalContext";
import { ErrorDialog } from "../../components/modal/Modal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { setIntroVideoVisibility } from "../../store/introvideo";
import { useInAppBrowser } from "../../helpers/in-app-browser";
import { envConfig } from "../../config/config";
import { useRoute } from "@react-navigation/native";
import {
  ERROR_CONTACT_SUPPORT_MESSAGE,
  ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
} from "../../constants/errors";
import { promoCodeDetails as setPromoCodeDetails } from "../../store/audio-category/audioLink";
import { checkEmailExist } from "../../resources/baseServices/app";
import i18n from "../../translations/i18n";
import TickMark from "../../assets/appImages/svgImages/TickMark.svg";
import PhoneInput from "react-native-phone-number-input";
import ModalV2 from "../../components/modal/ModalV2";
import { Typography } from "../../components/typography/Typography";
const TERMS_AND_CONDITIONS_URL = envConfig.TERMS_AND_CONDITIONS_URL;

export const handleRegisterBtn = async ({
  values,
  uuid,
  promoCodeDetails,
  modal,
  setIsLoading,
  dispatch,
  navigation,
  selectedLanguage,
  setIsPremiumAccountLoading,
  isSubscribedForInsights,
}) => {
  const isPremiumAccount = values.actionType === "PREMIUM_ACCOUNT";
  isPremiumAccount ? setIsPremiumAccountLoading(true) : setIsLoading(true);
  let data = {};
  if (values?.email !== "") {
    data = {
      preferred_language: selectedLanguage,
      isSubscribedForInsights: isSubscribedForInsights,
      _fullName: "", // "testforclient",
      email: values.email, //"testforregister@mailinator.com",
      _phoneNumber: values.phoneNumber, //"+918888866645",
      role: "customer",
      type: "email", // (email or phone)
    };
  } else {
    data = {
      preferred_language: selectedLanguage,
      isSubscribedForInsights: isSubscribedForInsights,
      _fullName: "", // "testforclient",
      _email: values.email, //"testforregister@mailinator.com",
      phoneNumber: values.phoneNumber, //"+918888866645",
      role: "customer",
      type: "phone", // (email or phone)
    };
  }

  // const data = {
  //   preferred_language: selectedLanguage,
  //   isSubscribedForInsights: isSubscribedForInsights,
  //   _fullName: ""   ,   // "testforclient",
  //   email:  values.email    , //"testforregister@mailinator.com",
  //   _phoneNumber: values.phoneNumber  ,//"+918888866645",
  //   role:"customer",
  //   type:"email" // (email or phone)
  // };

  // const data = {
  //   fullName: values.lastName
  //     ? values.firstName + " " + values.lastName
  //     : values.firstName,
  //   password: values.password,
  //   role: "customer",
  //   preferred_language: selectedLanguage,
  //   userName: values.userName,
  //   phoneNumber: values.phoneNumber,
  //   isSubscribedForInsights: isSubscribedForInsights,
  // };
  // if (values?.email) {
  //   data.email = values.email;
  // }
  if (uuid) {
    values.id = uuid;
    data.uuid = uuid;
    navigation.setParams({ uuid: null });
  }
  if (promoCodeDetails?.promoCode) {
    data.promocode = promoCodeDetails?.promoCode;
  }

  try {
    // const res = await signUpWithPhoneNumber(data);
    const res = await signUp(data);
    if (res?.data?.status === "success") {
      dispatch(setIntroVideoVisibility(false));
      // dispatch(setAuthTokenAction(res?.data?.response?.accessToken));
      await setUUID(res?.data?.userId ?? null);
      // await setAuthToken(res?.data?.response?.accessToken);
      dispatch(setPromoCodeDetails(null));
      modal.show(ModalV2, {
        messageTitle: "Registration\nComplete!",
        imageSrc: Backgrounds.registerModalV2,
        onConfirm: () => modal.close(),
        response: res,
        buttonName: "Get Started",
        isPremiumAccount: isPremiumAccount,
        values: values,
        selectedLanguage,
        navigation,
      });
      // navigation.navigate("VerifyEmail", { email: values.email });
    }
  } catch (error) {
    console.log("Error in register:", error, navigation);
    modal.show(ErrorDialog, {
      buttonName: "ok",
      isShowButton: true,
      navigation:
        error?.response?.data?.errorBody === "Please verify your email."
          ? null
          : navigation,
      isSignup:
        error?.response?.data?.errorBody === "Please verify your email.",
      messageTitle:
        error?.response?.data?.errorTitle ??
        ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
      message:
        error?.response?.data?.errorBody ?? ERROR_CONTACT_SUPPORT_MESSAGE,
      onConfirm: () => modal.close(),
    });
  } finally {
    isPremiumAccount ? setIsPremiumAccountLoading(false) : setIsLoading(false);
  }
};

const Register = (props) => {
  const navigation = props.navigation;
  const { isSocialLoading } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const { top, bottom } = useSafeAreaInsets();
  const uuid = route?.params?.uuid;
  const modal = useModal();
  const { handleInAppBrowser } = useInAppBrowser();

  const phoneInput = useRef(null);

  const [isIsLoading, setIsLoading] = useState(false);
  const [isIsPremiumAccountLoading, setIsPremiumAccountLoading] =
    useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const selectedLanguage = useSelector(
    (state) => state?.language?.selectedLanguage
  )?.toUpperCase();

  const promoCodeDetails = useSelector(
    (state) => state?.audioLinkReducer?.promoCodeDetails
  );

  // const checkEmailExistence = async (email) => {
  //   try {
  //     setLoading(true);
  //     const response = await checkEmailExist({ email });
  //     return response?.data;
  //   } catch (error) {
  //     console.error("Error while checking email exist or not", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const RegisterSchema = yup
    .object()
    .shape({
      email: yup.string().email("Invalid Email"),
      phoneNumber: yup
        .string()
        .matches(/^\+?\d+$/, "Phone number must contain only numbers")
        .min(10, i18n.t("Invalid phone number")),
    })
    .test(
      "email-or-phone",
      "Either Email or Phone Number is required",
      (values) => {
        return !!(values.email || values.phoneNumber);
      }
    );

  // const RegisterSchema = yup.object().shape({
  //   // firstName: yup
  //   //   .string()
  //   //   .required(i18n.t("First Name Required"))
  //   //   .min(2, i18n.t("Name Minimum Length")),
  //   // lastName: yup
  //   //   .string()
  //   //   .required("Last Name Required")
  //   //   .min(2, "Last Name must be at least 2 characters"),
  //   // userName: yup
  //   //   .string()
  //   //   .min(4, "Username must be at least 4 characters long")
  //   //   .required("Username is Required")
  //   //   .matches(/^[^\s]/, "Username cannot start with a space")
  //   //   .matches(/[^\s]$/, "Username cannot end with a space")
  //   //   .matches(/^\S*$/, "Username cannot have spaces between characters"),
  //   email: yup
  //     .string()
  //     .email(i18n.t("Invalid Email"))
  //     .required(i18n.t("Email Required")),
  //   // password: yup
  //   //   .string()
  //   //   .required(i18n.t("Password Required"))
  //   //   .min(6, "Password must be at least 6 characters")
  //   //   .matches(/^[^\s]/, "Password cannot start with a space")
  //   //   .matches(/[^\s]$/, "Password cannot end with a space")
  //   //   .matches(/^\S*$/, "Password no spaces allowed"),
  //   phoneNumber: yup
  //     .string()
  //     .required("Phone Number Required") // Field is mandatory
  //     .min(10, "Invalid phone number") // Phone number must be at least 10 characters long
  //     .matches(/^\+?\d+$/, "Phone number must contain only numbers"),
  // });

  return (
    <ImageBackground
      source={Backgrounds.signUpBackground}
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
          <Block flex={1} marginTop={scaleSize(10.84)}>
            <Text
              size={scaleSize(32)}
              medium
              color={colors.white}
              style={{ letterSpacing: -1 }}
            >
              {i18n.t("Create Zoul Account")}
            </Text>
            <KeyboardAwareScrollView
              behavior={isIOS ? "padding" : "height"}
              style={styles.keyboard}
              bounces={false}
              showsVerticalScrollIndicator={false}
            >
              <Formik
                initialValues={{
                  // firstName: "",
                  // lastName: "",
                  // password: "",
                  // actionType: "",
                  // userName: "",
                  // countryCode: "",
                  email: "",
                  phoneNumber: "",
                }}
                validationSchema={RegisterSchema}
                onSubmit={async (values) => {
                  await handleRegisterBtn({
                    values: values,
                    promoCodeDetails: promoCodeDetails,
                    modal: modal,
                    setIsLoading: setIsLoading,
                    dispatch: dispatch,
                    navigation: navigation,
                    selectedLanguage: selectedLanguage,
                    uuid: uuid,
                    setIsPremiumAccountLoading: setIsPremiumAccountLoading,
                    isSubscribedForInsights: isSelected,
                  });
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
                          // placeholderStyle={{
                          //   fontFamily: font.regular,
                          //   fontSize: scaleSize(18),
                          // }}
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
                            //   color: colors.white,
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
                          value={values.email}
                          // onChangeText={handleChange("email")}
                          onChangeText={(text) => {
                            handleChange("email")(text);
                            setFieldValue("email", text);

                            handleChange("phoneNumber", "");
                            setFieldValue("phoneNumber", "");
                          }}
                          onBlur={handleBlur("email")}
                          errorMessage={touched.email && errors.email}
                          type="email"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            // marginTop:scaleSize(9)
                          }}
                          placeholderStyle={{
                            fontFamily: font.regular,
                            fontSize: scaleSize(18),
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

                      <Block
                        flex={1}
                        row
                        alignItems={"center"}
                        gap={scaleSize(5)}
                        marginTop={scaleSize(9)}
                      >
                        <TouchableOpacity
                          onPress={() => setIsSelected(!isSelected)}
                          style={{
                            flexDirection: "row",
                            width: scaleSize(17),
                            height: scaleSize(17),
                            borderColor: colors.white,
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 1,
                            backgroundColor: "rgba(217, 217, 217, 0.19)",
                            marginHorizontal: scaleSize(10),
                          }}
                        >
                          {isSelected ? <TickMark /> : null}
                        </TouchableOpacity>

                        <Block flex={1}>
                          <Text
                            size={scaleSize(13)}
                            regular
                            color={colors.white}
                          >
                            Stay connected with Zoul. Join our email list for
                            exclusive insights, mindful offers, and updates.
                          </Text>
                        </Block>
                      </Block>
                      <Block flex={false} marginTop={scaleSize(12)} center>
                        {promoCodeDetails?.promoCode ? (
                          <TouchableOpacity
                            style={[
                              styles.registerButton,
                              {
                                backgroundColor: isButtonDisabled
                                  ? "rgba(255, 255, 255, 0.3)"
                                  : colors.buttonBgColor,

                                width: "100%",
                              },
                            ]}
                            onPress={handleSubmit}
                            disabled={isButtonDisabled || isIsLoading}
                          >
                            {isIsLoading ? (
                              <Block flex={false}>
                                <ActivityIndicator
                                  size={25}
                                  color={colors.white}
                                />
                              </Block>
                            ) : (
                              <Text
                                size={scaleSize(19)}
                                weight={500}
                                color={colors.white}
                                style={{
                                  lineHeight: scaleSize(26),
                                  letterSpacing: -1,
                                }}
                                medium
                              >
                                Redeem
                              </Text>
                            )}
                          </TouchableOpacity>
                        ) : (
                          <Block flex={false} gap={12} between row>
                            <TouchableOpacity
                              style={[
                                styles.registerButton,
                                styles.freeButton,
                                {
                                  backgroundColor: isButtonDisabled
                                    ? "rgba(255, 255, 255, 0.3)"
                                    : "rgba(50, 50, 50, 0.9)",
                                },
                              ]}
                              onPress={() => {
                                setFieldValue("actionType", "");
                                handleSubmit();
                              }}
                              disabled={
                                isButtonDisabled ||
                                isIsLoading ||
                                isIsPremiumAccountLoading
                              }
                            >
                              {isIsLoading ? (
                                <Block flex={false}>
                                  <ActivityIndicator
                                    size={25}
                                    color={colors.white}
                                  />
                                </Block>
                              ) : (
                                <Text
                                  size={scaleSize(19)}
                                  weight={500}
                                  color={colors.white}
                                  style={{
                                    lineHeight: scaleSize(26),
                                    letterSpacing: -1,
                                  }}
                                  medium
                                >
                                  {i18n.t("Free Account")}
                                </Text>
                              )}
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[
                                styles.registerButton,
                                styles.premiumButton,
                                {
                                  backgroundColor: isButtonDisabled
                                    ? "rgba(255, 255, 255, 0.3)"
                                    : colors.mustardYellow,
                                },
                              ]}
                              onPress={() => {
                                setFieldValue("actionType", "PREMIUM_ACCOUNT");
                                handleSubmit();
                              }}
                              disabled={
                                isButtonDisabled ||
                                isIsLoading ||
                                isIsPremiumAccountLoading
                              }
                            >
                              {isIsPremiumAccountLoading ? (
                                <Block flex={false}>
                                  <ActivityIndicator
                                    size={25}
                                    color={colors.white}
                                  />
                                </Block>
                              ) : (
                                <Text
                                  size={scaleSize(19)}
                                  weight={500}
                                  color={colors.white}
                                  medium
                                  style={{
                                    lineHeight: scaleSize(26),
                                    letterSpacing: -1,
                                  }}
                                >
                                  {i18n.t("Premium Account")}
                                </Text>
                              )}
                            </TouchableOpacity>
                          </Block>
                        )}

                        <Block
                          flex={false}
                          style={{ flexWrap: "wrap" }}
                          row
                          marginTop={scaleSize(6)}
                        >
                          <Text
                            size={scaleSize(11)}
                            color={colors.white}
                            regular
                          >
                            {`${i18n.t("By_continuing_agree")} `}
                          </Text>
                          <Text
                            size={scaleSize(11)}
                            color={colors.white}
                            medium
                            onPress={() =>
                              handleInAppBrowser(TERMS_AND_CONDITIONS_URL)
                            }
                          >
                            {i18n.t("Terms & Conditions")}
                          </Text>
                        </Block>
                      </Block>

                      <Block flex={false}>
                        <Divider
                          title={"or continue with"}
                          extraTitleStyle={{
                            fontSize: scaleSize(18),
                            color: colors.white,
                            fontFamily: font.bold,
                          }}
                        />
                        <Block flex={false}>
                          <SocialLoginIButtons
                            uuid={uuid}
                            promocode={promoCodeDetails?.promoCode}
                          />
                        </Block>
                        <Block flex={false} center marginTop={scaleSize(10)}>
                          <Text
                            size={scaleSize(16)}
                            color={colors.white}
                            regular
                          >
                            {i18n.t("already_have_an_account")}
                            <Text
                              size={scaleSize(20)}
                              bold
                              color={colors.white}
                              onPress={() => navigation.navigate("Login")}
                              style={{ fontFamily: font.SemiBold }}
                            >
                              {` ${i18n.t("log_in")}`}
                            </Text>
                          </Text>
                        </Block>
                      </Block>
                    </Block>
                  );
                }}
              </Formik>
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

export default Register;

const styles = StyleSheet.create({
  background: { flex: 1, alignContent: "center" },
  registerButton: {
    alignItems: "center",
    justifyContent: "center",
    height: perfectSize(54),
    borderRadius: perfectSize(8),
  },
  freeButton: {
    flex: 0.8,
  },
  premiumButton: { flex: 1 },
  keyboard: {
    flex: 1,
  },
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
    color: colors.white,
  },
});
