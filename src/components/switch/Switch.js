import React, { useEffect, useState } from "react";
import Block from "../utilities/Block";
import { Animated, I18nManager, StyleSheet, TouchableOpacity } from "react-native";
import { perfectSize } from "../../styles/mixins";

const Switch = ({ onChange, initialValue = false }) => {
  const [value, setValue] = useState(initialValue);
  const [translateX] = useState(new Animated.Value(initialValue ? 1 : 0));

  useEffect(() => {
    setValue(initialValue);
    Animated.timing(translateX, {
      toValue: initialValue ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [initialValue]);

  const toggleSwitch = () => {
    const newValue = !value;
    setValue(newValue);
    Animated.timing(translateX, {
      toValue: newValue ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    onChange(newValue);
  };

  const interpolatedTranslateX = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: I18nManager.isRTL ? [0, -20] : [0, 20],
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={toggleSwitch}>
      <Block
        style={[
          styles.containerToggle,
          value ? styles.activeContainer : styles.inactiveContainer,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: interpolatedTranslateX }],
              backgroundColor: value ? "#570018" : "#555555",
            },
          ]}
        />
      </Block>
    </TouchableOpacity>
  );
};

export default Switch;

const styles = StyleSheet.create({
  activeContainer: {
    backgroundColor: "#ffffff",
  },
  inactiveContainer: {
    backgroundColor: "#C6C6C6",
  },
  thumb: {
    width: perfectSize(24),
    height: perfectSize(24),
    borderRadius: perfectSize(13),
  },
  containerToggle: {
    width: perfectSize(48),
    height: perfectSize(30),
    borderRadius: perfectSize(15),
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
});
