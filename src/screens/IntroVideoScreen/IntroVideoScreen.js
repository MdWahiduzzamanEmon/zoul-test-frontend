import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import Block from "../../components/utilities/Block";
import SplashScreen from "react-native-splash-screen";
import useAuthorizedSession from "../../hooks/useAuthorizedSession";
import Video from "react-native-video";
import useRedirectToChooseLanguage from "../../hooks/useRedirectToChooseLanguage";
import { useDispatch, useSelector } from "react-redux";
import { setIsUserEnterFirstTime } from "../../store/auth";

export default function IntroGifScreen({ navigation }) {
  const [authToken] = useAuthorizedSession();
  const isUserRedirectedToChooseLanguage = useRedirectToChooseLanguage();
  const dispatch = useDispatch();
  const logoutFlag = useSelector((state) => state.authReducer.logoutFlag);

  const videoRef = useRef(null);

  const handleVideoLoad = () => {
    setTimeout(() => {
      SplashScreen.hide();
      // 2 sec 
    }, 2000);
    // Handle video load if needed
  };

  const [isVideoReady, setIsVideoReady] = useState(false);

  // Handle initial setup
  useEffect(() => {
    const initializeScreen = async () => {
      if (authToken) {
        dispatch(setIsUserEnterFirstTime(false));
      }
      if (Platform.OS === "ios") {
        // For iOS, wait a bit before hiding splash screen
        setTimeout(() => {
          SplashScreen.hide();
          setIsVideoReady(true);
        }, 2000); // Adjust this delay if needed
      } else {
        // For Android, hide immediately
        SplashScreen.hide();
        setIsVideoReady(true);
      }
    };

    initializeScreen();

    return () => {
      if (videoRef.current) {
        videoRef.current.seek(0);
      }
    };
  }, []);

  const handleVideoError = (error) => {
    console.warn("Video Error:", error);
    // Navigate to next screen in case of video error
    navigateToNextScreen();
  };

  const navigateToNextScreen = () => {
    if (authToken) {
      navigation.replace("TabNavigator");
    } else if (isUserRedirectedToChooseLanguage) {
      navigation.replace("ChooseLanguage", { isFromIntro: true });
      // navigation.replace("ChooseLanguage");
    } else if (logoutFlag) {
      navigation.replace("Login");
    } else {
      navigation.replace("ChooseLanguage", { isFromIntro: true });
      // navigation.replace("Testimonial");
    }
  };

  const handleVideoEnd = () => {
    navigateToNextScreen();
  };

  return (
    <Block flex={1} style={styles.container}>
      <Video
        ref={videoRef}
        source={require("../../assets/appVideos/AppVideo.mp4")}
        style={styles.video}
        resizeMode="cover"
        onLoad={handleVideoLoad}
        onEnd={handleVideoEnd}
        onError={handleVideoError}
        repeat={false}
        controls={false}
        playWhenInactive={true}
        playInBackground={false}
        ignoreSilentSwitch="ignore"
        rate={1.0}
        {...(Platform.OS === "ios" && {
          posterResizeMode: "cover",
          posterStyle: styles.video,
        })}
      />
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },

  video: {
    width: "100%",
    height: "100%",
  },
});
