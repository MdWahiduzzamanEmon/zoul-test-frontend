import React from "react";
import { View } from "react-native";

export const gap = ({ horizontal = 0, vertical = 0 }) => ({
  height: vertical,
  width: horizontal,
});

export const Gap = (props) => <View style={gap(props)} />;
