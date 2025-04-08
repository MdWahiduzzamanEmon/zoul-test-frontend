import React from "react";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { usePlayer } from "../../modules/player";
import {
  Modal,
  View,
  SafeAreaView,
  //   ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  //   Image,
} from "react-native";
import { scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import GoogleIcon from "../../assets/icons/google-icon.svg";
import CloseSvg from "../../assets/icons/close.svg";
import { useSocialAuthentication } from "../social-button/useSocialAuthentication";
import { useSelector } from "react-redux";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

const AuthenticationModal = ({ isVisible = false, onPress }) => {
  const navigation = useNavigation();
  const { onGoogleAuth, onAppleAuth, onFacebookAuth } =
    useSocialAuthentication();
  const { isSocialLoading } = useSelector((state) => state.authReducer);

  const player = usePlayer();
  if (isVisible) {
    player.pause();
  }

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.modalWrapper}>
            <View style={styles.modalContainer}>
              {/* Close Button */}
              <Pressable onPress={onPress} style={styles.closeButton}>
                <CloseSvg width={scaleSize(18)} height={scaleSize(18)} />
              </Pressable>

              {/* Title */}
              <Text style={styles.title}>Join with one click</Text>

              {/* Google Sign-In Button */}
              <Pressable
                onPress={() => onGoogleAuth()}
                style={styles.googleButton}
                disabled={isSocialLoading}
              >
                <View style={styles.googleIconWrapper}>
                  <GoogleIcon width={scaleSize(20)} height={scaleSize(20)} />
                </View>
                {isSocialLoading ? (
                  <ActivityIndicator size="large" color={colors.white} />
                ) : (
                  <Text style={styles.googleButtonText}>
                    Sign in with Google
                  </Text>
                )}
              </Pressable>

              {/* More Options */}
              <Pressable
                onPress={() => {
                  onPress();
                  navigation.navigate("Login");
                }}
              >
                <Text style={styles.moreOptionsText}>
                  View more sign-in options
                </Text>
              </Pressable>

              {/* Agreement Text */}
              <Text style={styles.agreementText}>
                By creating an account, you agree to our Free membership
                agreement and{" "}
                <Text style={styles.privacyPolicy}>Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  background: {
    height: "100%",
    width: "100%",
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)", // Darker overlay for better contrast
  },
  modalContainer: {
    height: 250,
    width: "100%",
    backgroundColor: colors.mustardYellow2,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: scaleSize(30),
    borderTopRightRadius: scaleSize(30),
    paddingHorizontal: scaleSize(20),
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: scaleSize(20),
    right: scaleSize(20),
  },
  closeIcon: {
    width: scaleSize(18),
    height: scaleSize(18),
  },
  title: {
    fontSize: scaleSize(20),
    fontWeight: "bold",
    color: colors.blackCherry,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3C1E1E",
    borderRadius: scaleSize(25),
    paddingVertical: scaleSize(5),
    paddingHorizontal: scaleSize(10),
    marginVertical: scaleSize(15),
    // width: SCREEN_WIDTH * 0.9,
    justifyContent: "center",
  },
  googleIconWrapper: {
    backgroundColor: "white",
    borderRadius: scaleSize(20),
    padding: scaleSize(10),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scaleSize(10),
  },
  googleButtonText: {
    color: "white",
    fontSize: scaleSize(14),
  },
  moreOptionsText: {
    color: "#3C1E1E",
    fontSize: scaleSize(14),
    marginBottom: scaleSize(10),
  },
  agreementText: {
    color: "#3C1E1E",
    fontSize: scaleSize(14),
    textAlign: "center",
    marginBottom: scaleSize(10),
  },
  privacyPolicy: {
    color: "#3C1E1E",
    fontWeight: "bold",
  },
});

export default AuthenticationModal;
