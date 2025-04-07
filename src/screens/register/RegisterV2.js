import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Text from "../../components/utilities/Text";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { perfectSize, scaleSize } from "../../styles/mixins";
import { colors, font } from "../../styles/theme";
import { Backgrounds } from "../../data/background";
import Block from "../../components/utilities/Block";
import { BackIcon } from "../../icons/back-icon/BackIcon";
import { handleRegisterBtn } from "./Register";
import Input from "../../components/input/Input";
import Divider from "../../components/divider/Divider";
import { SocialLoginIButtons } from "../../components/social-button/SocialLogInButtons";
import { isIOS } from "../../utils/platform";
import i18n from "../../translations/i18n";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LandingLogo } from "../../icons/landing/landing-logo";

const RegisterV2 = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const uuid = route?.params?.uuid;
  const { top, bottom } = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [isPremiumAccountLoading, setIsPremiumAccountLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const { isSocialLoading } = useSelector((state) => state.authReducer);
  const selectedLanguage = useSelector(
    (state) => state?.language?.selectedLanguage
  )?.toUpperCase();
  const promoCodeDetails = useSelector(
    (state) => state?.audioLinkReducer?.promoCodeDetails
  );

  const RegisterSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    name: yup.string().required("Name is required"),
    password: yup.string().required("Password is required").min(8),
  });

  return (
    <ImageBackground
      source={Backgrounds.signUpBackground}
      style={styles.background}
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

          <Block marginTop={scaleSize(16)}>
            <Text size={scaleSize(30)} color={colors.white} bold>
              {i18n.t("Sign Up")}
            </Text>
            <KeyboardAwareScrollView
              behavior={isIOS ? "padding" : "height"}
              style={styles.keyboard}
              bounces={false}
              showsVerticalScrollIndicator={false}
            >
              <Formik
                initialValues={{
                  email: "",
                  name: "",
                  password: "",
                }}
                validationSchema={RegisterSchema}
                onSubmit={async (values) => {
                  await handleRegisterBtn({
                    values,
                    uuid,
                    promoCodeDetails,
                    modal: { show: () => {}, close: () => {} },
                    setIsLoading,
                    dispatch,
                    navigation,
                    selectedLanguage,
                    setIsPremiumAccountLoading,
                    isSubscribedForInsights: isSelected,
                  });
                }}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <Block flex={false} paddingHorizontal={scaleSize(20)}>
                    <Input
                      placeholder="Name"
                      value={values.name}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      errorMessage={touched.name ? errors.name : undefined}
                      style={styles.input}
                      placeholderStyle={{
                        fontFamily: font.regular,
                        fontSize: scaleSize(18),
                      }}
                    />
                    <Input
                      placeholder="Email"
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      errorMessage={touched.email ? errors.email : undefined}
                      style={styles.input}
                      placeholderStyle={{
                        fontFamily: font.regular,
                        fontSize: scaleSize(18),
                      }}
                      secureTextEntry={false}
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      errorMessage={
                        touched.password ? errors.password : undefined
                      }
                      placeholderStyle={{
                        fontFamily: font.regular,
                        fontSize: scaleSize(18),
                      }}
                      style={styles.input}
                      secureTextEntry={true}
                    />

                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={[
                        styles.button,
                        { backgroundColor: colors.maroon },
                      ]}
                    >
                      <Text size={scaleSize(18)} color={colors.white}>
                        {i18n.t("Sign Up")}
                      </Text>
                    </TouchableOpacity>

                    <Block flex={false} center marginTop={scaleSize(16)}>
                      <Text color={colors.white}>
                        {i18n.t("already_have_an_account")}
                        <Text
                          bold
                          color={colors.white}
                          onPress={() => navigation.navigate("Login")}
                        >
                          {` ${i18n.t("log_in")}`}
                        </Text>
                      </Text>
                    </Block>

                    <Divider
                      title="or"
                      extraTitleStyle={{ color: colors.white }}
                    />

                    <Block flex={false} center marginTop={scaleSize(16)}>
                      <SocialLoginIButtons
                        uuid={uuid}
                        promocode={promoCodeDetails?.promoCode}
                      />
                    </Block>
                  </Block>
                )}
              </Formik>
              <Block flex={false} marginTop={scaleSize(90)} center bottom>
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
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      )}
    </ImageBackground>
  );
};

export default RegisterV2;

const styles = StyleSheet.create({
  background: { flex: 1 },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginTop: scaleSize(10),
    borderRadius: 10,
  },
  button: {
    marginTop: scaleSize(20),
    paddingVertical: scaleSize(12),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  keyboard: {
    flex: 1,
    marginTop: scaleSize(10),
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
