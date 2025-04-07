import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import { Backgrounds } from "../../data/background";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackIcon } from "../../icons/back-icon/BackIcon";
import { Formik } from "formik";
import Input from "../../components/input/Input";
import moment from "moment";
import ZoulIcon from "../../assets/icons/zoul-icon.svg";
import CustomReminder from "../../components/reminder/CustomReminder";
import HoroscopeIcon from "../../assets/icons/horoscope-icon.svg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { isIOS } from "../../utils/platform";
import { reminder, updateProfile } from "../../resources/baseServices/auth";
import { useModal } from "../../context/ModalContext";
import { ErrorDialog } from "../../components/modal/Modal";
import { dateToTime } from "../../helpers/date-converter";
import { months } from "../../components/modal/MonthsData";
import { fetchHoroScopeReminder } from "../../store/settings/setting";
import { useDispatch } from "react-redux";
import { setAuthTokenAction } from "../../store/auth";
import {
  ERROR_CONTACT_SUPPORT_MESSAGE,
  ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
} from "../../constants/errors";
import i18n from "../../translations/i18n";

const BirthDayDetail = ({ navigation, route }) => {
  const [isHoroscopeEnabled, setIsHoroscopeEnabled] = useState(false);
  const dispatch = useDispatch();
  const [isIsLoading, setIsLoading] = useState(false); // DatePicker open state
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const modal = useModal();
  const formRef = useRef();
  const isCheckSettingOrHomePage =
    route?.params?.isSetting || route?.params?.isExplore;
  const isReminderAndLoginPage =
    route?.params?.isReminderListLength &&
    route?.params?.isBirthDayPageViaLogin;

  const { top, bottom } = useSafeAreaInsets();

  useEffect(() => {
    if (isCheckSettingOrHomePage && route?.params?.birthday) {
      const birthdayMonth = route?.params?.birthday.split("-")?.[0];
      const birthDay = route?.params?.birthday.split("-")?.[1];
      const month = months[birthdayMonth - 1];
      formRef.current.setFieldValue("birthDay", birthDay);
      formRef.current.setFieldValue("birthMonth", month?.fullName);
      formRef.current.setFieldValue("fullDate", `${month?.name}-${birthDay}`);
    }
    if (isCheckSettingOrHomePage && route?.params?.horoscopeReminder) {
      setIsHoroscopeEnabled(route?.params?.horoscopeReminder?.[0]?.toggle);
      setTime(route?.params?.horoscopeReminder?.[0]?.time);
    }
  }, [isCheckSettingOrHomePage]);

  const toggleSwitch = () =>
    setIsHoroscopeEnabled((previousState) => !previousState);

  const handleBirthDayDetail = useCallback(async (values) => {
    setIsLoading(true);
    // const birthDay = values?.birthDay?.padStart(2, "0");
    // const findMonthNumber = months.find(
    //   (month) => month.fullName === values?.birthMonth
    // );
    // const data = {
    //   birthDate: `${findMonthNumber?.number}-${birthDay}`,
    // };
    const data = {
      birthDate: values,
    };
    try {
      await updateProfile(
        data,
        route?.params?.isBirthDayPageViaLogin
          ? false
          : !isCheckSettingOrHomePage
      );
      route?.params?.isExplore && navigation.goBack();
      route?.params?.isSetting &&
        navigation.navigate("Personalinfo", {
          birthDate: `${findMonthNumber?.number}-${birthDay}`,
        });
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

  const handleNavigation = async (isSkip, isBirthDayPageViaLogin) => {
    if (route?.params?.isBirthDayPageViaLogin) {
      if (isReminderAndLoginPage) {
        navigation.navigate("Reminder", {
          isBirthDayPageViaLogin: route?.params?.isBirthDayPageViaLogin,
          isReminderListLength: route?.params?.isReminderListLength,
        });
      } else {
        dispatch(setAuthTokenAction(route?.params?.authToken));
      }
    } else if (isSkip && !isBirthDayPageViaLogin) {
      navigation.navigate("ReminderIntro");
    }
  };

  const handleHoroscopeReminderBtn = async () => {
    setIsLoading(true);
    const data = {
      reminders: [
        {
          title: "Horoscope Reminder",
          enabled: isHoroscopeEnabled ?? false,
          time: time?.length ? time : dateToTime(date),
        },
      ],
    };
    try {
      const res = await reminder(
        data,
        route?.params?.isBirthDayPageViaLogin
          ? false
          : !isCheckSettingOrHomePage
      );
      if (res?.data?.status === "success") {
        isCheckSettingOrHomePage &&
          dispatch(
            fetchHoroScopeReminder(
              data?.reminders?.map((reminder) => ({
                payloadTitle: reminder.title,
                time: reminder.time,
                toggle: reminder.enabled,
              }))
            )
          );
        handleNavigation(isCheckSettingOrHomePage ? false : true);
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

  const handleHoroscopeTime = (time) => {
    setDate(time);
    setTime(dateToTime(time));
  };

  return (
    <ImageBackground
      source={
        route?.params?.isSetting
          ? require("../../assets/appImages/ExploreBackgroundImage.png")
          : Backgrounds.birthDayDetailBackground
      }
      style={[styles.background]}
    >
      <Block
        flex={1}
        style={{
          paddingTop: top,
          paddingBottom: bottom,
          backgroundColor: route?.params?.isSetting ? "" : "rgba(0,0,0,0.3)",
        }}
      >
        <Block flex={1} margin={[scaleSize(20)]}>
          <Block flex={false}>
            <Block flex={false} row between>
              <Block flex={false} width={"10%"}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <BackIcon size={perfectSize(22)} />
                </TouchableOpacity>
              </Block>
              {!isCheckSettingOrHomePage && (
                <Text
                  size={responsiveScale(18)}
                  regular
                  weight={400}
                  color={colors.kPinkRose}
                  onPress={async () =>
                    handleNavigation(
                      true,
                      route?.params?.isBirthDayPageViaLogin
                    )
                  }
                >
                  Skip
                </Text>
              )}
            </Block>
          </Block>
          <Block flex={false} margin={[scaleSize(16), 0, 0, 0]}>
            <ZoulIcon />
          </Block>
          <Block flex={false} margin={[scaleSize(16), 0, 0, 0]}>
            <Text
              size={responsiveScale(18)}
              style={styles.birthDaySubHeading}
              weight={400}
              color={colors.white}
            >
              To receive your personalized daily reading on how the stars may
            </Text>
            <Text
              size={responsiveScale(18)}
              style={styles.birthDaySubHeading}
              weight={400}
              color={colors.white}
            >
              influence your surrounding, please select your birth date and
              month.
            </Text>
          </Block>
          <Formik
            initialValues={{
              birthDay: "",
              birthMonth: "",
              fullDate: "",
            }}
            onSubmit={async (values) => {
              const daee = new Date(values)
              const month = String(values.fullDate.getUTCMonth() + 1).padStart(2, "0"); // Get month (0-based index)
              const day = String(values.fullDate.getUTCDate()).padStart(2, "0"); // Get day
              
              if (!day || !month) return null;
              // if (!values?.birthDay || !values?.birthMonth) return null;
              await handleBirthDayDetail(`${month}-${day}`);
              await handleHoroscopeReminderBtn();
            }}
            innerRef={formRef}
          >
            {({
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
              handleBlur,
            }) => {
              const handleDateChange = (date) => {
                // const day = text?.split?.("-")?.[1];
                // const month = text?.split("-")?.[0];
                // const findMonthName = months.find((m) => m.name === month);
                // setFieldValue("birthDay", day);
                // setFieldValue(
                //   "birthMonth",
                //   findMonthName ? findMonthName?.fullName : month
                // );
                setFieldValue("fullDate", date);
              };
              // const handleDateChange = (text) => {
              //   const day = text?.split?.("-")?.[1];
              //   const month = text?.split("-")?.[0];
              //   const findMonthName = months.find((m) => m.name === month);
              //   setFieldValue("birthDay", day);
              //   setFieldValue(
              //     "birthMonth",
              //     findMonthName ? findMonthName?.fullName : month
              //   );
              //   setFieldValue("fullDate", text);
              // };
              const isButtonDisabled = !values.birthDay || !values.birthMonth;

              return (
                <>
                  <KeyboardAwareScrollView
                    behavior={isIOS ? "padding" : "height"}
                    style={styles.keyboard}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                  >
                    <Block flex={1}>
                      <Block flex={false}>
                        <Block flex={false} margin={[scaleSize(28), 0]} top>
                          {/* <Block flex={false} margin={[0, 0, 0, 0]}>
                            <Input
                              placeholder={"Birth Date*"}
                              value={values.birthDay}
                              onChangeText={(text) => handleDateChange(text)}
                              onBlur={handleBlur("birthDay")}
                              errorMessage={touched.birthDay && errors.birthDay}
                              type="date"
                              mode="day"
                              dateValue={values.fullDate}
                              style={{
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                              }}
                            />
                          </Block>
                          <Block flex={false} margin={[scaleSize(10), 0, 0, 0]}>
                            <Input
                              placeholder={"Birth Month*"}
                              value={values.birthMonth}
                              onChangeText={(text) => handleDateChange(text)}
                              onBlur={handleBlur("birthMonth")}
                              errorMessage={
                                touched.birthMonth && errors.birthMonth
                              }
                              type="date"
                              mode="month"
                              dateValue={values.fullDate}
                              style={{
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                              }}
                            />
                          </Block> */}
                          <Block flex={false} margin={[0, 0, 0, 0]}>
                            <Input
                              placeholder={"Birthday"}
                              value={values.fullDate}
                              onChangeText={(text) => handleDateChange(text)}
                              onBlur={handleBlur("fullDate")}
                              datePicker={true}
                              errorMessage={touched.fullDate && errors.fullDate}
                              type="date"
                              mode="date"
                              // mode="day"
                              dateValue={values.fullDate}
                              style={{
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                              }}
                            />
                          </Block>
                        </Block>
                      </Block>
                      <Block flex={false}>
                        <Block flex={false}>
                          <Text
                            size={responsiveScale(18)}
                            weight={400}
                            regular
                            color={colors.white}
                          >
                            Please set the time you wish to
                          </Text>
                          <Text
                            size={responsiveScale(18)}
                            weight={400}
                            regular
                            color={colors.white}
                          >
                            received your daily personalized horoscope.
                          </Text>
                        </Block>
                        <Block flex={false} margin={[scaleSize(16), 0]}>
                          <CustomReminder
                            key={route?.params?.horoscopeReminder?.[0]?.toggle}
                            toggleSwitch={toggleSwitch}
                            value={isHoroscopeEnabled}
                            reminderName={"Horoscope"}
                            icon={<HoroscopeIcon />}
                            handleChange={handleHoroscopeTime}
                            date={date}
                            reminderTime={time ?? ""}
                            marginOfTime={[
                              scaleSize(10),
                              0,
                              scaleSize(10),
                              scaleSize(15),
                            ]}
                          />
                        </Block>
                      </Block>
                    </Block>
                  </KeyboardAwareScrollView>
                  <Block flex={false}>
                    <Block flex={false} margin={[scaleSize(10), 0, 0, 0]}>
                      <TouchableOpacity
                        style={[
                          styles.saveAndSkipButton,
                          {
                            backgroundColor: isButtonDisabled
                              ? "rgba(255, 255, 255, 0.3)" // Disabled color
                              : colors.buttonBgColor, // Enabled color
                          },
                        ]}
                        disabled={isIsLoading}
                        onPress={handleSubmit}
                      >
                        {isIsLoading ? (
                          <Block flex={false}>
                            <ActivityIndicator size={25} color={colors.white} />
                          </Block>
                        ) : (
                          <Text
                            size={responsiveScale(14)}
                            weight={500}
                            regular
                            color={colors.white}
                          >
                            {i18n.t("Save")}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </Block>
                    {!isCheckSettingOrHomePage && (
                      <Block flex={false} margin={[scaleSize(10), 0, 0, 0]}>
                        <TouchableOpacity
                          style={[
                            styles.saveAndSkipButton,
                            { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                          ]}
                          disabled={isIsLoading}
                          onPress={() =>
                            handleNavigation(
                              true,
                              route?.params?.isBirthDayPageViaLogin
                            )
                          }
                        >
                          <Text
                            size={responsiveScale(14)}
                            weight={500}
                            regular
                            color={colors.white}
                          >
                            Skip for now
                          </Text>
                        </TouchableOpacity>
                      </Block>
                    )}
                  </Block>
                </>
              );
            }}
          </Formik>
        </Block>
      </Block>
    </ImageBackground>
  );
};

export default BirthDayDetail;

const styles = StyleSheet.create({
  background: { flex: 1, alignContent: "center" },
  saveAndSkipButton: {
    height: perfectSize(50),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.buttonBgColor,
    borderRadius: perfectSize(8),
    width: "100%",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject, // Full-screen overlay
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  container: {
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: perfectSize(8),
    // paddingVertical: perfectSize(6),
  },
  animatedContainer: {
    overflow: "hidden",
    marginTop: 10,
  },
  keyboard: {
    flex: 1,
  },
});
