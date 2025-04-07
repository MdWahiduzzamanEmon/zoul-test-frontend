import React, { useState, useEffect, useCallback } from "react";
import {
  ImageBackground,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../resources/baseServices/auth";
import { setUserProfile } from "../../store/user/user";
import { useFocusEffect } from "@react-navigation/native";
import { useModal } from "../../context/ModalContext";
import { ErrorDialog } from "../../components/modal/Modal";
import { months } from "../../components/modal/MonthsData";
import { fetchHoroScopeReminder } from "../../store/settings/setting";
import {
  deleteUserAccount,
  fetchUserHoroscopeReminders,
} from "../../resources/baseServices/app";
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import { removeAuthTokenAction } from "../../store/auth";
import { clearAsyncStorage } from "../../helpers/auth";
import i18n from "../../translations/i18n";
import {
  ERROR_CONTACT_SUPPORT_MESSAGE,
  ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
} from "../../constants/errors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LandingLogo } from "../../icons/landing/landing-logo";
import { SCREEN_WIDTH } from "../../constants/metrics";

const Personalinfo = ({ route, navigation }) => {
  const { top } = useSafeAreaInsets();
  const user = useSelector((state) => state?.userReducer?.userProfile);
  const horoscopeReminder = useSelector(
    (state) => state?.settingReducer?.userHoroscopeReminders
  );
  const dispatch = useDispatch();
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthday: null,
    gender: null,
    password: "User-Password",
    deleteAccount: "",
  });
  const modal = useModal();
  const fromPasswordSecurity = route.params?.fromPasswordSecurity || false;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [isDeleteSuccessful, setIsDeleteSuccessful] = useState(false);
  const [provider, setProvider] = useState(null);
  // const provider = "google"

  consoleLog("My birth Date:", user?.birthDate);

  const handleUserProfile = useCallback(async () => {
    try {
      const res = await getUserProfile();
      consoleLog("responsePer", res?.data);
      if (res?.status == 200) {
        setProvider(res?.data?.providers);
        dispatch(setUserProfile(res?.data));
      }
    } catch (error) {
      console.error("error handleUserProfile =--->", error);
      modal.show(ErrorDialog, {
        messageTitle:
          error?.response?.data?.errorTitle ??
          ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
        message:
          error?.response?.data?.errorBody ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    }
  }, []);

  const fetchHoroscopeReminders = useCallback(async () => {
    try {
      const res = await fetchUserHoroscopeReminders();
      if (res?.data) {
        const { reminders } = res?.data;
        const reminderList = Object.keys(reminders).map((key) => ({
          payloadTitle: key,
          time: reminders[key].time,
          toggle: reminders[key].enabled,
        }));
        dispatch(fetchHoroScopeReminder(reminderList));
      }
    } catch (error) {
      console.error("error fetching user horoscope reminders =--->", error);
      modal.show(ErrorDialog, {
        message:
          error?.response?.data?.message ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    }
  }, []);

  const handleDeleteAccountBtn = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await deleteUserAccount();
      if (res?.data?.status === "success") {
        // dispatch(removeAuthTokenAction());
        // await clearAsyncStorage();
        // navigation.goBack();
        setResultMessage(res?.data?.message);
        setIsDeleteSuccessful(true);
        setIsModalVisible(false);
        // setTimeout(() => {
        setIsResultModalVisible(true);
        // }, 2000);
      }
    } catch (error) {
      console.error("error delete user account =--->", error);
      modal.show(ErrorDialog, {
        message:
          error?.response?.data?.message ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      handleUserProfile();
    }, [handleUserProfile])
  );

  useEffect(() => {
    fetchHoroscopeReminders();
  }, []);

  useEffect(() => {
    const {
      firstName,
      lastName,
      updatedEmail,
      birthDate,
      gender,
      updatedPassword,
      updateddeleteAccount,
    } = route.params || {};
    const birthdayMonth = user?.birthDate?.split("-")?.[0];
    const birthDay = user?.birthDate?.split("-")?.[1];
    const month = months[birthdayMonth - 1];
    setPersonalInfo((prevInfo) => ({
      ...prevInfo,
      firstName: firstName || prevInfo?.firstName,
      lastName: lastName || prevInfo?.lastName,
      email: updatedEmail || prevInfo?.email,
      birthday: birthDate
        ? `${month?.fullName} ${birthDay}`
        : prevInfo.birthday,
      gender: gender || prevInfo?.gender,
      password: updatedPassword || prevInfo.password,
      deleteAccount: updateddeleteAccount || prevInfo.deleteAccount,
    }));
  }, [route.params]);

  useEffect(() => {
    if (route?.params?.birthDate) {
      const birthdayMonth = route?.params?.birthDate.split("-")?.[0];
      const birthDay = route?.params?.birthDate.split("-")?.[1];
      const month = months[birthdayMonth - 1];
      setPersonalInfo((prevInfo) => ({
        ...prevInfo,
        birthday: `${month?.fullName} ${birthDay}` ?? prevInfo.birthday,
      }));
    }
  }, [route?.params?.birthDate]);

  useEffect(() => {
    if (route?.params?.updatedEmail) {
      setPersonalInfo((prevInfo) => ({
        ...prevInfo,
        email: route?.params?.updatedEmail,
      }));
    }
  }, [route?.params?.updatedEmail]);

  // const formatDate = (date) => {
  //   if (!date) return "None";
  //   return new Date(date).toLocaleDateString("en-GB", {
  //     day: "2-digit",
  //     month: "long",
  //     year: "numeric",
  //   });
  // };

  const cancelDelete = () => {
    setIsModalVisible(false);
  };
  const handleCancle = () => {
    setIsModalVisible(false);
  };

  const confirmDelete = async () => {
    console.log("deleted user account");
    await handleDeleteAccountBtn();
  };

  const renderEditableField = (label, value, isEditable) => {
    const getDisplayValue = (label, value) => {
      if (label === "Gender" && value) return i18n.t(value);
      return value || "";
      // return value || i18n.t("None");
    };

    // if (label === "Username" && !value) return;
    // if (label === "Phone number" && !value) return;
    return label === "" ? (
      <Block row flex={false} style={{}}>
        <Block
          row
          flex={false}
          style={[
            styles.fieldTextContainer,
            styles.infoRow,
            {
              width: SCREEN_WIDTH * 0.18,
              height: SCREEN_WIDTH * 0.12,
              marginLeft: perfectSize(5),
            },
          ]}
        >
          <Text regular size={responsiveScale(12)} color={colors.logoColor}>
          
            {i18n.t(label)}
          </Text>
          {label !== "Delete Account" && (
            <Text
              size={responsiveScale(17)}
              color={colors.white}
              style={styles.valueText}
              regular
            >
              {getDisplayValue(label, value)}
              {/* {label === i18n.t("Birthday") ? formatDate(value) : value || "None"} */}
            </Text>
          )}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (label !== "Delete Account") {
                if (label === "Link your social accounts") {
                  navigation.navigate("PersonalInfoeditScreen", {
                    title: i18n.t("Password & Security"),
                    data: value,
                    label: label,
                    fromPasswordSecurity: true,
                  });
                } else if (label === "Birthday") {
                  navigation.navigate("BirthDayDetailEdit", {
                    isSetting: true,
                    birthday: user?.birthDate,
                    horoscopeReminder: horoscopeReminder,
                    title:
                      label ==
                      `${value ? i18n.t("Edit") : i18n.t("Add")} ${i18n.t(
                        label
                      )}`,
                    // title: i18n.t("Birthday"),
                    label: label,
                    data: value,
                  });
                }
                // else if (label === "Birthday") {
                //   navigation.navigate("BirthDayDetail", {
                //     isSetting: true,
                //     birthday: user?.birthDate,
                //     horoscopeReminder: horoscopeReminder,
                //   });
                // }
                else if (label === "Password") {
                  navigation.navigate("PersonalInfoeditScreen", {
                    title: i18n.t("Password & Security"),
                    data: value,
                    label: label,
                    fromPasswordSecurity: true,
                  });
                } else {
                  navigation.navigate("PersonalInfoeditScreen", {
                    title: "Phone Number"
                      ? `${value ? i18n.t("Edit") : i18n.t("Add")} Phone Number`
                      : `${value ? i18n.t("Edit") : i18n.t("Add")} ${i18n.t(
                          label
                        )}`,
                    // title: `${value ? i18n.t("Edit") : i18n.t("Add")} ${i18n.t(label)}`,
                    // title: `${i18n.t(label)} ${i18n.t("Edit")}`,
                    data: value,
                    label: label,
                  });
                }
              } else if (label === "Delete Account") {
                setIsModalVisible(true);
              }
            }}
          >
            <Text medium size={responsiveScale(10)} color={colors.white}>
              {label === "Password"
                ? provider === null
                  ? i18n.t("Manage")
                  : ""
                : label === "Link your social accounts"
                ? i18n.t("Manage")
                : label === "Delete Account"
                ? i18n.t("Delete")
                : value
                ? // : (value || label === "Username")
                  i18n.t("Edit").toUpperCase()
                : i18n.t("Add").toUpperCase()}
            </Text>
          </TouchableOpacity>
        </Block>
      </Block>
    ) : (
      <Block flex={false} row style={styles.infoRow}>
        <Block flex={false} style={styles.fieldTextContainer}>
          <Text regular size={responsiveScale(12)} color={colors.logoColor}>
            {i18n.t(label)}
          </Text>
          {label !== "Delete Account" && (
            <Text
              size={responsiveScale(17)}
              color={colors.white}
              style={styles.valueText}
              regular
            >
              {getDisplayValue(label, value)}
              {/* {label === i18n.t("Birthday") ? formatDate(value) : value || "None"} */}
            </Text>
          )}
        </Block>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            if (label !== "Delete Account") {
              if (label === "Link your social accounts") {
                navigation.navigate("PersonalInfoeditScreen", {
                  title: i18n.t("Password & Security"),
                  data: value,
                  label: label,
                  fromPasswordSecurity: true,
                });
              } else if (label === "Birthday") {
                navigation.navigate("BirthDayDetailEdit", {
                  isSetting: true,
                  birthday: user?.birthDate,
                  horoscopeReminder: horoscopeReminder,
                  title: `${value ? i18n.t("Edit") : i18n.t("Add")} ${i18n.t(
                    label
                  )}`,
                  // title: i18n.t("Birthday"),
                  label: label,
                  data: null,
                  // data: value
                });
              }
              // else if (label === "Birthday") {
              //   navigation.navigate("BirthDayDetail", {
              //     isSetting: true,
              //     birthday: user?.birthDate,
              //     horoscopeReminder: horoscopeReminder,
              //   });
              // }
              else if (label === "Password") {
                navigation.navigate("PersonalInfoeditScreen", {
                  title: i18n.t("Password & Security"),
                  data: value,
                  label: label,
                  fromPasswordSecurity: true,
                });
              } else if (label === "Phone Number") {
                navigation.navigate("PersonalInfoeditScreen", {
                  title: "Phone Number"
                    ? `${value ? i18n.t("Edit") : i18n.t("Add")} Phone Number`
                    : `${value ? i18n.t("Edit") : i18n.t("Add")} ${i18n.t(
                        label
                      )}`,
                  // title: `${value ? i18n.t("Edit") : i18n.t("Add")} ${i18n.t(label)}`,
                  // title: `${i18n.t(label)} ${i18n.t("Edit")}`,
                  data: value,
                  label: label,
                });
              } else {
                navigation.navigate("PersonalInfoeditScreen", {
                  title: `${value ? i18n.t("Edit") : i18n.t("Add")} ${i18n.t(
                    label
                  )}`,
                  // title: `${value ? i18n.t("Edit") : i18n.t("Add")} ${i18n.t(label)}`,
                  // title: `${i18n.t(label)} ${i18n.t("Edit")}`,
                  data: value,
                  label: label,
                });
              }
            } else if (label === "Delete Account") {
              setIsModalVisible(true);
            }
          }}
        >
          <Text medium size={responsiveScale(10)} color={colors.logoColor}>
            {label === "Password"
              ? provider === null
                ? i18n.t("Manage")
                : ""
              : label === "Link your social accounts"
              ? i18n.t("Manage")
              : label === "Delete Account"
              ? i18n.t("Delete")
              : value
              ? // : (value || label === "Username")
                i18n.t("Edit").toUpperCase()
              : i18n.t("Add").toUpperCase()}
          </Text>
        </TouchableOpacity>

        {/* {
          (label !== "Email" || !personalInfo.email) &&
            // label !== "Username" &&
            label !== "Phone number" && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  if (label !== "Delete Account") {
                    if (label === "Link your social accounts") {
                      navigation.navigate("PersonalInfoeditScreen", {
                        title: i18n.t("Password & Security"),
                        data: value,
                        label: label,
                        fromPasswordSecurity: true,
                      });
                    }
                    else if (label === "Birthday") {
                      navigation.navigate("BirthDayDetailEdit", {
                        isSetting: true,
                        birthday: user?.birthDate,
                        horoscopeReminder: horoscopeReminder,
                        title: `${value?i18n.t("Edit"):i18n.t("Add")} ${i18n.t(label)}`,
                        // title: i18n.t("Birthday"),
                        label:label,
                        data:value
                      });
                    }
                    // else if (label === "Birthday") {
                    //   navigation.navigate("BirthDayDetail", {
                    //     isSetting: true,
                    //     birthday: user?.birthDate,
                    //     horoscopeReminder: horoscopeReminder,
                    //   });
                    // }
                    else if (label === "Password") {
                      navigation.navigate("PersonalInfoeditScreen", {
                        title: i18n.t("Password & Security"),
                        data: value,
                        label: label,
                        fromPasswordSecurity: true,
                      });
                    }
                    else {
                      navigation.navigate("PersonalInfoeditScreen", {
                        title: `${value?i18n.t("Edit"):i18n.t("Add")} ${i18n.t(label)}`,
                        // title: `${i18n.t(label)} ${i18n.t("Edit")}`,
                        data: value,
                        label: label,
                      });
                    }
                  } else if (label === "Delete Account") {
                    setIsModalVisible(true);
                  }
                }}
              >
                <Text medium size={responsiveScale(10)} color={colors.white}>
                  {( label === "Password")
                  ? 
                   ( provider === null )?
                  i18n.t("Manage"):""
                  :
                  label === "Link your social accounts" 
                    ? i18n.t("Manage")
                    : label === "Delete Account"
                      ? i18n.t("Delete")
                      : (value)
                      // : (value || label === "Username")
                        ? i18n.t("Edit")
                        : i18n.t("Add")
                        }
                </Text>
              </TouchableOpacity>
            )} */}
      </Block>
    );
  };

  const ResultModal = ({ isVisible, message, isSuccess, onContinue }) => {
    return (
      <Modal transparent visible={isVisible}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={onContinue}
        >
          <Block flex={false} style={styles.modalContent}>
            <Text
              size={responsiveScale(18)}
              color={isSuccess ? colors.white : colors.white}
              style={styles.modalText}
              regular
            >
              {message}
            </Text>
            <TouchableOpacity
              onPress={onContinue}
              style={styles.ContinueButton}
            >
              <Text size={responsiveScale(16)} color={colors.black}>
                {i18n.t("Continue")}
              </Text>
            </TouchableOpacity>
          </Block>
        </TouchableOpacity>
      </Modal>
    );
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
          <Block
            flex={false}
            row
            between
            center
            style={{
              alignItems: "flex-end",
              paddingHorizontal: perfectSize(16),
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
          <Block
            flex={false}
            style={{
              paddingHorizontal: perfectSize(16),
              marginTop: perfectSize(30),
            }}
          >
            <Text medium size={responsiveScale(28)} color={colors.logoColor}>
              {i18n.t("Personal Info")}
            </Text>
          </Block>
          <ScrollView>
            <Block flex={1} style={styles.infoContainer}>
              {renderEditableField("Username", user?.userName, true)}
              {renderEditableField("First name", personalInfo.firstName, true)}
              {renderEditableField("Last name", personalInfo.lastName, true)}
              {renderEditableField("Email", personalInfo.email, false)}
              {renderEditableField("Phone Number", user?.phoneNumber, true)}
              {renderEditableField("Birthday", personalInfo.birthday, false)}
              {renderEditableField("Gender", personalInfo.gender, false)}
              {/* {renderEditableField("Password", "***********", false)} */}
              {/* {renderEditableField(
              "Delete Account",
              personalInfo.deleteAccount,
              true
            )} */}
              {fromPasswordSecurity && (
                <>
                  {renderEditableField(
                    "Link your social accounts",
                    personalInfo.password,
                    true
                  )}
                </>
              )}
              <ConfirmationModal
                message={"Are you sure you want to delete your account?"}
                cancelDelete={cancelDelete}
                handleCancle={handleCancle}
                isModalVisible={isModalVisible}
                confirmDelete={confirmDelete}
                isLoading={isLoading}
              />
              <ResultModal
                isVisible={isResultModalVisible}
                message={resultMessage}
                isSuccess={isDeleteSuccessful}
                onContinue={async () => {
                  setIsResultModalVisible(false);
                  dispatch(removeAuthTokenAction());
                  await clearAsyncStorage();
                  navigation.goBack();
                }}
              />
            </Block>
          </ScrollView>
          {/* <Block
            flex={false}
            marginBottom={scaleSize(46)}
            center
            bottom
            style={{
              marginTop: 10,
            }}
          >
            <LandingLogo height={perfectSize(100)} width={perfectSize(100)} />
          </Block> */}
        </Block>
        {/* <Block flex={false} marginBottom={scaleSize(46)} center bottom>
          <LandingLogo height={perfectSize(100)} width={perfectSize(100)} />
        </Block> */}
      </ImageBackground>
    </Block>
  );
};

export default Personalinfo;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    // height: deviceHeight,
    // width: deviceWidth,
  },
  headerContainer: {
    paddingHorizontal: perfectSize(16),
  },
  infoContainer: {
    marginTop: perfectSize(20),
    paddingHorizontal: perfectSize(16),
  },
  infoRow: {
    backgroundColor: "#FFFFFF1A",
    borderRadius: perfectSize(8),
    paddingVertical: perfectSize(8),
    paddingHorizontal: perfectSize(16),
    marginBottom: perfectSize(15),
    justifyContent: "space-between",
    alignItems: "center",
    // height: "10%",
  },
  fieldTextContainer: {
    flex: 1,
  },
  valueText: {
    marginTop: perfectSize(4),
  },
  editButton: {
    paddingHorizontal: perfectSize(12),
    paddingVertical: perfectSize(6),
    borderRadius: perfectSize(6),
  },
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
  ContinueButton: {
    backgroundColor: colors.white,
    paddingVertical: perfectSize(10),
    borderRadius: perfectSize(8),
    alignItems: "center",
    marginVertical: perfectSize(10),
    width: "100%",
  },
});
