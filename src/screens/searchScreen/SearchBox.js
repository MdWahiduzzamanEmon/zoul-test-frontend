import React, { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, TextInput, Image } from "react-native";
import { useSearchBox } from "react-instantsearch-core";
import SearchIcon from "../../assets/appImages/svgImages/SearchIcon.svg";
import { colors, font } from "../../styles/theme";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import Block from "../../components/utilities/Block";
import i18n from "../../translations/i18n";

export function SearchBox({ onSearch, ...props }) {
  const { query, refine } = useSearchBox(props);
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef(null);

  function setQuery(newQuery) {
    setInputValue(newQuery);
    refine(newQuery);
    if (onSearch) {
      onSearch(newQuery);
    }
  }

  if (query !== inputValue && !inputRef.current?.isFocused()) {
    setInputValue(query);
  }

  return (
    <>
      <Block flex={false} style={styles.searchContainer}>
        <SearchIcon height={24} width={24} style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          placeholder={i18n.t("Search")}
          placeholderTextColor={colors.white}
          style={styles.searchInput}
          selectionColor={colors.white}
          value={inputValue}
          onChangeText={setQuery}
          autoComplete="off"
          autoCorrect={false}
          spellCheck={false}
          // clearButtonMode="while-editing"
          autoCapitalize="none"
        />
        {inputValue && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Image
              style={{ height: 20, width: 20 }}
              source={require("../../assets/appImages/whiteCross.png")}
            />
          </TouchableOpacity>
        )}
      </Block>
    </>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: responsiveScale(17),
    fontFamily: font.medium,
  },
  searchIcon: {
    marginRight: perfectSize(12),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF1A",
    borderRadius: 8,
    paddingHorizontal: perfectSize(16),
    height: perfectSize(60),
    marginTop: scaleSize(28),
  },
});
