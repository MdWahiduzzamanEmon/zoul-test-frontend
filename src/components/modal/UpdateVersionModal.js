import {
  Linking,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Block from "../utilities/Block";
import { perfectSize, responsiveScale } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import Text from "../utilities/Text";
import i18n from "../../translations/i18n";

const UpdateVersionModal = (props) => {
  const { onClose, message, messageTitle, buttonText } = props;

  const handleOkPress = () => {
    const link =
      Platform.OS === "ios"
        ? "https://apps.apple.com/ua/app/zoul-meditation-sleep/id6502774439"
        : "https://play.google.com/store/apps/details?id=com.zoul.app";
    Linking.openURL(link);
    // onClose();
  };

  return (
    <Modal animationType={"fade"} transparent={true} visible={true}>
      <Block style={styles.overlay}>
        <Block flex={false} style={styles.dialog}>
          {messageTitle ? (
            <Block flex={false} style={styles.header}>
              <Text
                weight={400}
                size={responsiveScale(24)}
                color={colors.white}
              >
              {i18n.t("Discover New Version")}
              </Text>
            </Block>
          ) : null}
          {message ? (
            <Block flex={false} row middle style={styles.message}>
              <Text
                size={responsiveScale(18)}
                weight={300}
                color={colors.kPinkRose}
              >
                {message}
              </Text>
            </Block>
          ) : null}
          <Block flex={false} row>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleOkPress}
            >
              <Text
                size={responsiveScale(18)}
                weight={500}
                color={colors.black}
              >
                {buttonText ? buttonText : i18n.t("Update Now")}
              </Text>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
    </Modal>
  );
};

export default UpdateVersionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center", // Center the dialog
    alignItems: "center", // Center the dialog horizontally
    padding: responsiveScale(20),
  },
  dialog: {
    backgroundColor: "#3d0011",
    borderRadius: 8,
    padding: 20,
    width: "100%", // Control the dialog's width
    height: "auto",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
  },
  header: {
    marginBottom: 16,
  },
  message: {
    marginBottom: 24,
  },
  modalButton: {
    alignItems: "center",
    justifyContent: "center",
    height: perfectSize(50),
    borderRadius: perfectSize(4),
    width: "100%",
    backgroundColor: colors.white,
  },
});
