import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { FlatList } from "react-native";
import { useSelector } from "react-redux";
import debounce from "lodash.debounce";
import i18n from "../../translations/i18n";

const MultiSelectDropdown = (props) => {
  const {
    isLoading,
    selectedSpeakers,
    setSelectedSpeakers,
    fetchMoreUsers,
    inputValue,
    setInputValue,
  } = props;
  const [loadingMore, setLoadingMore] = useState(false);

  const allUsers = useSelector((state) => state.allUsersReducer.users);
  const speakersMeta = useSelector(
    (state) => state.allUsersReducer.speakersMeta
  );
  const [searchText, setSearchText] = useState(inputValue);
  const speakers = allUsers || [];

  const toggleSelection = (item) => {
    setSelectedSpeakers(
      selectedSpeakers.includes(item.id)
        ? selectedSpeakers.filter((data) => data.id !== item.id)
        : [...selectedSpeakers, item]
    );
  };

  useEffect(() => {
    if (speakersMeta?.currentPage === speakersMeta?.totalPage) {
      setLoadingMore(false);
    }
  }, [speakersMeta?.currentPage, speakersMeta?.totalPage]);

  const handleLoadMore = async () => {
    if (!loadingMore && speakersMeta?.currentPage !== speakersMeta?.totalPage) {
      setLoadingMore(true);
      await fetchMoreUsers();
      setLoadingMore(false);
    }
  };

  const renderDropdownItem = ({ item }) => {
    const isSelected = selectedSpeakers?.some(
      (speaker) => item?.id === speaker?.id
    );
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => toggleSelection(item)}
      >
        <Text style={styles.itemText}>{item.fullName || item.email}</Text>
        <Text style={styles.checkbox}>{isSelected ? "✔️" : "◻️"}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (speakersMeta?.currentPage === speakersMeta?.totalPage) {
      setLoadingMore(false);
    }
  }, []);

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const debouncedSearch = useCallback(
    debounce((text) => {
      setInputValue(text);
    }, 500),
    []
  );

  return (
    <>
      <TextInput
        placeholder={i18n.t("Search")}
        style={styles.searchInput}
        value={searchText}
        onChangeText={handleSearchTextChange}
        autoComplete="off"
        autoCorrect={false}
        spellCheck={false}
        autoCapitalize="none"
      />
      {isLoading ? (
        <View
          style={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={"large"} color="white" />
        </View>
      ) : (
        <FlatList
          data={speakers}
          keyExtractor={(item) => item.id.toString()}
          style={{
            marginHorizontal: 22,
          }}
          renderItem={renderDropdownItem}
          onEndReached={handleLoadMore}
          contentContainerStyle={{ paddingBottom: 20 }}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={<Text>No users found</Text>}
          ListFooterComponent={() =>
            speakersMeta?.currentPage === speakersMeta?.totalPage ||
            !loadingMore ? null : (
              <View style={styles.loading}>
                <ActivityIndicator size="small" color="white" />
                <Text>Loading more...</Text>
              </View>
            )
          }
        />
      )}
      {selectedSpeakers?.length ? (
        <View
          style={{
            borderTopWidth: 2,
            borderColor: "white",
            paddingHorizontal: 16,
            backgroundColor: "white",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          <Text style={styles.selectedText}>
            Selected Speakers:{" "}
            {selectedSpeakers
              .map((speaker) => speaker.fullName || speaker.email)
              .join(", ")}
          </Text>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginBottom: 12,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },

  dropdownContainer: {
    borderRadius: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "black",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  itemText: {
    fontSize: 16,
    color: "white",
  },
  checkbox: {
    fontSize: 16,
    color: "blue",
  },
  loading: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    color: "black",
  },
  searchInput: {
    backgroundColor: "white",
    color: "black",
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 36,
    margin: 16,
    marginBottom: 0,
  },
});

export default MultiSelectDropdown;
