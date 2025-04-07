import React, { useState } from "react";
import {
  Modal,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import Block from "../utilities/Block";
import CongratulationsIcon from "../../assets/appImages/svgImages/CongratulationsIcon.svg";
import Text from "../utilities/Text";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import i18n from "../../translations/i18n";

const GuestPassModal = ({ message, btnTitle, onClose, setIsShowContent }) => {
  const handleOkPress = () => {
    onClose();
    setIsShowContent(true);
  };

  return (
    <Block flex={false} style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={true}
        // onRequestClose={handleOkPress}
      >
        <Block flex={1} style={styles.modalBackground}>
          {/* <ImageBackground
            source={require("../../assets/appImages/GetCashbackModal.png")}
            resizeMode="stretch"
            style={styles.bgImage}
          > */}
          <Block
            flex={false}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <Block flex={false} style={styles.modalView}>
              <Block flex={false} style={styles.confettiContainer}>
                <CongratulationsIcon />
              </Block>
              <Text medium center size={scaleSize(21)} color={colors.white}>
                Congratulations!
              </Text>
              <Text
                regular
                center
                size={scaleSize(18)}
                color={colors.lightPinkBorderColor}
                style={{ marginTop: perfectSize(8) }}
              >
                {message}
              </Text>

              <TouchableOpacity style={styles.button} onPress={handleOkPress}>
                <Text center size={responsiveScale(16)} color={"#060203"}>
                  {btnTitle ? btnTitle : i18n.t("Got it")}
                </Text>
              </TouchableOpacity>
            </Block>
          </Block>
          {/* </ImageBackground> */}
        </Block>
      </Modal>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  modalBackground: {
    justifyContent: "center",
    // alignItems: "center",
    paddingHorizontal: perfectSize(20),
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalView: {
    padding: perfectSize(20),
    backgroundColor: "rgba(93, 7, 19, 0.4)",
    borderWidth: 1,
    borderColor: "#8C8F93",
    borderRadius: 10,
  },
  confettiContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: perfectSize(12),
    marginTop: perfectSize(24),
    height: perfectSize(48),
  },
});

export default GuestPassModal;
