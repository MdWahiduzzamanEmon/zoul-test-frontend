import React, { useCallback, useState } from "react";
import {
  ImageBackground,
  Linking,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator, // Import ScrollView for scrollable content
} from "react-native";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import GuestPassIcon from "../../assets/appImages/svgImages/GuestPassIcon.svg";
import DropDownPicker from "react-native-dropdown-picker";
import DownArrow from "../../assets/appImages/svgImages/DownArrow.svg";
import i18n from "../../translations/i18n";
import { useModal } from "../../context/ModalContext";
import { ErrorDialog } from "../../components/modal/Modal";
import { sendSupportRequest } from "../../resources/baseServices/app";
import {
  ERROR_CONTACT_SUPPORT_MESSAGE,
  ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
} from "../../constants/errors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LogoIcon from "../../components/common/SvgIcons/LogoIcon";
import CloseIcon from "../../components/common/SvgIcons/CloseIcon";

const Support = ({ navigation }) => {
  const [open, setOpen] = useState(false);
  const { bottom } = useSafeAreaInsets();
  const [value, setValue] = useState("Support");
  const [message, setMessage] = useState("");
  const modal = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([
    { label: "Founder", value: "Founder" },
    { label: "Co-founder", value: "Co-founder" },
    { label: "Support", value: "Support" },
    {
      label: "All Co-founders Teams",
      value: "All Co-founders Teams",
    },
    { label: "Teacher", value: "Teacher" },
  ]);

  const handleMailTo = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleSupportRequest = useCallback(async () => {
    if (!value || !message) return;
    try {
      setIsLoading(true);
      const data = {
        writeTo: value,
        message: message,
      };
      const res = await sendSupportRequest(data);
      if (res?.data?.status === "success") navigation.goBack();
    } catch (error) {
      modal.show(ErrorDialog, {
        messageTitle:
          error?.response?.data?.errorTitle ??
          ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
        message:
          error?.response?.data?.errorBody ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [value, message]);

  return (
    <Block flex={1}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={require("../../assets/appImages/Support.png")}
        resizeMode="stretch"
        style={styles.bgImage}
      >
        <Block flex={1}>
          {/* Static Header Section */}
          <Block flex={false} style={styles.headerContainer}>
            <Block flex={false} row between center>
              <TouchableOpacity>
                <LogoIcon width={52} height={40.19} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={1}
              >
                <Block
                  flex={false}
                  style={{
                    borderColor: "rgba(0,0,0,0.3)",
                    borderWidth: 1,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    borderRadius: 20,
                    paddingHorizontal: perfectSize(13),
                    marginBottom: scaleSize(20),
                  }}
                  row
                  center
                  gap={4}
                >
                  <Text
                    size={responsiveScale(17)}
                    medium
                    weight={400}
                    color={colors.white}
                  >
                    {i18n.t("Skip")}
                  </Text>
                  <CloseIcon style={{ marginTop: scaleSize(2) }} />
                </Block>
              </TouchableOpacity>
            </Block>
          </Block>

          {/* Static Title Section */}
          <Block flex={false} style={styles.titleContainer}>
            <Text medium size={responsiveScale(28)} color={colors.white}>
              {i18n.t("Support")}
            </Text>
          </Block>

          {/* Scrollable Content Section */}
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <Block flex={false} style={styles.content}>
              <Block flex={false} style={styles.description}>
                <Text
                  regular
                  size={scaleSize(16)}
                  weight={500}
                  color={colors.white}
                >
                  {i18n.t("We’re here for you!")}
                  {"\n"}
                  {i18n.t("If you have any questions")}
                </Text>
                <Text
                  regular
                  size={scaleSize(16)}
                  color={colors.white}
                  weight={500}
                  style={{ marginTop: perfectSize(20) }}
                >
                  {i18n.t("We’ll get back")}
                </Text>
              </Block>

              {/* Dropdown Menu Section */}
              <Block flex={false} style={styles.dropdownContainer}>
                <Text
                  regular
                  size={scaleSize(16)}
                  weight={500}
                  color={colors.white}
                >
                  {i18n.t("Write to:")}
                </Text>

                <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  style={styles.dropdown}
                  placeholder={i18n.t("Select a recipient")}
                  placeholderStyle={{
                    color: colors.white,
                  }}
                  textStyle={{
                    fontSize: scaleSize(16),
                    color: colors.white,
                  }}
                  containerStyle={{
                    width: "100%",
                    marginTop: perfectSize(10),
                  }}
                  dropDownContainerStyle={{
                    backgroundColor: colors.gray,
                    marginTop: perfectSize(10),
                    borderColor: colors.white,
                  }}
                  ArrowDownIconComponent={() => (
                    <DownArrow height={24} width={24} />
                  )}
                  onChangeValue={(value) => {
                    setValue(value);
                  }}
                  showsVerticalScrollIndicator={false}
                  showHorizontalScrollIndicator={false}
                />

                <TextInput
                  style={styles.textInput}
                  placeholder={i18n.t("Message")}
                  placeholderTextColor={colors.white}
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                  multiline
                  numberOfLines={14}
                  editable={!open}
                />
              </Block>

              <Block flex={false} style={{ marginTop: perfectSize(12) }}>
                <Text
                  regular
                  weight={700}
                  size={scaleSize(20)}
                  color={colors.white}
                  center
                >
                  {i18n.t("Thank you for using Zoul!")}
                </Text>
              </Block>
            </Block>
          </ScrollView>
          <Block flex={false} style={{ marginHorizontal: scaleSize(20) }}>
            <Text
              regular
              size={scaleSize(14)}
              weight={500}
              color={colors.white}
            >
              {i18n.t("Contact our support team at")}{" "}
            </Text>
            <Text
              style={{ textDecorationLine: "underline" }}
              color={colors.white}
              size={scaleSize(14)}
              weight={500}
              onPress={() => handleMailTo("Support@zoul.app")}
            >
              Support@zoul.app
            </Text>
          </Block>
          <Block
            flex={false}
            marginBottom={scaleSize(36)}
            style={styles.buttonContainer}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => handleSupportRequest()}
              disabled={isLoading}
            >
              {isLoading ? (
                <Block flex={false}>
                  <ActivityIndicator size={25} color={colors.white} />
                </Block>
              ) : (
                <Text
                  regular
                  weight={500}
                  size={scaleSize(20)}
                  color={colors.white}
                  style={{ textAlign: "center" }}
                >
                  {i18n.t("Send")}
                </Text>
              )}
            </TouchableOpacity>
          </Block>
        </Block>
      </ImageBackground>
    </Block>
  );
};

export default Support;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: perfectSize(30),
  },
  headerContainer: {
    marginTop: "17%",
    paddingHorizontal: perfectSize(16),
  },
  titleContainer: {
    paddingHorizontal: perfectSize(16),
    marginTop: perfectSize(10),
  },
  content: {
    paddingHorizontal: perfectSize(16),
    marginTop: perfectSize(5),
  },
  description: {
    marginTop: 20,
  },
  dropdownContainer: {
    marginTop: perfectSize(25),
  },
  dropdown: {
    backgroundColor: colors.transparent,
    borderColor: colors.white,
    borderRadius: perfectSize(8),
  },
  textInput: {
    backgroundColor: colors.darktransparent,
    borderRadius: perfectSize(8),
    paddingHorizontal: perfectSize(16),
    paddingTop: perfectSize(16),
    color: colors.white,
    height: perfectSize(172),
    fontSize: scaleSize(18),
    marginTop: perfectSize(19),
    textAlignVertical: "top",
  },
  buttonContainer: {
    // paddingHorizontal: perfectSize(30),
    borderRadius: perfectSize(8),
    overflow: "hidden",
    backgroundColor: colors.darkRedText,
    marginVertical: perfectSize(15),
    marginHorizontal: scaleSize(20),
  },
  closeButton: {
    alignItems: "center",
    justifyContent: "center",
    height: perfectSize(56),
    borderRadius: perfectSize(8),
    width: "100%",
    paddingVertical: perfectSize(12),
  },
});
