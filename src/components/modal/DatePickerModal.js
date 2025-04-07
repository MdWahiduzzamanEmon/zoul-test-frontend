import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import ScrollPicker from "react-native-wheel-scrollview-picker"; // Updated import
import Text from "../utilities/Text";
import { colors } from "../../styles/theme";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { months } from "./MonthsData";
import Block from "../utilities/Block";
import i18n from "../../translations/i18n";

const { width } = Dimensions.get("window");

const DatePickerModal = ({
  isVisible,
  onClose,
  onSave,
  valueDay,
  valueMonth,
}) => {
  const [selectedDay, setSelectedDay] = useState("01");
  const [selectedMonth, setSelectedMonth] = useState("Jan");

  useEffect(() => {
    if (valueDay) {
      setSelectedDay(valueDay);
    }
    if (valueMonth) {
      setSelectedMonth(valueMonth);
    }
  }, [valueDay, valueMonth]);

  const [days, setDays] = useState(
    Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"))
  );

  const getDaysInMonth = (month) => {
    const monthObject = months.find((m) => m.name === month);
    return monthObject ? monthObject.days : 31;
  };

  useEffect(() => {
    const maxDays = getDaysInMonth(selectedMonth);
    const updatedDays = Array.from({ length: maxDays }, (_, i) =>
      String(i + 1).padStart(2, "0")
    );

    setDays(updatedDays);

    if (parseInt(selectedDay) > maxDays) {
      const newDay = String(maxDays).padStart(2, "0");
      setSelectedDay(newDay);
    }
  }, [selectedMonth]);

  return (
    <Modal transparent={true} visible={isVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.titleText}>Birth Date</Text>

          <View style={styles.pickerWrapper}>
            <ScrollPicker
              dataSource={days}
              selectedIndex={days?.indexOf(
                String(selectedDay)?.padStart(2, "0")?.trim()
              )}
              renderItem={(data) => {
                return (
                  <Text style={{ color: "#FFF", fontSize: 22 }}>{data}</Text>
                );
              }}
              onValueChange={(data) => {
                setSelectedDay(data);
              }}
              wrapperHeight={240}
              wrapperBackground="#323232"
              itemHeight={50}
              highlightColor="#ffffff"
              highlightBorderWidth={1}
            />

            <ScrollPicker
              dataSource={months.map((month) => month.name)}
              selectedIndex={months.findIndex((m) => m.name === selectedMonth)}
              renderItem={(data) => {
                return (
                  <Text style={{ color: "#FFF", fontSize: 22 }}>{data}</Text>
                );
              }}
              onValueChange={(data) => {
                setSelectedMonth(data);
              }}
              wrapperHeight={240}
              wrapperBackground="#323232"
              itemHeight={50}
              highlightColor="#ffffff"
              highlightBorderWidth={1}
            />
          </View>

          <Block flex={false} width="100%">
            <TouchableOpacity
              style={[
                styles.registerButton,
                {
                  backgroundColor: colors.buttonBgColor,
                },
              ]}
              onPress={() => onSave(`${selectedMonth}-${selectedDay}`)}
            >
              <Text
                size={responsiveScale(16)}
                weight={500}
                regular
                color={colors.white}
              >
                {i18n.t("Save")}
              </Text>
            </TouchableOpacity>
          </Block>
        </View>
      </View>
    </Modal>
  );
};

export default DatePickerModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: "#323232", // Dark container background
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  pickerWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    marginTop: scaleSize(10),
    marginBottom: scaleSize(20),
  },
  titleText: {
    color: "#fff",
    fontSize: responsiveScale(16),
    fontWeight: "bold",
    marginBottom: scaleSize(20),
  },
  saveButton: {
    backgroundColor: "#A30223",
    paddingVertical: 12,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 15 : 10,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  registerButton: {
    alignItems: "center",
    justifyContent: "center",
    height: perfectSize(50),
    borderRadius: perfectSize(8),
    width: "100%",
  },
});
