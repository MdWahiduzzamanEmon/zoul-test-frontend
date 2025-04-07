import React, { useState, useCallback } from "react";
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import DatePicker from "react-native-date-picker";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import {
  consoleLog,
  perfectSize,
  responsiveScale,
  scaleSize,
} from "../../styles/mixins";
import { colors } from "../../styles/theme";
import BackIcon from "../../assets/appImages/svgImages/BackIcon";
import CheckIcon from "../../assets/appImages/svgImages/CheckIcon.svg";
import HidePasswordIcon from "../../assets/appImages/svgImages/HidePasswordIcon.svg";
import ShowPasswordIcon from "../../assets/appImages/svgImages/ShowPasswordIcon.svg"; // Import the show password icon
import { updateProfile } from "../../resources/baseServices/auth";
import { useSelector } from "react-redux";
import { useModal } from "../../context/ModalContext";
import { ErrorDialog } from "../../components/modal/Modal";
import { Formik } from "formik";
import * as yup from "yup";
import {
  updateUserEmail,
  updateUserPassword,
} from "../../resources/baseServices/app";
import i18n from "../../translations/i18n";
import {
  ERROR_CONTACT_SUPPORT_MESSAGE,
  ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
} from "../../constants/errors";
import Input from "../../components/input/Input";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CommonDialog from "../../components/modal/CommonDialog";
import { LandingLogo } from "../../icons/landing/landing-logo";
import moment, { lang } from "moment";
import { months } from "../../components/modal/MonthsData";
import DatePickerModal from "../../components/modal/DatePickerModal";
import { openCamera } from "react-native-image-crop-picker";

const EditableField = ({
  label,
  value,
  setValue,
  isGenderField,
  selectedGender,
  setSelectedGender,
  isPasswordField,
  isPasswordVisible,
  // togglePasswordVisibility,
  onBlur,
}) => {
  const today = new Date(Date.now());
  const [date, setDate] = useState(today);

  const [open, setOpen] = useState(false);
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setValue(selectedDate);
  };
  const selectedLanguage = useSelector(
    (state) => state?.language.selectedLanguage
  );
  const formatDate = (date) => {
    return date?.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Block flex={false} row style={[styles.infoRow]}>
      <Block flex={false} style={styles.fieldTextContainer}>
        {/* {value !== "" && (
          <Text regular size={responsiveScale(10)} color={colors.white}>
            {label}
          </Text>
        )} */}
        <Block
          flex={false}
          style={{
            paddingVertical: isGenderField ? null : perfectSize(8),
          }}
        >
          <Pressable
            onPress={() => {
              consoleLog("Pressed input");
              setOpen(true);
            }}
          >
            <Text
              style={[
                styles.valueText,
                styles.textInput,
                styles.button,
                {
                  backgroundColor: "#FFFFFF1A",
                },
              ]}
            >
              {formatDate(date)
                ? formatDate(date)
                : `Select ${label.toLowerCase()}`}
            </Text>
          </Pressable>
          <DatePicker
            modal
            maximumDate={new Date()}
            open={open}
            date={typeof date !== "string" ? date : today}
            onDateChange={(selectedDate) => {
              handleDateChange(selectedDate);
            }}
            onConfirm={(selectedDate) => {
              setOpen(false);
              handleDateChange(selectedDate);
            }}
            // onCancel={() => setOpen(false)}
            mode="date"
            theme="dark"
          />
        </Block>
      </Block>
    </Block>
  );
};

