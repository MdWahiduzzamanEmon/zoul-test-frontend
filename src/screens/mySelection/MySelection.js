import {
  StyleSheet,
  StatusBar,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { colors, deviceWidth } from "../../styles/theme";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import SuggestedDailyPlan from "../../components/suggestedDailyPlan/SuggestedDailyPlan";
import { ScrollView } from "react-native-gesture-handler";
import { getAllUserPlaylists } from "../../resources/baseServices/app";
import { setAllUserPlayListsData } from "../../store/storeAppData/playlists";
import { useDispatch, useSelector } from "react-redux";
import i18n from "../../translations/i18n";
import { useFocusEffect } from "@react-navigation/native";
import { setSelectedAudioData } from "../../store/storeAppData/categories";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MySelectionSkeleton from "../../components/skeletonPlaceholder/MySelectionSkeleton";
import { useModal } from "../../context/ModalContext";
import { MeditationSessionModal } from "../../modules/modals/MeditationSessionModal";
import { formatTime } from "../../helpers/app";
import { getLocalizedContent } from "../../helpers/audioGoalLocalization";
import Divider from "../../components/divider/Divider";
import ProfileStarsIcon from "../../assets/appImages/svgImages/ProfileStarsIcon.svg";
import { useSmallPlayer } from "../../modules/player/SmallPlayerProvider";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { LandingLogo } from "../../icons/landing/landing-logo";

const MySelection = ({ navigation }) => {
  const modal = useModal();
  const { top } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const smallPlayer = useSmallPlayer();

  const isSmallPlayerVisible = useMemo(
    () => smallPlayer.isSmallPlayer,
    [smallPlayer?.isSmallPlayer]
  );

  const downloadAudioListData = useSelector(
    (state) => state?.playlistsReducer?.downloadAudioListData
  );

  const getAllUserPlayListData = useSelector(
    (state) => state?.playlistsReducer?.getAllUserPlayListData
  );

  const recentlyPlayedAudios = useSelector(
    (state) => state?.recentlyPlayedAudiosReducer?.recentlyPlayedAudios
  );

  const favourites = useSelector(
    (state) => state?.favouritesAudioReducer?.favourites
  );

  const selectedLanguage = useSelector(
    (state) => state?.language.selectedLanguage
  );

  const [displayedData, setDisplayedData] = useState(4);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchAllUserPlaylists();
    }, [])
  );

  const fetchAllUserPlaylists = async () => {
    try {
      const res = await getAllUserPlaylists();
      dispatch(setAllUserPlayListsData(res?.data?.userPlaylists));
    } catch (error) {
      console.log("error fetchAllUserPlaylists =--->", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowMore = () => {
    setDisplayedData((prevData) =>
      prevData === 4 ? getAllUserPlayListData?.length : 4
    );
  };

  const manageSearchDataOnPress = (item, allTracks) => {
    modal.show(MeditationSessionModal, {
      track: item,
      playlist: allTracks?.length > 0 ? allTracks : [item],
    });
    dispatch(setSelectedAudioData(item));
  };

  const renderImageItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.imageContainer, { width: deviceWidth * 0.44 }]}
        onPress={() => manageSearchDataOnPress(item, downloadAudioListData)}
      >
        <Block flex={false}>
          {/* <FastImage
            style={[styles.image, { width: "100%" }]}
            source={{
              uri:
                Platform.OS === "ios"
                  ? item?.bannerImage
                  : `file://${item?.bannerImage}`,
            }}
          /> */}
          <Image
            style={[styles.image, { width: "100%" }]}
            source={{
              uri:
                Platform.OS === "ios"
                  ? item?.bannerImage
                  : `file://${item?.bannerImage}`,
            }}
          />
          <Text
            size={responsiveScale(12)}
            medium
            color={colors.white}
            style={styles.timeText}
          >
            {formatTime(item?.duration * 1000)}
          </Text>
        </Block>
        <Text
          size={scaleSize(16)}
          regular
          color={colors.white}
          style={styles.titleText}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderImageItemForActivityHistory = ({ item }) => {
    const safeLang = selectedLanguage ? selectedLanguage?.toUpperCase() : "EN";
    const mappedAudios = recentlyPlayedAudios?.audios
      ?.filter((audio) => {
        if (!audio) return false;
        const title_key = `title_${safeLang}`;
        const link_key = `link_${safeLang}`;
        const duration_key = `duration_${safeLang}`;
        return (
          audio[title_key] != null &&
          audio[link_key] != null &&
          audio[duration_key] != null
        );
      })
      .map((audio) => getLocalizedContent(audio, safeLang))
      .filter((audio) => audio?.link && audio?.title && audio?.duration);

    const hasValidData =
      item &&
      item[`title_${safeLang}`] &&
      item[`link_${safeLang}`] &&
      item[`duration_${safeLang}`];

    if (!hasValidData) return null; // Skip rendering if the item is invalid

    const filteredItem = {
      bannerImage: item != null && item != undefined && item?.bannerImage,
      duration:
        item != null && item != undefined && item[`duration_${safeLang}`],
      id: item != null && item != undefined && item.id,
      link: item != null && item != undefined && item[`link_${safeLang}`],
      premium: item != null && item != undefined && item.premium,
      title: item != null && item != undefined && item[`title_${safeLang}`],
    };

    return (
      <TouchableOpacity
        style={[styles.imageContainer, { width: deviceWidth * 0.44 }]}
        onPress={() => manageSearchDataOnPress(filteredItem, mappedAudios)}
      >
        <Block flex={false}>
          {/* <FastImage
            style={[styles.image, { width: "100%" }]}
            source={{
              uri: item?.bannerImage,
            }}
          /> */}
          <Image
            style={[styles.image, { width: "100%" }]}
            source={{
              uri: item?.bannerImage,
            }}
          />
          <Text
            size={responsiveScale(12)}
            medium
            color={colors.white}
            style={styles.timeText}
          >
            {formatTime((filteredItem?.duration || 0) * 1000)}
          </Text>
        </Block>
        <Text
          size={scaleSize(16)}
          regular
          color={colors.white}
          style={styles.titleText}
        >
          {filteredItem?.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFavoriteImageItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.imageContainer, { width: deviceWidth * 0.44 }]}
        onPress={() => manageSearchDataOnPress(item, favourites)}
      >
        <Block flex={false}>
          {/* <FastImage
            style={[styles.image, { width: "100%" }]}
            source={{
              uri: item?.bannerImage,
            }}
          /> */}
          <Image
            style={[styles.image, { width: "100%" }]}
            source={{
              uri: item?.bannerImage,
            }}
          />
          <Text
            size={responsiveScale(12)}
            medium
            color={colors.white}
            style={styles.timeText}
          >
            {formatTime((item?.duration || 0) * 1000)}
          </Text>
        </Block>
        <Text
          size={scaleSize(16)}
          regular
          color={colors.white}
          style={styles.titleText}
        >
          {item?.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleActivityHistoryDataSelection = () => {
    navigation.navigate("GettingOverplaylist", { isRecentlyPlayed: true });
  };

  const handleFavoriteSeasonsSelection = () => {
    navigation.navigate("GettingOverplaylist", { showFavouriteIcon: true });
  };

  const handleDownloadSeasonsSelection = () => {
    navigation.navigate("GettingOverplaylist", {
      showDownloadIcon: true,
      isFreeAudio: true,
      isDownloadedAudio: true,
    });
  };

  const handleNavigate = (item) => {
    navigation.navigate("MyPlaylistInspiration", {
      playlistItem: item,
      openBottomSheet: false,
    });
  };

  const EmptyComponent = ({ description, navigationTo = "Home" }) => {
    return (
      <Block
        flex={false}
        color={"#06020366"}
        padding={[0, perfectSize(12), perfectSize(15), perfectSize(12)]}
        style={{
          borderRadius: perfectSize(8),
          overflow: "hidden",
        }}
      >
        {description ? (
          <Block
            flex={false}
            center
            style={{
              marginTop: perfectSize(14),
            }}
          >
            <Text
              regular
              size={responsiveScale(16)}
              color={colors.white}
              center
            >
              {description}
            </Text>
          </Block>
        ) : null}
        <TouchableOpacity
          center
          style={{
            marginTop: perfectSize(14),
            alignSelf: "center",
            backgroundColor: colors.white,
            paddingHorizontal: perfectSize(10),
            paddingVertical: perfectSize(14),
            borderRadius: perfectSize(30),
            flexDirection: "row",
          }}
          onPress={() => {
            navigation.navigate(navigationTo);
          }}
        >
          <ProfileStarsIcon />

          <Block flex={false} style={{ marginLeft: 10 }}>
            <Text
              regular
              size={responsiveScale(16)}
              color={colors.black}
              center
            >
              {/* Listen to your first session */}
              {i18n.t("Listen to your first session")}
            </Text>
          </Block>
        </TouchableOpacity>
      </Block>
    );
  };

  return (
    <Block flex={1}>
      {isLoading ? (
        // <Loader />
        <Block flex={1} style={{ paddingTop: top }}>
          <MySelectionSkeleton />
        </Block>
      ) : (
        <Block flex={1}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
          />
          <ImageBackground
            source={require("../../assets/appImages/ExploreBackgroundImageNew.png")}
            resizeMode="stretch"
            style={[styles.bgImage, { paddingTop: top }]}
          >
            <Block flex={1}>
              <Block flex={false} center>
                <LandingLogo
                  color={colors.logoColor}
                  height={perfectSize(60)}
                  width={perfectSize(100)}
                />
                {/* </Block> */}
              </Block>
              <Block flex={1} style={styles.container}>
                <Text
                  size={scaleSize(32)}
                  color={colors.white}
                  regular
                  style={styles.title}
                >
                  {/* My Selection */}
                  {i18n.t("My Selection")}
                </Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: "10%" }}
                >
                  <Block
                    flex={false}
                    row
                    center
                    style={{ marginTop: perfectSize(30) }}
                  >
                    {/* <PlaylistAddedIcon height={32} width={32} /> */}
                    <Image
                      style={{ height: 32, width: 32, tintColor: colors.white }}
                      source={require("../../assets/appImages/playList.png")}
                    />
                    <Text
                      size={scaleSize(24)}
                      color={colors.white}
                      regular
                      style={{ marginHorizontal: perfectSize(8) }}
                    >
                      {/* My Playlists */}
                      {i18n.t("My Playlists")}
                    </Text>
                  </Block>

                  <Block
                    flex={1}
                    style={{
                      marginTop: perfectSize(5),
                      marginBottom: isSmallPlayerVisible ? perfectSize(50) : 0,
                    }}
                  >
                    {/* User Playlists */}
                    <FlatList
                      data={getAllUserPlayListData?.slice(0, displayedData)}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <SuggestedDailyPlan
                          title={item.title}
                          image={item.image}
                          subtitle={`${(item.audios || []).length} audio files`}
                          handleonPress={() => handleNavigate(item)}
                          showDivider={false}
                          extraimagestyle={{
                            height: perfectSize(54),
                            width: perfectSize(55),
                          }}
                        />
                      )}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.listContent}
                    />
                    {getAllUserPlayListData?.length > 4 ? (
                      <TouchableOpacity
                        onPress={handleShowMore}
                        style={styles.showMoreButton}
                      >
                        <Text
                          size={scaleSize(18)}
                          color={colors.logoColor}
                          medium
                          center
                        >
                          {displayedData === 4
                            ? i18n.t("See More")
                            : i18n.t("See Less")}
                        </Text>
                      </TouchableOpacity>
                    ) : null}

                    {/* Downloaded */}
                    <Divider
                      dividerHeight={1.1}
                      dividerBgColor={colors.white}
                    />
                    <Block
                      flex={false}
                      style={{ marginTop: perfectSize(12) }}
                      row
                      center
                    >
                      <Image
                        style={{
                          height: 32,
                          width: 32,
                          tintColor: colors.white,
                        }}
                        source={require("../../assets/appImages/download.png")}
                      />
                      <Text
                        size={scaleSize(24)}
                        color={colors.white}
                        regular
                        style={{
                          marginHorizontal: perfectSize(10),
                          width: SCREEN_WIDTH * 0.8,
                        }}
                        numberOfLines={2}
                      >
                        {i18n.t("Download")} / {i18n.t("Play Offline")}
                      </Text>
                    </Block>
                    <Block
                      flex={false}
                      row
                      center
                      style={{ marginTop: perfectSize(10) }}
                    >
                      <FlatList
                        data={downloadAudioListData?.slice(0, 4) || []}
                        renderItem={renderImageItem}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        ListEmptyComponent={() => (
                          <EmptyComponent
                            description={i18n.t(
                              "Listen to your first audio to see your history appear here"
                            )}
                          />
                        )}
                      />
                    </Block>
                    {downloadAudioListData?.length > 4 ? (
                      <TouchableOpacity
                        onPress={handleDownloadSeasonsSelection}
                        style={styles.showMoreButton}
                      >
                        <Text
                          size={scaleSize(18)}
                          color={colors.logoColor}
                          medium
                          center
                        >
                          {i18n.t("See More")}
                        </Text>
                      </TouchableOpacity>
                    ) : null}

                    {/* Activity History */}
                    <Divider
                      dividerHeight={1.1}
                      dividerBgColor={colors.white}
                    />
                    <Block
                      flex={false}
                      style={{ marginTop: perfectSize(12) }}
                      row
                      center
                    >
                      <Image
                        style={{
                          height: 32,
                          width: 32,
                          tintColor: colors.white,
                        }}
                        source={require("../../assets/appImages/recent.png")}
                      />
                      <Text
                        size={scaleSize(24)}
                        color={colors.white}
                        regular
                        style={{
                          marginHorizontal: perfectSize(10),
                          width: SCREEN_WIDTH * 0.8,
                        }}
                        numberOfLines={2}
                      >
                        {i18n.t("Recently Played")}
                      </Text>
                    </Block>
                    <Block
                      flex={false}
                      row
                      center
                      style={{ marginTop: perfectSize(10) }}
                    >
                      <FlatList
                        data={recentlyPlayedAudios?.audios?.slice(0, 4) || []}
                        renderItem={renderImageItemForActivityHistory}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        ListEmptyComponent={() => (
                          <EmptyComponent
                            description={i18n.t(
                              "Listen to your first audio to see your history appear here"
                            )}
                          />
                        )}
                      />
                    </Block>
                    {recentlyPlayedAudios?.audios?.length > 4 ? (
                      <TouchableOpacity
                        onPress={handleActivityHistoryDataSelection}
                        style={styles.showMoreButton}
                      >
                        <Text
                          size={scaleSize(18)}
                          color={colors.logoColor}
                          medium
                          center
                        >
                          {i18n.t("See More")}
                        </Text>
                      </TouchableOpacity>
                    ) : null}

                    {/* Favorite Audio */}
                    <Divider
                      dividerHeight={1.1}
                      dividerBgColor={colors.white}
                    />
                    <Block
                      flex={false}
                      style={{ marginTop: perfectSize(12) }}
                      row
                      center
                    >
                      <Image
                        style={{
                          height: 32,
                          width: 32,
                          tintColor: colors.white,
                        }}
                        source={require("../../assets/appImages/favorite.png")}
                      />
                      <Text
                        size={scaleSize(24)}
                        color={colors.white}
                        regular
                        center
                        style={{ marginHorizontal: perfectSize(10) }}
                      >
                        {i18n.t("My Favorite")}
                      </Text>
                    </Block>
                    <Block
                      flex={false}
                      row
                      center
                      style={{ marginTop: perfectSize(10) }}
                    >
                      <FlatList
                        data={favourites?.slice(0, 4) || []}
                        renderItem={renderFavoriteImageItem}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        ListEmptyComponent={() => (
                          <EmptyComponent
                            description={`${i18n.t(
                              "When you find an audio that you"
                            )} ${i18n.t("like, add it to your favorites")}`}
                          />
                        )}
                      />
                    </Block>
                    {favourites?.length > 4 && (
                      <TouchableOpacity
                        onPress={handleFavoriteSeasonsSelection}
                        style={styles.showMoreButton}
                      >
                        <Text
                          size={scaleSize(18)}
                          color={colors.logoColor}
                          medium
                          center
                        >
                          {i18n.t("See More")}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </Block>
                </ScrollView>
              </Block>
            </Block>
          </ImageBackground>
        </Block>
      )}
    </Block>
  );
};

export default MySelection;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: perfectSize(16),
  },
  title: {
    marginTop: perfectSize(32),
  },
  bgImage: {
    flex: 1,
    // height: deviceHeight,
    // width: deviceWidth,
  },
  listContent: {
    paddingBottom: perfectSize(20),
  },
  showMoreButton: {
    paddingVertical: perfectSize(10),
    borderRadius: perfectSize(5),
    alignItems: "center",
  },
  dividertwo: {
    width: "100%",
    height: perfectSize(1),
    marginTop: perfectSize(10),
    alignSelf: "center",
    paddingHorizontal: perfectSize(20),
  },
  row: {
    justifyContent: "space-between",
  },
  imageContainer: {
    position: "relative",
    marginTop: perfectSize(10),
  },
  image: {
    height: deviceWidth * 0.3,
    width: deviceWidth * 0.44,
  },
  timeText: {
    position: "absolute",
    bottom: perfectSize(5),
    right: perfectSize(7),
  },
  titleText: {
    padding: perfectSize(4),
    top: perfectSize(2),
    marginBottom: perfectSize(10),
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});
