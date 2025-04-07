import React, { memo, useEffect } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import { responsiveScale } from "../../styles/mixins";
import Block from "../utilities/Block";
import { colors } from "../../styles/theme";
import Text from "../utilities/Text";

const CommonDialog = memo((props) => {
  const {
    onClose,
    message = "Message",
    title = "Title",
    duration = 1000,
  } = props;

  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, duration);
  }, []);

  return (
    <Modal animationType={"fade"} transparent={true} visible={true}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Block flex={false} style={styles.dialog}>
          <Block flex={false} style={styles.header}>
            <Text weight={400} size={responsiveScale(24)} color={colors.white}>
              {title}
            </Text>
          </Block>
          <Block flex={false} style={styles.message}>
            <Text
              size={responsiveScale(18)}
              weight={300}
              color={colors.kPinkRose}
            >
              {message}
            </Text>
          </Block>
        </Block>
      </Pressable>
    </Modal>
  );
});
export default memo(CommonDialog);

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
});
