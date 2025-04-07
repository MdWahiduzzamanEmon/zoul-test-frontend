import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../../styles/theme";
import * as Progress from "react-native-progress";
import Block from "../utilities/Block";

const SpinnerLoader = ({ size = 24 }) => {
  return (
    <Block flex={false}>
      <Progress.Circle size={size} color={colors.white} indeterminate={true} />
    </Block>
  );
};

export default SpinnerLoader;

const styles = StyleSheet.create({});
