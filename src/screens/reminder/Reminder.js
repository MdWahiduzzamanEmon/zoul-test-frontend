import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Backgrounds } from "../../data/background";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import Block from "../../components/utilities/Block";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackIcon } from "../../icons/back-icon/BackIcon";
import ZoulIcon from "../../assets/icons/zoul-icon.svg";
import Text from "../../components/utilities/Text";
import { colors } from "../../styles/theme";
import NotificationIcon from "../../assets/icons/notification.svg";
import { reminderInitialData } from "./ReminderData";
import CustomReminder from "../../components/reminder/CustomReminder";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { isIOS } from "../../utils/platform";
import { useModal } from "../../context/ModalContext";
import { ErrorDialog } from "../../components/modal/Modal";
import { setAuthTokenAction } from "../../store/auth";
import {
  getAuthToken,
  getSignupUserAuthToken,
  removeSignupUserAuthToken,
  setAuthToken,
} from "../../helpers/auth";
import { reminder } from "../../resources/baseServices/auth";
import { dateToTime } from "../../helpers/date-converter";
import { useDispatch } from "react-redux";
import { setIntroVideoVisibility } from "../../store/introvideo";
import {
  ERROR_CONTACT_SUPPORT_MESSAGE,
  ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
} from "../../constants/errors";
import i18n from "../../translations/i18n";

const ReminderDetail = ({ navigation, route }) => {
  const [reminderList, setReminderList] = useState(reminderInitialData);
  const [isLoading, setIsLoading] = useState(false);
  const modal = useModal();
  const { top, bottom } = useSafeAreaInsets();
  const dispatch = useDispatch();

  useEffect(() => {
    if (route?.params?.isSetting) {
      const finalReminders = reminderInitialData?.map((reminder) => {
        const findReminder = route?.params?.reminders?.find(
          (r) => r?.payloadTitle === reminder?.payloadTitle
        );
        reminder.time = findReminder?.time ?? reminder?.time;
        reminder.toggle = findReminder?.toggle ?? reminder?.toggle;
        reminder.payloadTitle =
          findReminder?.payloadTitle ?? reminder?.payloadTitle;
        return reminder;
      });
      setReminderList(finalReminders);
    }
  }, [route?.params?.isSetting]);

  useEffect(() => {
    if (!route?.params?.isSetting) {
      const date = new Date();
      const finalReminders = reminderInitialData?.map((reminder) => {
        reminder.time = dateToTime(date);
        reminder.toggle = false;
        return reminder;
      });
      setReminderList(finalReminders);
    }
  }, [route?.params?.isSetting]);

  const toggleSwitch = (id) => {
    setReminderList((prevReminders) =>
      prevReminders.map((reminder) =>
        reminder.id === id
          ? { ...reminder, toggle: !reminder.toggle }
          : reminder
      )
    );
  };

  const onTimeChange = (date, selectedReminderId) => {
    if (selectedReminderId !== null) {
      setReminderList((prevReminders) =>
        prevReminders.map((reminder) =>
          reminder.id === selectedReminderId
            ? {
                ...reminder,
                date: date,
                time: reminder.toggle ? dateToTime(date) : "",
              }
            : reminder
        )
      );
    }
  };

  const getAuthTokenBasedOnRoute = async (isBirthDayPageViaLogin) => {
    if (isBirthDayPageViaLogin) {
      const token = await getAuthToken();
      return token;
    } else {
      const { token } = JSON.parse(await getSignupUserAuthToken());
      return token;
    }
  };

  const handleReminderBtn = useCallback(async () => {
    setIsLoading(true);
    const reminders = reminderList?.map((reminder) => ({
      title: reminder.payloadTitle,
      time: reminder.time,
      enabled: reminder.toggle,
    }));
    const data = {
      reminders,
    };
    try {
      const res = await reminder(
        data,
        route?.params?.isBirthDayPageViaLogin
          ? false
          : !route?.params?.isSetting
      );
      if (res?.data?.status === "success") {
        dispatch(setIntroVideoVisibility(false));
        if (route?.params?.isSetting) return navigation.goBack();
        const permToken = await getAuthTokenBasedOnRoute(
          route?.params?.isBirthDayPageViaLogin
        );
        dispatch(setAuthTokenAction(permToken));
        await setAuthToken(permToken);
        await removeSignupUserAuthToken();
      }
    } catch (error) {
      console.log("reminder api error:", error);
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
  }, [reminderList]);

  return (
    <ImageBackground
      source={Backgrounds.reminderDetailBg}
      style={[styles.background]}
    >
      <Block
        flex={1}
        style={{
          paddingTop: top,
          paddingBottom: bottom,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <Block flex={1} margin={[scaleSize(20)]}>
          <Block flex={false} width={"10%"}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <BackIcon size={perfectSize(22)} />
            </TouchableOpacity>
          </Block>
          <Block flex={false} margin={[scaleSize(16), 0, 0, 0]}>
            <ZoulIcon />
          </Block>
          <Block flex={false}>
            <Block
              flex={false}
              margin={[scaleSize(16), 0, 0, 0]}
              row
              center
              gap={3}
            >
              <Block flex={false}>
                <NotificationIcon />
              </Block>
              <Block flex={false}>
                <Text
                  size={responsiveScale(28)}
                  weight={500}
                  regular
                  color={colors.white}
                >
                  {i18n.t("Reminders")}
                </Text>
              </Block>
            </Block>
          </Block>
          <KeyboardAwareScrollView
            behavior={isIOS ? "padding" : "height"}
            style={styles.keyboard}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <Block flex={1}>
              <Block flex={false} margin={[scaleSize(24), 0, 0, 0]}>
                <Block flex={false} gap={12}>
                  {reminderList.map((reminder) => (
                    <CustomReminder
                      key={reminder.id}
                      toggleSwitch={() => toggleSwitch(reminder.id)}
                      value={reminder.toggle}
                      reminderName={i18n.t(reminder.title)}
                      icon={reminder.icon}
                      marginOfTime={[0, 0, 0, scaleSize(42)]}
                      date={reminder.date}
                      reminderTime={reminder.time}
                      handleChange={(date) => onTimeChange(date, reminder.id)}
                    />
                  ))}
                </Block>
              </Block>
            </Block>
          </KeyboardAwareScrollView>
          <Block flex={0.1} margin={[scaleSize(16), 0, 0, 0]}>
            <TouchableOpacity
              style={[
                styles.nextButton,
                {
                  backgroundColor: colors.buttonBgColor,
                },
              ]}
              onPress={handleReminderBtn}
              disabled={isLoading}
            >
              {isLoading ? (
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
                  {route?.params?.isSetting ? i18n.t("Save") :i18n.t("Next")}
                </Text>
              )}
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
    </ImageBackground>
  );
};

export default ReminderDetail;

const styles = StyleSheet.create({
  background: { flex: 1, alignContent: "center" },
  nextButton: {
    alignItems: "center",
    justifyContent: "center",
    height: perfectSize(50),
    borderRadius: perfectSize(8),
    width: "100%",
  },
  keyboard: {
    flex: 1,
  },
});
