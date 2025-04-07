import {
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Block from "../../../components/utilities/Block";
import Text from "../../../components/utilities/Text";
import {
  perfectSize,
  responsiveScale,
  scaleSize,
} from "../../../styles/mixins";
import { colors } from "../../../styles/theme";
import i18n from "../../../translations/i18n";
import ListEmptyComponent from "../../../components/emptyComponent/EmptyComponent";
import SuggestYourPlan from "../../../components/suggestYourPlan/SuggestYourPlan";
import { formatTime } from "../../../helpers/app";

const SuggestedDailyPlanView = ({ dailyPlans = [], onPress = () => {} }) => {
  const [showMore, setShowMore] = useState(false);

  const renderItem = ({ item: subItem }) => {
    return (
      <SuggestYourPlan
        image={
          subItem?.bannerImage ?? require("../../../assets/appImages/Logo.png")
        }
        title={subItem.title}
        duration={formatTime(subItem.duration * 1000)}
        onPress={() => onPress(subItem)}
        stylesProps={{
          widthRatio: 0.42,
          heightRatio: 1.42857,
        }}
      />
    );
  };

  const renderPlanItem = ({ item }) => (
    <Block flex={false} style={styles.sectionContainer}>
      <Text
        regular
        size={responsiveScale(24)}
        color={colors.white}
        style={{ marginBottom: perfectSize(20) }}
      >
        {item.title}
      </Text>
      <FlatList
        data={item.data}
        keyExtractor={(subItem) => subItem.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <ListEmptyComponent message={`No audios available`} />
        )}
      />
    </Block>
  );

  return (
    <Block flex={false} style={styles.mainContainer}>
      <Block flex={false} style={styles.yourSuggestedContainer}>
        <ImageBackground
          source={require("../../../assets/appImages/YourSuggested.png")}
          resizeMode="stretch"
          style={styles.suggestedBackground}
          borderRadius={8}
        >
          <Text
            regular
            size={responsiveScale(20)}
            style={styles.suggestedText}
            color={colors.white}
            weight={"400"}
          >
            {i18n.t("Your Suggested")} {"\n"}
            {i18n.t("Daily Plan")}
          </Text>

          <TouchableOpacity
            style={styles.viewMoreText}
            onPress={() => setShowMore(!showMore)}
          >
            <Text
              regular
              size={responsiveScale(14)}
              color={colors.white}
              weight={"400"}
            >
              {showMore ? i18n.t("View Less") : i18n.t("View More")}
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      </Block>
      {showMore && (
        <FlatList
          data={dailyPlans}
          keyExtractor={(item) => item.title}
          renderItem={renderPlanItem}
        />
      )}
    </Block>
  );
};

export default SuggestedDailyPlanView;

const styles = StyleSheet.create({
  mainContainer: {
    paddingLeft: perfectSize(23),
    paddingRight: perfectSize(22),
    marginTop: perfectSize(20),
  },
  yourSuggestedContainer: {
    height: 100,
  },
  suggestedBackground: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  suggestedText: {
    paddingLeft: 14,
    paddingBottom: 12,
    alignSelf: "flex-end",
  },
  viewMoreText: {
    paddingRight: 14,
    paddingBottom: 12,
    justifyContent: "flex-end",
  },
  sectionContainer: {
    marginTop: scaleSize(25),
  },
  row: {
    justifyContent: "space-between",
    marginBottom: scaleSize(25),
  },
});
