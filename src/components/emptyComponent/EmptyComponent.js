import React from "react";
import { StyleSheet } from "react-native";
import Block from "../utilities/Block";
import Text from "../utilities/Text";
import { responsiveScale, scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";

const ListEmptyComponent = ({ title, message }) => {
  return (
    <Block flex={1} center middle margin={[responsiveScale(10), 0]}>
      <Text regular size={scaleSize(15)} color={colors.white} center>
        {message || `No ${title} found!`}
      </Text>
    </Block>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});

export default ListEmptyComponent;
