import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Gap } from "../gap/Gap";

const Divider = ({
  title,
  weight,
  dividerHeight,
  extraTitleStyle,
  dividerBgColor,
}) => {
  const lineStyle = [
    styles.line,
    {
      height: dividerHeight || 1.2,
      backgroundColor: dividerBgColor || "rgba(255,255,255,0.15)",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={lineStyle} />
      {title && (
        <Text
          style={[
            styles.title,
            extraTitleStyle,
            weight && { fontWeight: weight },
          ]}
        >
          {title}
        </Text>
      )}
      <View style={lineStyle} />
    </View>
  );
};

export const LineDivider = ({
  gapOver = true,
  gapUnder = true,
  isPaddingHorizontal = true,
}) => {
  return (
    <View style={isPaddingHorizontal ? styles.paddingHorizontal : {}}>
      {!!gapOver && <Gap vertical={16} />}
      <Divider />
      {!!gapUnder && <Gap vertical={16} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    marginTop: 5,
  },
  title: {
    marginHorizontal: 10,
    color: "#FFFFFF",
    fontSize: 16,
  },
  paddingHorizontal: { paddingHorizontal: 16 },
});

export default Divider;
