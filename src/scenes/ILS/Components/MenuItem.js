import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Orientation from "react-native-orientation-locker";
import colors from "../../../styles/videoSdk/colors";
import { convertRFValue } from "../../../styles/videoSdk/spacing";

export default function MenuItem({ title, description, icon, onPress }) {
  const [savedOrientation, setSavedOrientation] = useState("PORTRAIT");

  const handleMenuOpen = () => {
    Orientation.getOrientation((orientation) => {
      setSavedOrientation(orientation);
      Orientation.unlockAllOrientations();
    });

    if (onPress) onPress();
  };

  const handleMenuClose = () => {
    if (
      savedOrientation === "LANDSCAPE-LEFT" ||
      savedOrientation === "LANDSCAPE-RIGHT"
    ) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
    console.log("Restored Orientation:", savedOrientation);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        handleMenuOpen();
        setTimeout(() => {
          handleMenuClose();
        }, 5000);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 18,
          paddingVertical: 16,
          alignItems: "center",
        }}
      >
        {icon && (
          <View
            style={{
              marginRight: 14,
            }}
          >
            {icon}
          </View>
        )}

        <View
          style={{
            flexDirection: "column",
          }}
        >
          <Text
            style={{
              color: colors.primary[100],
              fontSize: convertRFValue(12),
            }}
          >
            {title}
          </Text>

          {description && (
            <Text
              style={{
                color: colors.primary[400],
                fontSize: convertRFValue(12),
              }}
            >
              {description}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
