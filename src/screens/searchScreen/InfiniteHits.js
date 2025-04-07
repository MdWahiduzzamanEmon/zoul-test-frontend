import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useInfiniteHits, useStats } from "react-instantsearch-core";
import Block from "../../components/utilities/Block";
import { perfectSize, responsiveScale } from "../../styles/mixins";
import Text from "../../components/utilities/Text";
import { colors } from "../../styles/theme";
import { useSelector } from "react-redux";
import { getLocalizedContent } from "../../helpers/audioGoalLocalization";
import { transformData } from "../../helpers/app";

export function InfiniteHits({ hitComponent: Hit, ...props }) {
  const { items, isLastPage, showMore, results } = useInfiniteHits({
    ...props,
    escapeHTML: false,
  });
  const selectedLanguage = useSelector(
    (state) => state?.language.selectedLanguage
  );
  const [isLoading, setIsLoading] = useState(false);

  const updatedData = useMemo(() => {
    return (
      items
        ?.map((item) => {
          if (
            item[`link_${selectedLanguage?.toUpperCase()}`] &&
            item[`title_${selectedLanguage?.toUpperCase()}`]
          ) {
            return getLocalizedContent(item, selectedLanguage?.toUpperCase());
          } else {
            return transformData(item);
          }
        })
        .filter((item) => item?.link && item?.title) || []
    );
  }, [items, selectedLanguage]);

  const renderFooter = () => {
    if (isLoading || !isLastPage) {
      return (
        <Block flex={false} style={styles.loaderContainer} width={"100%"}>
          <ActivityIndicator size="large" color={colors.white} />
        </Block>
      );
    }
  };
  useEffect(() => {
    setIsLoading(false);
  }, [results?.page]);
  return (
    <>
      <Block flex={false} margin={[perfectSize(28), 0, perfectSize(20), 0]}>
        <Text regular size={responsiveScale(24)} color={colors.logoColor}>
          Results ({updatedData?.length})
        </Text>
      </Block>
      <FlatList
        data={updatedData}
        keyExtractor={(item) => item?.id}
        onEndReached={() => {
          if (!isLastPage) {
            setIsLoading(true);
            showMore();
          }
        }}
        numColumns={2}
        columnWrapperStyle={styles.row}
        onScroll={Keyboard?.dismiss}
        renderItem={({ item }) => <Hit hit={item} hitList={updatedData} />}
        ListFooterComponent={renderFooter}
      />
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 18,
  },
  row: {
    justifyContent: "space-between",
  },
  loaderContainer: {
    paddingVertical: perfectSize(20),
    justifyContent: "center",
    alignItems: "center",
  },
});
