import React, { useState, useCallback } from "react";
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import DatePicker from "react-native-date-picker";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import BackIcon from "../../assets/appImages/svgImages/BackIcon";
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
import PhoneInput from "react-native-phone-number-input";

const GenderOption = ({ option, selectedGender, setSelectedGender }) => (
  <TouchableOpacity
    style={[
      styles.genderOption,
      selectedGender === option && styles.selectedGenderOption,
    ]}
    onPress={() => setSelectedGender(option)}
  >
    <Text
      regular
      size={responsiveScale(14)}
      color={selectedGender === option ? colors.logoColor : colors.white}
    >
      {i18n.t(option)}
    </Text>
    {selectedGender === option && (
      <Image
        source={require("../../assets/appImages/Vector.png")}
        resizeMode="contain"
        style={{ height: 20, width: 20 }}
      />
    )}
  </TouchableOpacity>
);

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
  const [date, setDate] = useState(value);
  const [open, setOpen] = useState(false);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setValue(selectedDate);
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const genderOptions = [
    "I identify as female",
    "I identify as male",
    "I identify as non-binary",
    "Prefer not to answer",
  ];

  return (
    <Block flex={false} row style={[styles.infoRow]}>
      <Block flex={false} style={styles.fieldTextContainer}>
        {/* {value !== "" && (
          <Text regular size={responsiveScale(10)} color={colors.white}>
            {label}
          </Text>
        )} */}
        {label === "Birthday" ? (
          <>
            <TextInput
              style={[styles.valueText, styles.textInput]}
              value={formatDate(date)}
              placeholder={`Select ${label.toLowerCase()}`}
              onPressIn={() => setOpen(true)}
              editable={false}
            />
            <DatePicker
              modal
              open={open}
              date={date}
              onConfirm={(selectedDate) => {
                setOpen(false);
                handleDateChange(selectedDate);
              }}
              onCancel={() => setOpen(false)}
              mode="date"
            />
          </>
        ) : isGenderField ? (
          <Block flex={false}>
            {genderOptions.map((option) => (
              <GenderOption
                key={option}
                option={option}
                selectedGender={selectedGender}
                setSelectedGender={setSelectedGender}
              />
            ))}
          </Block>
        ) : label === "Phone Number" ? (
          <PhoneInput
            // placeholderStyle={{
            //   fontFamily: font.regular,
            //   fontSize: scaleSize(18),
            // }}
            // ref={phoneInput}
            value={""}
            defaultCode="TH" // Default country code
            layout="second"
            onChangeText={setValue}
            // onChangeText={handleChange("phoneNumber")}
            onChangeFormattedText={(text) => {
              // setFieldError("phoneNumber", "");
              // handleChange("phoneNumber", text);
              // setFieldValue("phoneNumber", text);
              // setFieldValue("email", "");
              setValue(text);
            }}
            containerStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              width: "100%",
              height: scaleSize(56),
              borderRadius: 8,
              marginTop: scaleSize(9),
            }}
            textContainerStyle={{
              backgroundColor: "transparent",
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
              borderLeftWidth: 2,
              borderLeftColor: "rgba(255, 255, 255, 0.3)",
              // backgroundColor: "white",
            }}
            codeTextStyle={{
              color: colors.white,
            }}
            textInputStyle={{
              height: scaleSize(56),
              color: colors.white,
            }}
            placeholder={i18n.t("Phone Number")}
            textInputProps={{
              placeholderTextColor: colors.white,
              // style: {
              //   fontFamily: font.regular,
              //   fontSize: scaleSize(17),
              //   color: colors.white,
              // },
            }}
          />
        ) : (
          <Block
            flex={false}
            style={{
              paddingVertical: isGenderField ? null : perfectSize(8),
            }}
          >
            <Input
              placeholder={
                label
                  ? `${isPasswordField ? label : i18n.t(label)}`
                  : "Enter value"
              }
              value={value}
              onChangeText={setValue}
              onBlur={onBlur}
              type={isPasswordField && "password"}
              // secureTextEntry={isPasswordField && !isPasswordVisible}
              style={{
                backgroundColor: "#FFFFFF1A",
              }}
              placeholderStyle={{
                color: colors.logoColor,
              }}
              keyboardType={label == "Phone Number" ? "phone-pad" : "default"}
            />
            {/* {isPasswordField && value !== "" && (
              <TouchableOpacity onPress={togglePasswordVisibility}>
                {!isPasswordVisible ? (
                  <HidePasswordIcon
                    height={24}
                    width={24}
                    style={styles.hidePasswordIcon}
                  />
                ) : (
                  <ShowPasswordIcon
                    height={24}
                    width={24}
                    style={styles.hidePasswordIcon}
                  />
                )}
              </TouchableOpacity>
            )} */}
          </Block>
        )}
      </Block>
    </Block>
  );
};
const PersonalInfoEditScreen = ({ route, navigation }) => {
  const { title, data, label } = route.params;
  const { top } = useSafeAreaInsets();
  const user = useSelector((state) => state?.userReducer?.userProfile);
  const initialValue = label === i18n.t("Birthday") ? new Date(data) : data;
  const [value, setValue] = useState(initialValue);
  const [selectedGender, setSelectedGender] = useState(
    label === "Gender" ? data : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const modal = useModal();

  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPasswordVisible: false,
    newPasswordVisible: false,
    retypeNewPasswordVisible: false,
  });

  // const togglePasswordVisibility = (field) => {
  //   setPasswordVisibility((prevState) => ({
  //     ...prevState,
  //     [field]: !prevState[field],
  //   }));
  // };

  const updatedFieldMap = {
    "First name": "firstName",
    "Last name": "lastName",
    Email: "updatedEmail",
    Birthday: "updatedBirthday",
    Gender: "gender",
    "Password & Security": "updatedPassword",
    "Phone Number": "phoneNumber",
    Username: "userName",
  };

  const handleUpdateUserEmail = async (values) => {
    const data = {
      email: values,
    };
    try {
      const response = await updateUserEmail(data);
      if (response?.data?.status === "success") {
        // navigation.navigate("VerifyEmail", {
        //   isSetting: true,
        //   email: values,
        // });
        navigation.navigate("Personalinfo", { updatedEmail: values });
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
      console.log("error", error);
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

  const handleChangePasswordBtn = useCallback(async (values) => {
    setIsLoading(true);
    const data = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };
    try {
      const res = await updateUserPassword(data);
      if (res?.data?.status === "success") {
        modal.show(CommonDialog, {
          message: "Your password has been updated successfully.",
          title: "Success",
          duration: 1000,
          onClose: () => {
            modal.close();
            navigation.goBack();
          },
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  const PasswordSecuritySchema = yup.object().shape({
    newPassword: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf(
        [yup.ref("newPassword"), null],
        "Passwords do not match. Please try again."
      ),
  });

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
            {title === i18n.t("Password & Security") ? (
              <>
                <Formik
                  initialValues={{
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  }}
                  validationSchema={PasswordSecuritySchema}
                  onSubmit={async (values) => {
                    await handleChangePasswordBtn(values);
                  }}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                  }) => {
                    const isButtonDisabled =
                      !values?.newPassword ||
                      !values?.oldPassword ||
                      !values?.confirmPassword;
                    return (
                      <>
                        <EditableField
                          label={i18n.t("Current password")}
                          value={values?.oldPassword}
                          setValue={handleChange("oldPassword")}
                          isPasswordField
                          isPasswordVisible={
                            passwordVisibility?.currentPasswordVisible
                          }
                          // togglePasswordVisibility={() =>
                          //   togglePasswordVisibility("currentPasswordVisible")
                          // }
                        />
                        <EditableField
                          label={i18n.t("New password")}
                          value={values?.newPassword}
                          setValue={handleChange("newPassword")}
                          isPasswordField
                          onBlur={handleBlur("newPassword")}
                          isPasswordVisible={
                            passwordVisibility?.newPasswordVisible
                          }
                          // togglePasswordVisibility={() =>
                          //   togglePasswordVisibility("newPasswordVisible")
                          // }
                        />
                        {touched?.newPassword && errors?.newPassword ? (
                          <Text
                            size={responsiveScale(12)}
                            marginTop={-5}
                            marginBottom={8}
                            color={colors.white}
                          >
                            {errors?.newPassword}
                          </Text>
                        ) : null}
                        <EditableField
                          label={i18n.t("Retype new password")}
                          value={values?.confirmPassword}
                          setValue={handleChange("confirmPassword")}
                          isPasswordField
                          onBlur={handleBlur("confirmPassword")}
                          isPasswordVisible={
                            passwordVisibility?.retypeNewPasswordVisible
                          }
                          marginTop={-5}
                          marginBottom={8}
                          // togglePasswordVisibility={() =>
                          //   togglePasswordVisibility("retypeNewPasswordVisible")
                          // }
                        />
                        <TouchableOpacity
                          style={{
                            marginBottom: 15,
                          }}
                          onPress={() => {
                            navigation.navigate("ForgotPassword", {
                              isForEmailVerify: true,
                              title: "Verify your email",
                            });
                          }}
                        >
                          <Text style={[styles.valueText, styles.textInput]}>
                            Forgot password?
                          </Text>
                        </TouchableOpacity>
                        {touched?.confirmPassword && errors?.confirmPassword ? (
                          <Text
                            size={responsiveScale(12)}
                            marginTop={-5}
                            marginBottom={8}
                            color={colors.white}
                          >
                            {errors?.confirmPassword}
                          </Text>
                        ) : null}
                        <TouchableOpacity
                          style={[
                            styles.changpasswordlButton,
                            {
                              backgroundColor: isButtonDisabled
                                ? "rgba(255, 255, 255, 0.3)"
                                : colors.white,
                            },
                          ]}
                          onPress={handleSubmit}
                          disabled={isButtonDisabled}
                        >
                          {isLoading ? (
                            <Block flex={false}>
                              <ActivityIndicator
                                size={25}
                                color={colors.black}
                              />
                            </Block>
                          ) : (
                            <Text
                              medium
                              size={responsiveScale(16)}
                              style={{
                                color: colors.black,
                              }}
                            >
                              {i18n.t("Change password")}
                            </Text>
                          )}
                        </TouchableOpacity>
                      </>
                    );
                  }}
                </Formik>
              </>
            ) : (
              <EditableField
                label={label}
                value={value}
                setValue={setValue}
                isGenderField={label === "Gender"}
                selectedGender={selectedGender}
                setSelectedGender={setSelectedGender}
              />
            )}
            {title !== i18n.t("Password & Security") && (
              <>
                <TouchableOpacity style={styles.button} onPress={onSave}>
                  {isLoading ? (
                    <Block flex={false}>
                      <ActivityIndicator size={25} color={colors.black} />
                    </Block>
                  ) : (
                    <Text
                      medium
                      size={responsiveScale(16)}
                      color={colors.logoColor}
                    >
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
              </>
            )}
          </Block>
        </Block>
      </ImageBackground>
    </Block>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    // height: deviceHeight,
    // width: deviceWidth,
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
    // marginTop: perfectSize(4),
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
    borderColor: colors.logoColor,
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

export default PersonalInfoEditScreen;
