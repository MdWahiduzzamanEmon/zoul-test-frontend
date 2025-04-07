import { FlatList, StyleSheet } from "react-native";
import React, { memo } from "react";
import Block from "../utilities/Block";
import Text from "../utilities/Text";
import i18n from "../../translations/i18n";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import Categories from "../categories/Categories";

const CategoriesView = ({
  categoriesData = [],
  selectedLanguage = "en",
  onPress = () => {},
}) => {
  return (
    <Block flex={false} style={styles.categoriesContainer}>
      <Text regular size={scaleSize(22)} color={colors.white}>
        {i18n.t("Categories")}
      </Text>

      <FlatList
        data={categoriesData}
        numColumns={2}
        renderItem={({ item, index }) => {
          return (
            <Categories
              label={
                item[`name_${selectedLanguage.toUpperCase()}`] ||
                item?.name_EN ||
                item?.name
              }
              image={item?.coverImage}
              index={index}
              onPress={() => {
                onPress(item);
              }}
            />
          );
        }}
        keyExtractor={(item) => item?.id}
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
        contentContainerStyle={
          {
            // justifyContent: "space-between",
            // flexDirection: "row",
            // flexWrap: "wrap",
            // width: "100%",
          }
        }
      />
    </Block>
  );
};

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.categoriesData === nextProps.categoriesData &&
    prevProps.selectedLanguage === nextProps.selectedLanguage
  );
};

export default memo(CategoriesView, areEqual);

const styles = StyleSheet.create({
  categoriesContainer: {
    marginTop: perfectSize(24),
    paddingHorizontal: perfectSize(20),
  },

  categoriesList: {
    marginTop: perfectSize(20),
  },
});
