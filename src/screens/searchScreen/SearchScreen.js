import { ImageBackground, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import Block from "../../components/utilities/Block";
import { colors } from "../../styles/theme";
import BackIcon from "../../assets/appImages/svgImages/BackIcon";
import { consoleLog, perfectSize, responsiveScale } from "../../styles/mixins";
import Text from "../../components/utilities/Text";
import SuggestYourPlan from "../../components/suggestYourPlan/SuggestYourPlan";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch-core";
import { SearchBox } from "./SearchBox";
import { InfiniteHits } from "./InfiniteHits";
import { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } from "../../constants/links";
import { setSelectedAudioData } from "../../store/storeAppData/categories";
import { useDispatch, useSelector } from "react-redux";
import SmallPlayer from "../../components/small-player/SmallPlayer";
import { useModal } from "../../context/ModalContext";
import { MeditationSessionModal } from "../../modules/modals/MeditationSessionModal";
import { formatTime } from "../../helpers/app";
import SubscriptionModal from "../../components/subscriptionModal/SubscriptionModal"; // import SubscriptionModal
import CongratsModal from "../../components/subscriptionModal/CongratulationsModal";
import { YEARLY, YEARLY_PROMO } from "../../constants/InAppPurchase";
import i18n from "../../translations/i18n";

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY);

const SearchScreen = ({ navigation }) => {
  const selectedLanguage = useSelector(
    (state) => state?.language?.selectedLanguage
  );
  const modal = useModal();
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedImage, setselectedImage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false); // Control subscription modal visibility
  const isUserSubscribed = useSelector(
    (state) => state.subscription.isUserSubscribed
  );
  const bottomSheetRef = useRef();
  const dispatch = useDispatch();

  function Hit({ hit, hitList }) {
    return (
      <SuggestYourPlan
        image={hit?.bannerImage}
        title={hit?.title}
        onPress={() => manageSearchDataOnPress(hit, hitList)}
        duration={formatTime(hit?.duration * 1000)}
        mainContainer={{ marginBottom: perfectSize(20) }}
        stylesProps={{
          widthRatio: 0.425,
          heightRatio: 1.42857,
          textTitleSize: 15,
          imageBorderRadius: 0,
        }}
      />
    );
  }

  const manageSearchDataOnPress = (item, itemList) => {
    consoleLog("manageSearchDataOnPress", item);
    if (item.premium && !isUserSubscribed) {
      setShowSubscriptionModal(true);
    } else {
      // If the audio is free or the user is subscribed, open the MeditationSessionModal
      if (bottomSheetRef?.current) {
        bottomSheetRef?.current?.snapToIndex(0);
      }
      modal.show(MeditationSessionModal, {
        track: item,
        playlist: itemList,
      });
      dispatch(setSelectedAudioData(item));
      setSelectedTitle(item[`title_${selectedLanguage?.toUpperCase()}`]);
      setselectedImage(item?.bannerImage);
    }
  };

  const handleDownArrowPress = () => {
    if (bottomSheetRef?.current) {
      bottomSheetRef?.current?.collapse();
    }
  };

  const closeIconOnPress = () => {
    if (bottomSheetRef?.current) {
      bottomSheetRef?.current?.close();
    }
  };

  const onSearch = (query) => {
    setHasSearched(!!query);
  };

  const hideSubscriptionModal = () => {
    setShowSubscriptionModal(false);
  };

  return (
    <Block flex={1}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={require("../../assets/appImages/ExploreBackgroundImageNew.png")}
        resizeMode="stretch"
        style={styles.bgImage}
      >
        <Block flex={1} padding={[0, perfectSize(20), 0, perfectSize(20)]}>
          <Block flex={false} style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backIconContainer}
            >
              <BackIcon />
            </TouchableOpacity>
            <Text regular size={responsiveScale(18)} color={colors.logoColor}>
              {i18n.t("Search")}
            </Text>
            <Block flex={false} style={styles.placeholderBlock} />
          </Block>
          <InstantSearch searchClient={searchClient} indexName="audios">
            <SearchBox onSearch={onSearch} />
            {hasSearched && <InfiniteHits hitComponent={Hit} />}
          </InstantSearch>
        </Block>
      </ImageBackground>
      <SmallPlayer />
      <SubscriptionModal
        isVisible={showSubscriptionModal}
        hideModal={hideSubscriptionModal}
        onSubscribedUser={(plan) => {
          setShowSubscriptionModal(false);
          setTimeout(() => {
            modal.show(CongratsModal, {
              message:
                plan == YEARLY || plan == YEARLY_PROMO
                  ? i18n.t("Year Plan Update")
                  : i18n.t("Month Plan Update"),
              btnTitle:"Ok",
            });
          }, 1000);
        }} // function to hide modal on close
      />
    </Block>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "15%",
  },
  backIconContainer: {
    width: perfectSize(30),
    height: perfectSize(30),
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderBlock: {
    width: perfectSize(30),
    height: perfectSize(30),
  },
});