const BirthDayDetailEdit = ({ route, navigation }) => {
  const { title, data, label } = route.params;
  const [isHoroscopeEnabled, setIsHoroscopeEnabled] = useState(false);
  const { top } = useSafeAreaInsets();
  const user = useSelector((state) => state?.userReducer?.userProfile);
  // const initialValue = data;
  const initialValue = label === i18n.t("Birthday") ? new Date(data) : data;
  const [value, setValue] = useState(initialValue);
  const [selectedGender, setSelectedGender] = useState(
    label === "Gender" ? data : null
  );
  const isCheckSettingOrHomePage =
    route?.params?.isSetting || route?.params?.isExplore; // check it
  const [isLoading, setIsLoading] = useState(false);
  const modal = useModal();

  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPasswordVisible: false,
    newPasswordVisible: false,
    retypeNewPasswordVisible: false,
  });

  const updatedFieldMap = {
    "First name": "firstName",
    "Last name": "lastName",
    Email: "updatedEmail",
    Birthday: "updatedBirthday",
    Gender: "gender",
    "Password & Security": "updatedPassword",
  };

  const handleUpdateUserEmail = async (values) => {
    const data = {
      email: values,
    };
    try {
      const response = await updateUserEmail(data);
      if (response?.data?.status === "success") {
        navigation.navigate("VerifyEmail", {
          isSetting: true,
          email: values,
        });
      }
    } catch (error) {
      modal.show(ErrorDialog, {
        messageTitle:
          error?.response?.data?.errorTitle ??
          ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
        message:
          error?.response?.data?.errorBody ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    }
  };

  const handleBirthDayDetail = useCallback(async (value) => {
    consoleLog("Inside change birthday func:", value);
    setIsLoading(true);
    const daee = new Date(value);
    // const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const month = String(daee.getUTCMonth() + 1).padStart(2, "0"); // Get month (0-based index)
    const day = String(daee.getUTCDate()).padStart(2, "0"); // Get day

    const birthDate = `${month}-${day}`;
    const data = {
      birthDate: `${birthDate}`,
    };
    try {
      await updateProfile(
        {
          birthDate: `${birthDate}`,
        },
        // data,
        false
      );
      route?.params?.isExplore && navigation.goBack();
      route?.params?.isSetting &&
        navigation.navigate("Personalinfo", {
          birthDate: `${birthDate}`,
        });
    } catch (error) {
      console.log("Error updating birthday:", error);
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
  }, []);

  const onSave = async () => {
    setIsLoading(true);
    try {
      const updatedField = updatedFieldMap[label];
      const firstName = user?.fullName?.split?.(" ")[0] ?? "";
      const lastName = user?.fullName?.split?.(" ")[1] ?? "";
      let updatedValue;
      if (label === "Gender") {
        updatedValue = selectedGender;
      } else if (label === "Birthday") {
        updatedValue = value.toISOString();
      } else {
        updatedValue = value;
      }

      let updatedFieldKey = "";
      let updateFieldValue = "";
      if (updatedField === "firstName") {
        updatedFieldKey = "fullName";
        updateFieldValue =
          updatedField === "firstName" && lastName
            ? `${updatedValue} ${lastName}`
            : updatedValue;
      } else if (updatedField === "lastName") {
        updatedFieldKey = "fullName";
        updateFieldValue =
          updatedField === "lastName" && firstName
            ? `${firstName} ${updatedValue}`
            : updatedValue;
      }

      if (label === i18n.t("Email")) {
        await handleUpdateUserEmail(updatedValue);
        return;
      }

      if (
        label !== i18n.t("Password & Security") &&
        label !== i18n.t("Email")
      ) {
        await updateProfile(
          {
            [updatedFieldKey?.length ? updatedFieldKey : updatedField]:
              updateFieldValue?.length ? updateFieldValue : updatedValue,
          },
          false
        );
        navigation.navigate("Personalinfo", { [updatedField]: updatedValue });
      }
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
  };

  return (
    <Block flex={1}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={require("../../assets/appImages/ExploreBackgroundImageNew.png")}
        resizeMode="stretch"
        style={[styles.bgImage, { paddingTop: top + 10 }]}
      >
        <Block flex={1}>
          <Block flex={false} style={styles.headerContainer}>
            <Block
              flex={false}
              row
              between
              center
              style={{
                alignItems: "flex-end",
              }}
            >
              <TouchableOpacity
                style={{ width: 32, height: 32 }}
                onPress={() => navigation.goBack()}
              >
                <BackIcon height={32} width={32} />
              </TouchableOpacity>
              <LandingLogo
                color={colors.logoColor}
                height={perfectSize(60)}
                width={perfectSize(100)}
              />
              <View style={{ height: 32, width: 32 }} />
            </Block>
          </Block>
          <Block flex={false} style={styles.pageTitle}>
            <Text medium size={responsiveScale(28)} color={colors.logoColor}>
              {title}
            </Text>
          </Block>
          <Block flex={1} style={styles.infoContainer}>
            <EditableField
              label={label}
              value={value}
              setValue={setValue}
              isGenderField={label === "Gender"}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                consoleLog("Value sesnding:", value);
                await handleBirthDayDetail(value);
                // await handleBirthDayDetail(value);
              }}
            >
              {isLoading ? (
                <Block flex={false}>
                  <ActivityIndicator size={25} color={colors.black} />
                </Block>
              ) : (
                <Text medium size={responsiveScale(16)} color={colors.logoColor}>
                  {i18n.t("Save")}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={navigation.goBack}
            >
              <Text medium size={responsiveScale(16)} color={colors.white}>
                {/* Cancel */}
                {i18n.t("Cancel")}
              </Text>
            </TouchableOpacity>
          </Block>

        </Block>
      </ImageBackground>
    </Block>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: perfectSize(16),
  },
  pageTitle: {
    paddingHorizontal: perfectSize(16),
    marginTop: perfectSize(24),
  },
  infoContainer: {
    marginTop: perfectSize(20),
    paddingHorizontal: perfectSize(16),
  },
  infoRow: {
    borderRadius: perfectSize(8),
    marginBottom: perfectSize(15),
    // backgroundColor:'red',
    justifyContent: "space-between",
    alignItems: "center",
  },
  fieldTextContainer: {
    flex: 1,
  },
  valueText: {
    marginTop: perfectSize(4),
    fontSize: responsiveScale(16),
  },
  PasswordFieldValueText: {
    fontSize: responsiveScale(16),
    marginRight: perfectSize(20),
    flex: 1,
  },
  textInput: {
    color: colors.white,
  },
  genderOption: {
    backgroundColor: "#FFFFFF1A",
    borderRadius: perfectSize(8),
    paddingVertical: perfectSize(15),
    paddingHorizontal: perfectSize(20),
    marginBottom: perfectSize(10),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectedGenderOption: {
    borderWidth: 1,
    borderColor: colors.white,
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: perfectSize(8),
    paddingVertical: perfectSize(10),
    paddingHorizontal: perfectSize(20),
    alignItems: "center",
    marginTop: perfectSize(10),
    height: perfectSize(48),
  },
  cancelButton: {
    borderRadius: perfectSize(8),
    paddingVertical: perfectSize(10),
    paddingHorizontal: perfectSize(20),
    alignItems: "center",
    backgroundColor: "#FFFFFF33",
    marginTop: perfectSize(10),
    height: perfectSize(48),
  },
  changpasswordlButton: {
    borderRadius: perfectSize(8),
    paddingVertical: perfectSize(10),
    paddingHorizontal: perfectSize(20),
    alignItems: "center",
    backgroundColor: colors.lightPinkBorderColor,
    marginTop: perfectSize(10),
    height: perfectSize(48),
  },
  passwordInput: {
    height: perfectSize(40),
  },
  forgotPasswordButton: {
    marginBottom: perfectSize(10),
  },
  passwordContainer: {
    // flexDirection: "row",
    // alignItems: "center",
  },
  hidePasswordIcon: {
    right: perfectSize(5),
    padding: perfectSize(10),
  },
});

export default BirthDayDetailEdit;
