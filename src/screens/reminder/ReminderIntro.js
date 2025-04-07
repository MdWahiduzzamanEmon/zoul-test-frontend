import React from "react";
import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { Backgrounds } from "../../data/background";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import Block from "../../components/utilities/Block";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackIcon } from "../../icons/back-icon/BackIcon";
import ZoulIcon from "../../assets/icons/zoul-icon.svg";
import Text from "../../components/utilities/Text";
import { colors } from "../../styles/theme";
import NotificationIcon from "../../assets/icons/notification.svg";
import i18n from "../../translations/i18n";

const ReminderIntro = ({ navigation }) => {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <ImageBackground
      source={Backgrounds.reminderIntroBg}
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
          <Block flex={false}>
            <Block flex={false} row between>
              <Block flex={false} width={"10%"}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <BackIcon size={perfectSize(22)} />
                </TouchableOpacity>
              </Block>
              <Text
                size={responsiveScale(18)}
                regular
                weight={400}
                color={colors.kPinkRose}
                onPress={async () => {
                  navigation.navigate("Reminder");
                }}
              >
                {i18n.t("Skip")}
              </Text>
            </Block>
          </Block>
          <Block flex={false} margin={[scaleSize(16), 0, 0, 0]}>
            <ZoulIcon />
          </Block>
          <Block flex={1}>
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
                  Reminders
                </Text>
              </Block>
            </Block>
          </Block>
          <Block flex={1} bottom>
            <Block flex={false}>
              <Text
                size={responsiveScale(24)}
                regular
                weight={500}
                color={colors.white}
              >
                For Your Happiness Journey: 5 Key Reminders
              </Text>
            </Block>
            <Block flex={false} margin={[scaleSize(28), 0, 0, 0]}>
              <Text
                size={responsiveScale(24)}
                regular
                weight={500}
                color={colors.white}
              >
                Let these bring clarity and reset your habits for a mindful,
                purposeful life.
              </Text>
            </Block>
            <Block flex={false} margin={[scaleSize(28), 0, 0, 0]}>
              <Text
                size={responsiveScale(24)}
                regular
                weight={500}
                color={colors.white}
              >
                Set your reflection time.
              </Text>
            </Block>
          </Block>
          <Block flex={0.2} margin={[scaleSize(16), 0, 0, 0]}>
            <TouchableOpacity
              style={[
                styles.nextButton,
                {
                  backgroundColor: colors.buttonBgColor,
                },
              ]}
              onPress={() => navigation.navigate("Reminder")}
            >
              <Text
                size={responsiveScale(14)}
                weight={500}
                regular
                color={colors.white}
              >
                {i18n.t("Next")}
              </Text>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
    </ImageBackground>
  );
};

export default ReminderIntro;

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
