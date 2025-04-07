import React, { memo, useEffect, useRef, useState } from "react";
import {
  TextInput,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { EyeIcon } from "../../icons/eye-icon/EyeIcons";
import { Typography } from "../typography/Typography";
import moment, { now } from "moment";
import { isAndroid } from "../../utils/platform";
import { consoleLog, perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import DatePickerModal from "../modal/DatePickerModal";
import { months } from "../modal/MonthsData";
import DatePicker from "react-native-date-picker";
import i18n from "../../translations/i18n";

const Input = (props) => {
  const {
    placeholder,
    value,
    onChangeText,
    type,
    disableEditing = false,
    onBlur,
    keyboardType,
    errorMessage,
    mode = "date",
    dateValue,
    style,
    placeholderStyle,
    datePicker,

  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const [showDatepicker, setShowDatepicker] = useState(datePicker); // State for date picker visibility
  const [showDatepicker, setShowDatepicker] = useState(false); // State for date picker visibility
  const today = new Date();
  const day = today.getDate(); // Gets the day of the month (1-31)
  const monthIndex = today.getMonth();
  const currentMonth = months[monthIndex];
  // const [date, setDate] = useState(
  //   dateValue ? new Date(dateValue) : new Date()
  // );
  // consoleLog("My value in input:",value)
  const [dateAndMonthValue, setDateAndMonthValue] = useState({
    day: day,
    month: currentMonth?.name,
  });

  useEffect(() => {
    if (value) {
      // Animate placeholder on load if value is present
      Animated.timing(translateY, {
        toValue: -18,
        duration: 150,
        useNativeDriver: false,
      }).start(() => {
        setShowCaret(true);
      });
    }
  }, [value]);

  useEffect(() => {
    const monthValue = dateValue?.length
      ? dateValue?.split?.("-")[0]
      : currentMonth?.name;
    const dayValue = dateValue?.length ? dateValue?.split?.("-")[1] : day;
    setDateAndMonthValue({
      ...dateAndMonthValue,
      month: monthValue,
      day: dayValue,
    });
  }, [dateValue]);

  const [showCaret, setShowCaret] = useState(false);
  const translateY = useRef(new Animated.Value(value ? -18 : 0)).current;

  const inputRef = useRef(null);

  const emailProps = {
    autoCapitalize: "none",
    autoComplete: "email",
    textContentType: "emailAddress",
    keyboardType: "email-address",
  };

  const handleFocus = () => {
    if (!disableEditing) {
      setIsFocused(true);
      Animated.timing(translateY, {
        toValue: -18,
        duration: 150,
        useNativeDriver: false,
      }).start(() => {
        setShowCaret(true);
      });
      if (type === "date") {
        setShowDatepicker(true);
      } else {
        inputRef.current?.focus();
      }
    }
  };

  const handleBlur = (e) => {
    onBlur && onBlur(e);
    if (!disableEditing) {
      setIsFocused(false);
      if (!value) {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }).start(() => {
          setShowCaret(false);
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    !disableEditing && setShowPassword(!showPassword);
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
    setIsFocused(false);
  };

  const placeholderFontSize = translateY.interpolate({
    inputRange: [-18, 0],
    outputRange: [12, 18],
  });

  // const handleDateChange = (selectedDate) => {
  //   setShowDatepicker(false);
  //   setDate(selectedDate);
  //   onChangeText(selectedDate); // Update the form with the selected date
  // };

  const formatDate = (dateValue, mode) => {
    if (moment(dateValue).isValid()) {
      if (mode === "day") {
        return dateValue; // Format as day (1, 2, 3)
      } else if (mode === "month") {
        return dateValue; // Format as month (January, etc.)
      }else{
        return moment(dateValue).format("DD MMMM YYYY");
      }
    }
    return value;
  };

  const handleCloseModal = () => {
    setShowDatepicker(false);
  };

  const handleSaveDate = (value) => {
    onChangeText(value); // Update the form with the selected date
    setShowDatepicker(false); // Close the modal after saving
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={handlePressOutside}>
        <Pressable onPress={handleFocus}>
          <Animated.View style={[styles.inputContainer, style]}>
            <TextInput
              {...props}
              placeholder=""
              editable={!disableEditing && type !== "date"}
              ref={inputRef}
              style={[styles.input]}
              caretHidden={isAndroid ? !showCaret : false}
              value={
                moment(value).isValid() && type === "date"
                  ? formatDate(value, mode)
                  : value
              }
              onChangeText={(text) => {
                onChangeText(text);
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              secureTextEntry={type === "password" && !showPassword}
              keyboardType={keyboardType}
              {...(type === "email" && emailProps)}
            />
            {type === "password" && !disableEditing && value !== "" &&  (
              <TouchableOpacity
                style={styles.togglePasswordIcon}
                onPress={togglePasswordVisibility}
              >
                <EyeIcon isEyeOpen={showPassword} />
              </TouchableOpacity>
            )}
            {/* {type === "password" && !disableEditing &&  (
              <TouchableOpacity
                style={styles.togglePasswordIcon}
                onPress={togglePasswordVisibility}
              >
                <EyeIcon isEyeOpen={showPassword} />
              </TouchableOpacity>
            )} */}
            {type === "date" && !disableEditing && (
              <>
                <TouchableOpacity
                  style={styles.rightButton}
                  onPress={() => setShowDatepicker(true)} // Show date picker on press
                >
                  <Typography variant={type === "date" ? "t12" : "p3"}>
                    {value && type === "date" && value !== "None"
                      ? i18n.t("EDIT")
                      : i18n.t("ADD")}
                  </Typography>
                </TouchableOpacity>

                <DatePicker
                  modal
                  mode="date"
                  theme="dark"
                  buttonColor={colors.white}
                  open={showDatepicker} // Open state of the DatePicker
                  // date={ moment(value).isValid() && type === "date"
                  //   ? formatDate(value, mode)
                  //   : value?value:Date.now()}
                  // date={date}
                  maximumDate={new Date()}
                  date={value?value:today}
                  onDateChange={(selectedDate) => {
                    // setOpen(false);
                    handleSaveDate(selectedDate);
                  }}
                  onConfirm={(selectedDate)=>{
                    setShowDatepicker(false)
                    // handleSaveDate(selectedDate)
                    onChangeText(selectedDate); // Update the form with the selected date
                    // handleSaveDate()
                  }} // Handle the selected date
                  // onConfirm={handleDateChange} // Handle the selected date
                  onCancel={() => setShowDatepicker(false)} // Close date picker
                />
                {/* <DatePickerModal
                  isVisible={showDatepicker}
                  onClose={handleCloseModal}
                  onSave={handleSaveDate}
                  valueDay={dateAndMonthValue?.day}
                  valueMonth={dateAndMonthValue?.month}
                /> */}
              </>
            )}
            <Pressable onPress={handleFocus}>
              <Animated.Text
                style={[
                  styles.placeholder,
                  placeholderStyle,
                  {
                    transform: [{ translateY }],
                    fontSize: placeholderFontSize,
                  },
                ]}
              >
                {placeholder}
              </Animated.Text>
            </Pressable>
          </Animated.View>
        </Pressable>
      </TouchableWithoutFeedback>
      {errorMessage ? (
        <Typography style={styles.errorText}>{errorMessage}</Typography>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    height: perfectSize(56),
    borderRadius: perfectSize(8),
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: responsiveScale(18),
    height: perfectSize(20),
    marginHorizontal: 16,
    marginTop: 25,
    marginBottom: 8,
    padding: 0,
    color: "#FFFFFF",
  },
  placeholder: {
    position: "absolute",
    left: 16,
    bottom: 17,
    fontSize: responsiveScale(12),
    color: colors.white,
  },
  togglePasswordIcon: {
    position: "absolute",
    right: 20.5,
    bottom: 15,
  },
  rightButton: {
    position: "absolute",
    right: 16,
    paddingTop: 2,
  },
  errorText: {
    fontSize: 12,
    lineHeight: scaleSize(16),
    marginTop: 1,
  },
});

export default memo(Input);
