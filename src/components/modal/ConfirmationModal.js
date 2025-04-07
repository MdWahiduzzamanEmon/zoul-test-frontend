import React from "react";
import { Modal, StyleSheet, TouchableOpacity } from "react-native";
import { perfectSize, responsiveScale } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import Text from "../utilities/Text";
import Block from "../utilities/Block";

const ConfirmationModal = ({
  message,
  isModalVisible,
  cancelDelete,
  handleCancle,
  confirmDelete,
  isIsLoading,
}) => {
  return (
    <Modal transparent visible={isModalVisible} onRequestClose={cancelDelete}>
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={handleCancle}
      >
        <Block flex={false} style={styles.modalContent}>
          <Text
            size={responsiveScale(18)}
            color={colors.white}
            style={styles.modalText}
            regular
          >
            {message}
          </Text>
          <TouchableOpacity onPress={confirmDelete} style={styles.deleteButton}>
            {isIsLoading ? (
              <Block flex={false}>
                <ActivityIndicator size={25} color={colors.white} />
              </Block>
            ) : (
              <Text size={responsiveScale(16)} color={colors.black}>
                Yes
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCancle}
            style={[
              styles.deleteButton,
              {
                backgroundColor: "#FFFFFF33",
                marginVertical: perfectSize(1),
                marginBottom: perfectSize(10),
              },
            ]}
          >
            <Text size={responsiveScale(16)} color={colors.white}>
              No
            </Text>
          </TouchableOpacity>
        </Block>
      </TouchableOpacity>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#393939E5",
    borderRadius: perfectSize(8),
    paddingVertical: perfectSize(10),
    borderWidth: perfectSize(1),
    borderColor: "#FFFFFF33",
    padding: perfectSize(20),
  },
  modalText: {
    marginBottom: perfectSize(10),
    marginTop: perfectSize(10),
  },
  deleteButton: {
    backgroundColor: colors.white,
    paddingVertical: perfectSize(10),
    borderRadius: perfectSize(8),
    alignItems: "center",
    marginVertical: perfectSize(10),
    width: "100%",
  },
});
