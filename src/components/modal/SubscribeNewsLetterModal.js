import React, { useState } from "react";
import {
  Modal,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import MailSvg from "../../assets/icons/mail.svg";
import SendSvg from "../../assets/icons/send.svg";
import CloseSvg from "../../assets/icons/close.svg";

const SubscribeNewsLetterModal = ({ isVisible = false, onPress }) => {
  const [email, setEmail] = useState("");

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <SafeAreaView style={styles.modalWrapper}>
          <View style={styles.modalContainer}>
            {/* Close Button */}
            <Pressable onPress={onPress} style={styles.closeButton}>
              <CloseSvg width={scaleSize(18)} height={scaleSize(18)} />
            </Pressable>

            {/* Mail Icon */}
            <MailSvg
              width={scaleSize(60)}
              height={scaleSize(60)}
              style={styles.mailIcon}
            />

            {/* Heading */}
            <Text style={styles.title}>Stay Tuned!</Text>

            {/* Description */}
            <Text style={styles.description}>
              Subscribe to our newsletter and get notifications to stay updated.
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your e-mail address"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <Pressable style={styles.sendButton}>
                <SendSvg width={scaleSize(20)} height={scaleSize(20)} />
              </Pressable>
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
    justifyContent: "flex-end", // Push modal to the bottom
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  modalWrapper: {
    width: "100%",
  },
  modalContainer: {
    backgroundColor: colors.mustardYellow2,
    borderTopLeftRadius: scaleSize(20),
    borderTopRightRadius: scaleSize(20),
    padding: scaleSize(20),
    alignItems: "center",
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    top: scaleSize(15),
    right: scaleSize(15),
  },
  mailIcon: {
    marginBottom: scaleSize(10),
  },
  title: {
    fontSize: scaleSize(22),
    fontWeight: "bold",
    color: "black",
  },
  description: {
    color: "#3C1E1E",
    fontSize: scaleSize(14),
    textAlign: "center",
    marginTop: scaleSize(10),
    marginBottom: scaleSize(20),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: scaleSize(25),
    paddingHorizontal: scaleSize(15),
    width: "100%",
    height: scaleSize(50),
    position: "relative",
  },
  input: {
    flex: 1,
    fontSize: scaleSize(16),
    color: "black",
  },
  sendButton: {
    backgroundColor: "#3C1E1E",
    color: "white",
    paddingVertical: scaleSize(15),
    paddingHorizontal: scaleSize(25),
    borderRadius: scaleSize(25),
    position: "absolute",
    right: scaleSize(0),
  },
});

export default SubscribeNewsLetterModal;
