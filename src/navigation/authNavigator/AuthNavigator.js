import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../../screens/login/Login";
import Register from "../../screens/register/Register";
import LandingScreen from "../../screens/landing/LandingScreen";
import ForgotPassword from "../../screens/forgot-password/ForgotPasswordScreen";
import ResetPassword from "../../screens/reset-password/ResetPassword";
import VerifyEmail from "../../screens/verify-email/VerifyEmail";
import ChooseLanguage from "../../screens/choose-language/ChooseLanguage";
import ReminderIntro from "../../screens/reminder/ReminderIntro";
import Reminder from "../../screens/reminder/Reminder";
import Testimonial from "../../screens/testimonial/Testimonial";
// import WhyZoul from "../../screens/why-zoul/WhyZoul";
// import WhyZoulTwo from "../../screens/why-zoul/WhyZoulTwo";
import IntroGifScreen from "../../screens/IntroVideoScreen/IntroVideoScreen";
import { useSelector } from "react-redux";
import ZoulIntroSlide from "../../screens/why-zoul/ZoulIntroSlide";
import ZoulSubscribe from "../../screens/why-zoul/ZoulSubscribe";
import Subscribe from "../../screens/authsubscribe/subscribe";
import useDynamicLinkHandler from "../../hooks/useDynamicLinkHandler";
import { Platform } from "react-native";
import BirthDayDetailEdit from "../../screens/birthday-detail/BirthDayDetailEdit";
import BirthDayDetail from "../../screens/birthday-detail/BirthDayDetail";

const AuthStack = createNativeStackNavigator();

export default function AuthNavigator() {
  const navigationRef = useRef(null);
  const isIntroVideoVisible = useSelector(
    (state) => state.introvideo.introVideo
  );
  const logoutFlag = useSelector((state) => state.authReducer.logoutFlag);

  const {
    promoCodeData,
    isPromoRedeemable,
    isVerifiedPromo,
    loading,
    navigator,
    isZoulCheckOutTokenInvalid,
  } = useDynamicLinkHandler({ navigationRef });
  let promo = null;
  let loadingFlag = false;
  if (logoutFlag) {
    promo = isPromoRedeemable && isVerifiedPromo ? promoCodeData : null;
  }

  if (loading) {
    return null;
  }

  // GENERATE INITIAL ROUTE NAMES
  const getInitialRouteName = () => {
    if (isZoulCheckOutTokenInvalid) return "Login";
    if (navigator && navigator.routeName) return navigator.routeName;
    if (logoutFlag) return promo ? "Register" : "Login";
    if (isIntroVideoVisible) return "IntroGifScreen";
    return "Testimonial";
  };

  // GENERATE INITIAL ROUTE PARAMS
  const getInitialRouteParams = () => {
    if (navigator && navigator.routeName) return navigator.params;
    return null;
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <AuthStack.Navigator
        screenOptions={{
          animation: Platform.OS === "android" ? "none" : "default",
        }}
        initialRouteName={getInitialRouteName()}
      >
        <AuthStack.Screen
          name="IntroGifScreen"
          component={IntroGifScreen}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
          initialParams={{
            promoCodeData: promoCodeData,
            isPromoRedeemable: isPromoRedeemable,
            isVerifiedPromo: isVerifiedPromo,
          }}
        />
        <AuthStack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
          initialParams={{
            promoCode: promo,
          }}
        />
        <AuthStack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="VerifyEmail"
          component={VerifyEmail}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="BirthDayDetail"
          component={BirthDayDetail}
          initialParams={getInitialRouteParams()}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="BirthDayDetailEdit"
          component={BirthDayDetailEdit}
          initialParams={getInitialRouteParams()}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="ChooseLanguage"
          component={ChooseLanguage}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="ReminderIntro"
          component={ReminderIntro}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="Reminder"
          component={Reminder}
          initialParams={getInitialRouteParams()}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="Testimonial"
          component={Testimonial}
          options={{ headerShown: false }}
          initialParams={{
            promoCodeData: promoCodeData,
            isPromoRedeemable: isPromoRedeemable,
            isVerifiedPromo: isVerifiedPromo,
          }}
        />
        <AuthStack.Screen
          name="ZoulIntroSlide"
          component={ZoulIntroSlide}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="ZoulSubscribe"
          component={ZoulSubscribe}
          options={{ headerShown: false }}
        />
        {/* <AuthStack.Screen
          name="WhyZoul"
          component={WhyZoul}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="WhyZoulTwo"
          component={WhyZoulTwo}
          options={{ headerShown: false }}
        /> */}
        <AuthStack.Screen
          name="subscribe"
          component={Subscribe}
          options={{ headerShown: false }}
        />
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}
