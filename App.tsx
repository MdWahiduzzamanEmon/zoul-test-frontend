/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import "react-native-gesture-handler";
import React, { useCallback, useEffect } from "react";
import { LogBox, Platform, StatusBar, StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import configureStore from "./src/store/configureStore";
import NotificationsControl from "./src/components/functional/NotificationsControl";
import Navigation from "./src/navigation";
import i18n from "./src/translations/i18n";
import { setRToL } from "./src/store/isRightToLeft";
import { ModalProvider } from "./src/context/ModalContext";
import { ModalManager } from "./src/context/ModalManager";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PersistGate } from "redux-persist/lib/integration/react";
import { PlayerProvider } from "./src/modules/player";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LocaleProvider } from "./src/context/LocaleProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import { getuxcam } from "./src/resources/baseServices/auth";
import RNUxcam from "react-native-ux-cam";
import { UXCAM_API_KEY } from "./src/constants/revenueCatSKUs";
import Orientation from "react-native-orientation-locker";
import MasterEventLogger from "./src/utils/MasterEventLogger";

declare global {
  var allowLandscape: boolean | undefined;
}

const App = () => {
  const { store, persistor } = configureStore();
  const currentVersion = DeviceInfo.getVersion();

  LogBox.ignoreAllLogs();
  useEffect(() => {
    // Log the currently set default language
    if (i18n.locale == "ar") {
      store.dispatch(setRToL(true));
    }
  }, []);
  // const LogEventonInstall = async () => {
  //   const eventName = "AppInstall";
  //   const data = {
  //     camapaign_source: "",
  //     device_type: DeviceInfo.getDeviceType(),
  //     // location:locationName,
  //     device_os: DeviceInfo.getSystemName(),
  //     app_version: currentVersion,
  //   };
  //   await MasterEventLogger({ name: eventName, data: data, userId: "" });
  // };
  // const locationData = async () => {
  //   let location = await getLocation();
  //   let locationName = await getLocationName(
  //     location?.latitude,
  //     location?.longitude
  //   );
  //   console.log("location", locationName);
  //   LogEventonInstall(locationName);
  // };

  const handle = useCallback(() => {
    if (!global.allowLandscape) {
      Orientation.getDeviceOrientation((deviceOrientation) => {
        if (deviceOrientation !== "PORTRAIT") {
          Orientation.lockToPortrait();
        }
      });
    }
  }, []);

  useEffect(() => {
    Orientation.lockToPortrait();
    Orientation.getDeviceOrientation((deviceOrientation) => {
      if (deviceOrientation !== "PORTRAIT") {
        Orientation.lockToPortrait();
      }
    });

    Orientation.addOrientationListener(handle);
    Orientation.addDeviceOrientationListener(handle);

    return () => {
      Orientation.removeOrientationListener(handle);
      Orientation.removeDeviceOrientationListener(handle);
      Orientation.lockToPortrait();
    };
  }, [handle]);

  useEffect(() => {
    const checkAndLogEvent = async () => {
      try {
        const appInstall = await AsyncStorage.getItem("appInstall");

        if (appInstall !== "1") {
          const eventName = "AppInstall";
          const data = {
            camapaign_source: "",
            user_id: "", // Placeholder, replace with actual user_id if available
            device_type: DeviceInfo.getDeviceType(),
            device_os: DeviceInfo.getSystemName(),
            app_version: currentVersion,
            install_source:
              Platform.OS === "android" ? "Play store" : "App Store",
            timestamp: new Date(),
          };

          // await googleEvent(eventName, data);
          // locationData()
          // LogEventonInstall();
          await MasterEventLogger({ name: eventName, data: data, userId: "" });
          await AsyncStorage.setItem("appInstall", "1");
        } else {
          console.log(
            "App has already been installed previously. Skipping event logging."
          );
        }
      } catch (error) {
        console.error(
          "Error accessing AsyncStorage or logging AppInstall event:",
          error
        );
      }
    };

    checkAndLogEvent();
  }, []);

  useEffect(() => {
    const intiUXCAM = async () => {
      try {
        const uxcamRes = await getuxcam();

        if (uxcamRes?.data?.value?.uxcamEnabled) {
          RNUxcam.optIntoSchematicRecordings(); // Add this line to enable iOS screen recordings
          const configuration = {
            userAppKey: UXCAM_API_KEY,
            enableAutomaticScreenNameTagging: false,
            // enableAdvancedGestureRecognition?: boolean, // default is true
            enableImprovedScreenCapture: true, // for improved screen capture on Android
            // occlusions?: UXCamOcclusion[],
          };
          RNUxcam.startWithConfiguration(configuration);
        }
      } catch (error) {
        console.error("error intiUXCAM =--->", error);
      }
    };
    intiUXCAM();
  }, []);

  // const getPermission = async () => {
  //   const permissionLocation = await PermissionCheck.requestPermission(
  //     PERMISSION_TYPE.location
  //   );
  //   if (permissionLocation) {
  //     console.log("permission", permissionLocation);
  //   }
  // };
  // // Remove this method to stop OneSignal Debugging
  // OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // // OneSignal Initialization
  // OneSignal.initialize(ONESIGNAL_APP_ID);

  // // requestPermission will show the native iOS or Android notification permission prompt.
  // // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  // OneSignal.Notifications.requestPermission(true);

  // // Method for listening for notification clicks
  // OneSignal.Notifications.addEventListener("click", (event) => {
  //   console.log("OneSignal: notification clicked:", event);
  // });

  return (
    <Provider store={store}>
      <LocaleProvider>
        <PersistGate loading={null} persistor={persistor}>
          <PlayerProvider>
            <SafeAreaProvider>
              <ModalProvider>
                <StatusBar
                  barStyle="dark-content"
                  backgroundColor="transparent"
                  translucent
                />
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <View style={styles.container}>
                    <ModalManager />
                    <Navigation />
                    <NotificationsControl />
                  </View>
                </GestureHandlerRootView>
              </ModalProvider>
            </SafeAreaProvider>
          </PlayerProvider>
        </PersistGate>
      </LocaleProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
