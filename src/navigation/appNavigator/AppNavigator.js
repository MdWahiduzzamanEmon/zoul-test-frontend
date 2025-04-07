// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import DashBoard from "../../screens/dashBoard/DashBoard";
// import Home from "../../screens/home/Home";

// const AppStack = createNativeStackNavigator();

// export default function AppNavigator() {
//   return (
//     <NavigationContainer>
//       <AppStack.Navigator initialRouteName={"Home"}>
//         <AppStack.Screen
//           name="DashBoard"
//           component={DashBoard}
//           options={{ headerTitleAlign: "center" }}
//         />
//         <AppStack.Screen
//           name="Home"
//           component={Home}
//           options={{ headerTitleAlign: "center", headerShown: false }}
//         />
//       </AppStack.Navigator>
//     </NavigationContainer>
//   );
// }

import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../../screens/home/Home";
import DashBoard from "../../screens/dashBoard/DashBoard";
import TabBar from "../../components/tabBar/TabBar";
import AudioFilePlaying from "../../screens/audioFilePlaying/AudioFilePlaying";
import MySelection from "../../screens/mySelection/MySelection";
import MyPlaylistInspiration from "../../screens/mySelection/MyPlaylistInspiration";
import Allplaylists from "../../screens/allplaylists/Allplaylists";
import GettingOverplaylist from "../../screens/allplaylists/GettingOverplaylist";
import ProfilePage from "../../screens/profile/ProfilePage";
import ActivityHistory from "../../screens/profile/ActivityHistory";
import GuestPass from "../../screens/profile/GuestPass";
import SearchScreen from "../../screens/searchScreen/SearchScreen";
import ExploreScreen from "../../screens/explore/ExploreScreen";
import CategoriesScreen from "../../screens/categoriesScreen/CategoriesScreen";
import HoroscopeDetailScreen from "../../screens/horoscope/HoroscopeDetailScreen";
import Settings from "../../screens/settings/Settings";
import Personalinfo from "../../screens/settings/Personalinfo";
import PersonalInfoeditScreen from "../../screens/settings/PersonalInfoeditScreen";
import About from "../../screens/settings/About";
import TermsAndConditions from "../../screens/settings/TermsAndConditions";
import Support from "../../screens/settings/Support";
import IntroGifScreen from "../../screens/IntroVideoScreen/IntroVideoScreen";
import { useSelector } from "react-redux";
import ChooseLanguage from "../../screens/choose-language/ChooseLanguage";
import Reminder from "../../screens/reminder/Reminder";
import { Platform, StyleSheet, View } from "react-native";
import SmallPlayer from "../../components/small-player/SmallPlayer";
import App from "../../../App";
import Subscription_details from "../../screens/subscription/Subscription_details";
import ChangePlanScreen from "../../screens/subscription/Change_Plan";
import SubscriptionModal from "../../components/subscriptionModal/SubscriptionModal";
import useDynamicLinkHandler from "../../hooks/useDynamicLinkHandler";
import VerifyEmail from "../../screens/verify-email/VerifyEmail";
import OnBoardingTestimonial from "../../screens/testimonial/Testimonial";
import { SCREEN_NAMES } from "../../utils/utils";
import VS_Home from "../../scenes/home";
import VS_Viewer_Home from "../../scenes/home/viewer";
import VS_Speaker_Home from "../../scenes/home/speaker";
import VS_Meeting from "../../scenes/ILS";
import colors from "../../styles/videoSdk/colors";
import { navigationRef } from "../NavigationService";
import SessionExpire from "../../screens/SessionExpire/SessionExpire";
import { usePlayer } from "../../modules/player";
import ForgotPassword from "../../screens/forgot-password/ForgotPasswordScreen";
import BirthDayDetailEdit from "../../screens/birthday-detail/BirthDayDetailEdit";
import BirthDayDetail from "../../screens/birthday-detail/BirthDayDetail";
import Register from "../../screens/register/Register";
import LandingScreen from "../../screens/landing/LandingScreen";
import Login from "../../screens/login/Login";
import AuthenticationModal from "../../components/modal/AuthenticationModal";
import useAuthorizedSession from "../../hooks/useAuthorizedSession";
import SubscribeNewsLetterModal from "../../components/modal/SubscribeNewsLetterModal";
import SubscriptionModalV2 from "../../components/subscriptionModal/SubscriptionModalV2";
import { useNetInfoInstance } from "@react-native-community/netinfo";
import NetInfo from "@react-native-community/netinfo";
import NetworkModal from "../../components/modal/NetworkModal";
import RegisterV2 from "../../screens/register/RegisterV2";

const AppStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
// const VideoSdkStack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBar={(props) => <TabBar {...props} navigation={props.navigation} />}
        safeAreaInsets={{ bottom: 0, top: 0 }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfilePage}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Full Access"
          component={MySelection}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
      <SmallPlayer isFromBottomTab={true} />
    </View>
  );
}

// function VideoSdkStackNavigator() {
//   <VideoSdkStack.Navigator
//     screenOptions={{
//       animationEnabled: false,
//       presentation: "modal",
//     }}
//     initialRouteName={SCREEN_NAMES.VS_Home}
//   >

//   </VideoSdkStack.Navigator>;
// }

export default function AppNavigator() {
  // const navigationRef = useRef(null);
  const [isConnected, setIsConnected] = useState(true);
  const [networkModalVisible, setNetworkModalVisible] = useState(false);

  const [authToken] = useAuthorizedSession();
  const [isAuthenticationModalVisible, setIsAuthenticationModalVisible] =
    useState(false);
  const [
    isSubscribeNewsLetterModalVisible,
    setIsSubscribeNewsLetterModalVisible,
  ] = useState(false);

  const { promoCodeData, isPromoRedeemable, isVerifiedPromo, loading } =
    useDynamicLinkHandler({ navigationRef });

  const logoutFlag = useSelector((state) => state.authReducer.logoutFlag);

  let promo = null;
  let loadingFlag = false;
  if (logoutFlag) {
    promo = isPromoRedeemable && isVerifiedPromo ? promoCodeData : null;
  }
  const isIntroVideoVisible = useSelector(
    (state) => state.introvideo.introVideo
  );
  const isUserSubscribed = useSelector(
    (state) => state?.subscription?.isUserSubscribed
  );
  const [openSubscriptionModal, setOpenSubscriptionModal] = useState(false);

  useEffect(() => {
    if (!isUserSubscribed) {
      setTimeout(() => {
        if (promoCodeData && !loading) {
          if (isPromoRedeemable && isVerifiedPromo) {
          } else if (isVerifiedPromo) {
            setOpenSubscriptionModal(true);
          }
        }
      }, 3200);
    }
  }, [isVerifiedPromo, promoCodeData, isPromoRedeemable, loading]);

  const player = usePlayer();
  let timeoutRef = null;

  useEffect(() => {
    if (!authToken) {
      showAuthModalWithDelay();
    }

    return () => {
      clearTimeout(timeoutRef);
    };
  }, [authToken]);

  //if authToken available then close auth modal
  useEffect(() => {
    if (authToken) {
      setIsAuthenticationModalVisible(false);
      clearTimeout(timeoutRef);
    }
  }, [authToken]);

  const showAuthModalWithDelay = () => {
    timeoutRef = setTimeout(() => {
      setIsAuthenticationModalVisible(true);
    }, 4000);
  };

  const showAuthModalRandomly = () => {
    const randomTime = Math.random() * (60000 - 30000) + 30000; // Random 30s - 60s
    timeoutRef = setTimeout(() => {
      setIsAuthenticationModalVisible(true);
    }, randomTime);
  };

  const showSubscribeNewsLetterRandomly = () => {
    const randomTime = Math.random() * (60000 - 30000) + 30000; // Random 30s - 60s
    timeoutRef = setTimeout(() => {
      setIsSubscribeNewsLetterModalVisible(true);
    }, randomTime);
  };

  const handleCloseAuthModal = () => {
    setIsAuthenticationModalVisible(false);
    if (!authToken) {
      showSubscribeNewsLetterRandomly(); // Show subscription modal after closing auth modal
    }
  };

  const handleCloseSubscribeModal = () => {
    setIsSubscribeNewsLetterModalVisible(false);
    if (!authToken) {
      showAuthModalRandomly(); // Show auth modal after closing subscription modal
    }
  };

  useEffect(() => {
    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setNetworkModalVisible(!state.isConnected); // Show modal when offline
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <AppStack.Navigator
        initialRouteName={"TabNavigator"}
        screenOptions={{
          animation: Platform.OS === "android" ? "none" : "default",
        }}
      >
        <AppStack.Screen
          name="SessionExpire"
          component={SessionExpire}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="Testimonial"
          component={OnBoardingTestimonial}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="IntroGifScreen1"
          component={IntroGifScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="AudioFilePlaying"
          component={AudioFilePlaying}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="MyPlaylistInspiration"
          component={MyPlaylistInspiration}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="Allplaylists"
          component={Allplaylists}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="GettingOverplaylist"
          component={GettingOverplaylist}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="ActivityHistory"
          component={ActivityHistory}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="GuestPass"
          component={GuestPass}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="CategoriesScreen"
          component={CategoriesScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="HoroscopeDetailScreen"
          component={HoroscopeDetailScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="BirthDayDetail"
          component={BirthDayDetail}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="BirthDayDetailEdit"
          component={BirthDayDetailEdit}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="Personalinfo"
          component={Personalinfo}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="PersonalInfoeditScreen"
          component={PersonalInfoeditScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="About"
          component={About}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="TermsAndConditions"
          component={TermsAndConditions}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="Support"
          component={Support}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="ChooseLanguage"
          component={ChooseLanguage}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="Reminder"
          component={Reminder}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="Subscription_details"
          component={Subscription_details}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="ChangePlanScreen"
          component={ChangePlanScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="VerifyEmail"
          component={VerifyEmail}
          options={{ headerShown: false }}
        />
        {/* <AppStack.Screen
          name="videoSdkScreen"
          component={VideoSdkStackNavigator}
          options={{ headerShown: false }}
        /> */}
        <AppStack.Screen
          name={SCREEN_NAMES.VS_Home}
          component={VS_Home}
          options={{ headerTitle: "Live Stream" }}
        />
        <AppStack.Screen
          name={SCREEN_NAMES.VS_Viewer_Home}
          component={VS_Viewer_Home}
          options={{
            headerStyle: {
              backgroundColor: colors.primary["900"],
            },
            headerTitle: "Join live stream",
            headerBackTitle: "Home",
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <AppStack.Screen
          name={SCREEN_NAMES.VS_Speaker_Home}
          component={VS_Speaker_Home}
          options={{
            headerStyle: {
              backgroundColor: colors.primary["900"],
            },
            headerTitle: "Join live stream",
            headerBackTitle: "Home",
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <AppStack.Screen
          name={SCREEN_NAMES.VS_Meeting}
          component={VS_Meeting}
          options={{ headerShown: false }}
        />

        {/* //auth screens */}
        <AppStack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
          initialParams={{
            promoCodeData: promoCodeData,
            isPromoRedeemable: isPromoRedeemable,
            isVerifiedPromo: isVerifiedPromo,
          }}
        />
        <AppStack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="Register"
          component={RegisterV2}
          options={{ headerShown: false }}
          initialParams={{
            promoCode: promo,
          }}
        />
      </AppStack.Navigator>
      {openSubscriptionModal && (
        <SubscriptionModalV2
          isVisible={openSubscriptionModal}
          hideModal={() => {
            setOpenSubscriptionModal(false);
          }}
          code={promoCodeData}
        />
      )}
      {/* // for authentication modal */}
      {isAuthenticationModalVisible && (
        <AuthenticationModal
          isVisible={isAuthenticationModalVisible}
          onPress={() => {
            handleCloseAuthModal();
            player.reset();
          }}
        />
      )}
      {/* // for subscription modal */}
      {isSubscribeNewsLetterModalVisible && !isAuthenticationModalVisible && (
        <SubscribeNewsLetterModal
          isVisible={isSubscribeNewsLetterModalVisible}
          onPress={handleCloseSubscribeModal}
        />
      )}
      {/* <NetworkModal
        // isVisible={isConnected&&(!NetworkModalVisible)}
        isVisible={!isConnected && NetworkModalVisible}
        refresh={refresh}
        onPress={(navigation) => {
          navigation.navigate("GettingOverplaylist", {
            showDownloadIcon: true,
          });

          setNetworkModalvisible(false);
        }}
      /> */}
      {/* Show the NetworkModal when offline */}
      <NetworkModal
        isVisible={networkModalVisible}
        refresh={() => {
          // Manually re-check connection when user presses "Retry"
          NetInfo.fetch().then((state) => setIsConnected(state.isConnected));
        }}
        onPress={(navigation) => {
          console.log("Navigating to Downloads");
          navigation.navigate("GettingOverplaylist", {
            showDownloadIcon: true,
          });
          setNetworkModalVisible(false);
        }}
      />
      {/* <NetworkModal isVisible={isConnected} refresh={refresh} /> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
