import React, { useEffect } from "react";
import useAuthorizedSession from "../hooks/useAuthorizedSession";
import { PermissionsAndroid, Platform } from "react-native";
import AppNavigator from "./appNavigator/AppNavigator";
import AuthNavigator from "./authNavigator/AuthNavigator";
import { usePlayer } from "../modules/player";
import SplashScreen from "react-native-splash-screen";
import { LogLevel, OneSignal } from "react-native-onesignal";
import { ONESIGNAL_APP_ID } from "../constants/links";

const Navigation = () => {
  const [authToken] = useAuthorizedSession();
  const player = usePlayer();

  useEffect(() => {
    const timeout = setTimeout(() => {
      SplashScreen.hide();
    }, 2000);

    return () => {
      player.reset();
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    initOneSignal();
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === "android" && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        console.log("Notification granted", granted);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Notification permission denied");
        }
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  const initOneSignal = async () => {
    try {
      console.log("initOneSignal");
      // Remove this method to stop OneSignal Debugging
      OneSignal.Debug.setLogLevel(LogLevel.Verbose);

      // OneSignal Initialization
      OneSignal.initialize(ONESIGNAL_APP_ID);

      // requestPermission will show the native iOS or Android notification permission prompt.
      // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
      OneSignal.Notifications.requestPermission(true);
      console.log("OneSignal.Notifications.requestPermission");

      // Method for listening for notification clicks
      OneSignal.Notifications.addEventListener("click", (event) => {
        console.log("OneSignal: notification clicked:", event);
      });
    } catch (error) {
      console.error("error =--->", error);
    }
  };
  // return authToken ? <AppNavigator /> : <AppNavigator />;
  // return authToken ? <AppNavigator /> : <AuthNavigator />;
  return <AppNavigator />;
};

export default Navigation;
