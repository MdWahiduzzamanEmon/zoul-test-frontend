import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import colors from "../../../styles/videoSdk/colors";

const Button = ({
  text,
  backgroundColor,
  onPress,
  disabled,
  style = {},
  textStyle = {},
  loading,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: backgroundColor ? backgroundColor : "#5568FE",
        borderRadius: 12,
        marginVertical: 12,
        ...style,
      }}
    >
      {loading ? (
        <ActivityIndicator color={"white"} />
      ) : (
        <Text
          style={{
            color: colors.primary["100"],
            fontSize: 16,
            fontWeight: "bold",
            ...textStyle,
          }}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};
export default Button;
