import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Block from "../utilities/Block";
import * as Progress from "react-native-progress";
import { colors } from "../../styles/theme";

const ProgressBar = ({ progress = 0 }) => {
  return (
    <Block flex={false}>
      <Progress.Circle
        size={24}
        progress={progress / 100}
        color={colors.white}
      />
    </Block>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({});
