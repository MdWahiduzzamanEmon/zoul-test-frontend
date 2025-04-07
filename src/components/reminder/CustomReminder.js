import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import Switch from "../switch/Switch";
import Block from "../utilities/Block";
import Text from "../utilities/Text";
import ChevronDownIcon from "../../assets/icons/chevron-down.svg";
import DatePicker from "react-native-date-picker";
import { dateToTime } from "../../helpers/date-converter";

const CustomReminder = ({
  value,
  toggleSwitch,
  reminderName,
  icon,
  marginOfTime,
  date,
  handleChange,
  reminderTime,
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (value) {
      // Expand with animation when toggled on
      Animated.timing(animatedHeight, {
        toValue: perfectSize(50),
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();

      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    } else {
      // Collapse with animation when toggled off
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();

      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }
  }, [value]);

  return (
    <Block flex={false} style={styles.container}>
      <Block
        flex={false}
        margin={
          value
            ? [scaleSize(10), scaleSize(10), 0, scaleSize(10)]
            : [scaleSize(10)]
        }
        row
        between
        center
      >
        <Block flex={false} row>
          {icon}
          <Text
            size={responsiveScale(18)}
            weight={400}
            regular
            style={{ marginLeft: scaleSize(10) }}
            color={colors.white}
          >
            {reminderName}
          </Text>
        </Block>
        <Switch initialValue={value} onChange={toggleSwitch} />
      </Block>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            height: animatedHeight,
            opacity: animatedOpacity,
          },
        ]}
      >
        {value && (
          <Block flex={false} margin={marginOfTime}>
            <Block flex={false} row center>
              <TouchableOpacity onPress={() => setIsDatePickerOpen(true)}>
                <Text
                  size={responsiveScale(18)}
                  color={colors.white}
                  style={{ marginRight: scaleSize(5) }}
                >
                  {reminderTime ? reminderTime : dateToTime(date)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setIsDatePickerOpen(true)}
              >
                <ChevronDownIcon />
              </TouchableOpacity>
            </Block>
            <DatePicker
              modal
              open={isDatePickerOpen}
              date={date}
              mode="time"
              onConfirm={(selectedDate) => {
                setIsDatePickerOpen(false);
                handleChange(selectedDate);
              }}
              onCancel={() => {
                setIsDatePickerOpen(false);
              }}
            />
          </Block>
        )}
      </Animated.View>
    </Block>
  );
};

export default CustomReminder;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: perfectSize(8),
  },
  animatedContainer: {
    overflow: "hidden", // To ensure content doesn't overflow during animation
  },
});
