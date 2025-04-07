import React, { useState } from "react";
import {
  Modal,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Pressable,
  findNodeHandle,
  Platform,
} from "react-native";
import Block from "../utilities/Block";
import Text from "../utilities/Text";
import { perfectSize, scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import i18n from "../../translations/i18n";
import { useModal } from "../../context/ModalContext";
import { BlurView } from "@react-native-community/blur";
import { Backgrounds } from "../../data/background";

const CongratsModal = ({
  message = "Your plan has been updated to yearly plan.",
  btnTitle,
}) => {
  const modal = useModal();
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <Block flex={false} style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          modal.close();
          setModalVisible(!modalVisible);
        }}
      >
        <BlurView
          style={styles.blurView}
          blurAmount={Platform.OS === "ios" ? 1 : undefined}
          blurRadius={Platform.OS === "android" ? 5 : undefined}
          blurType="light"
        >
          <Pressable style={styles.overlay} onPress={() => modal.close()}>
            <Block flex={false} style={styles.dialog}>
              <ImageBackground
                source={Backgrounds.resetPasswordModalV2}
                style={styles.background}
                // resizeMode="cover"
              >
                <Block flex={false} style={styles.header}>
                  <Text
                    medium
                    size={scaleSize(24)}
                    color={colors.marron}
                    center
                    style={{
                      lineHeight: 28.8,
                    }}
                  >
                    {i18n.t("Congratulations")}
                  </Text>
                  <Text
                    medium
                    size={scaleSize(18)}
                    color={colors.white}
                    center
                    style={{
                      lineHeight: 28.8,
                      marginTop: perfectSize(10),
                    }}
                  >
                    {message}
                  </Text>
                </Block>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => modal.close()}
                >
                  <Text
                    size={scaleSize(18)}
                    weight={500}
                    regular
                    color={colors.blackCherry}
                  >
                    {i18n.t(btnTitle)}
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
            </Block>
          </Pressable>
        </BlurView>
      </Modal>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  blurView: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: scaleSize(20),
  },
  dialog: {
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
    borderColor: "#9D9D9F",
    borderWidth: 1,
  },
  background: {
    width: "100%",
  },
  header: {
    marginVertical: scaleSize(33),
    marginHorizontal: scaleSize(20),
  },
  modalButton: {
    marginHorizontal: perfectSize(20),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    height: perfectSize(50),
    borderRadius: perfectSize(8),
    width: "90%",
    marginBottom: perfectSize(30),
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
});

export default CongratsModal;
