import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import {
  consoleLog,
  perfectSize,
  responsiveScale,
  scaleFont,
  scaleSize,
} from "../../styles/mixins";
import { colors } from "../../styles/theme";
import SearchButton from "../../assets/appImages/svgImages/SearchButton";
import FreeAudios from "../../components/freeAudios/FreeAudios";
import CustomDropDown from "../../components/customDropDown/CustomDropDown";
import BackIcon from "../../assets/appImages/svgImages/BackIcon.svg";
import { useDispatch, useSelector } from "react-redux";
// import MusicFinishedModal from "../../components/commonBottomSheet/MusicFinishedModal";
import { handleLanguageChange } from "../../helpers/app";
import i18n from "../../translations/i18n";
import AllPlaylistsSkeleton from "../../components/skeletonPlaceholder/AllPlaylistsSkeleton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SmallPlayer from "../../components/small-player/SmallPlayer";
import { useLocale } from "../../context/LocaleProvider";
import { setIsFirstFreeAudioPlay } from "../../store/storeAppData/actions/subscriptionAction";
import { useSmallPlayer } from "../../modules/player/SmallPlayerProvider";
import { usePlayer } from "../../modules/player";
import Loader from "../../components/loader/Loader";
import RNRestart from "react-native-restart";
import ListEmptyComponent from "../../components/emptyComponent/EmptyComponent";
import { COMING_SOON } from "../../constants/errors";
import { storeLanguage } from "../../helpers/auth";
import { LandingLogo } from "../../icons/landing/landing-logo";
import LogoIcon from "../../components/common/SvgIcons/LogoIcon";

const Allplaylists = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { changeLocale } = useLocale();
  const smallPlayer = useSmallPlayer();

  const isSmallPlayerVisible = smallPlayer?.isSmallPlayer;

  const player = usePlayer();
  // const [visible, setVisible] = useState(false);
  // const [nextModalVisible, setNextModalVisible] = useState(false);
  // const [selectedItem, setSelectedItem] = useState(null); // New state variable
  const [isLoading, setIsLoading] = useState(true);
  const { top } = useSafeAreaInsets();
  const isUserSubscribed = useSelector(
    (state) => state?.subscription?.isUserSubscribed
  );

  const selectedLanguage = useSelector(
    (state) => state?.language.selectedLanguage
  );

  const getPlayListData = useSelector(
    (state) => state?.playlistsReducer?.freePlaylists
  );

  const getPaidPlayListData = useSelector(
    (state) => state?.playlistsReducer?.masterPlaylists
  );

  const handlePlaylistSelection = (item, title = "") => {
    // setSelectedItem(item); // Store the selected item
    // setVisible(true);
    // setNextModalVisible(true);
    consoleLog("Selected Playlist", route?.params?.isFreeAudio);

    if (!isUserSubscribed && route?.params?.isFreeAudio) {
      dispatch(setIsFirstFreeAudioPlay(true));
    }

    const isDeepSleep = title === "deep sleep" || title === "sleep";
    const isDuchess = title === "daily dose from duchess";

    navigation.navigate("GettingOverplaylist", {
      item,
      isFreeAudio: route?.params?.isFreeAudio,
      isDeepSleep,
      isDuchess,
    });
  };

  // const handleClose = () => {
  //   setVisible(false);
  //   navigation.navigate("GettingOverplaylist", {
  //     item: selectedItem,
  //     isFreeAudio: true,
  //   });
  // };

  useEffect(() => {
    consoleLog("AllPlaylists", getPlayListData);
    if (getPlayListData && getPlayListData.length > 0) {
      setIsLoading(false);
    }
  }, [getPlayListData]);

  useEffect(() => {
    consoleLog("getPaidPlayListData", getPaidPlayListData);
    if (getPaidPlayListData && getPaidPlayListData.length > 0) {
      setIsLoading(false);
    }
  }, [getPaidPlayListData]);

  return (
    <Block flex={1}>
      {isLoading ? (
        // <Loader />
        <Block flex={1} style={{ paddingTop: top }}>
          <AllPlaylistsSkeleton />
        </Block>
      ) : (
        <Block flex={1}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <ImageBackground
            source={require("../../assets/appImages/ExploreBackgroundImageNew.png")}
            resizeMode="stretch"
            style={[styles.bgImage, { paddingTop: top }]}
          >
            <Block
              flex={1}
              // paddingTop={perfectSize(19)}
              // paddingBottom={perfectSize(19)}
              style={
                {
                  // paddingBottom:perfectSize(19)
                  // paddingBottom:10
                }
              }
            >
              {/* header View */}
              <Block flex={false} style={styles.headerContainer}>
                <Block
                  flex={false}
                  row
                  between
                  style={{
                    paddingRight: perfectSize(20),
                    paddingLeft: perfectSize(14),
                    justtifyContent: "space-between",
                    alignItems: "center",
                  }}
                  center
                >
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon height={32} width={32} />
                  </TouchableOpacity>

                  {/* <LogoIcon height={23} width={26} /> */}

                  <Block
                    flex={false}
                    // marginBottom={scaleSize(10)}
                    // center
                    // bottom
                    style={{
                      // marginTop: 10
                      marginLeft: 12,
                    }}
                  >
                    <LandingLogo
                      color={colors.logoColor}
                      height={perfectSize(60)}
                      width={perfectSize(100)}
                    />
                  </Block>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("SearchScreen")}
                  >
                    <SearchButton height={48} width={48} />
                  </TouchableOpacity>
                </Block>
                <Block
                  flex={false}
                  row
                  between
                  center
                  style={{
                    marginTop: perfectSize(13),
                    paddingHorizontal: perfectSize(20),
                  }}
                >
                  <Text
                    regular
                    width={"67%"}
                    size={responsiveScale(20)}
                    // size={responsiveScale(32)}
                    color={colors.white}
                  >
                    {route?.params?.isFreeAudio
                      ? i18n.t("View_All_Playlists")
                      : i18n.t("Goal-Based Playlists")}
                    {/* { route?.params?.isFreeAudio ? i18n.t("View_All_Playlists") : i18n.t("All Playlists")} */}
                    {/* {i18n.t("All Playlists")} */}
                  </Text>
                  <CustomDropDown
                    onChange={async (lg) => {
                      await storeLanguage("SET", lg);
                      handleLanguageChange(lg, dispatch, changeLocale);
                      player.reset();
                      smallPlayer?.hideSmallPlayer();
                      RNRestart.Restart();
                    }}
                  />
                </Block>
              </Block>

              {getPlayListData?.length > 0 || getPaidPlayListData ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom:
                      perfectSize(36) +
                      perfectSize(isSmallPlayerVisible ? 64 : 0),
                  }}
                >
                  <Block flex={false}>
                    <FlatList
                      data={
                        route?.params?.isFreeAudio
                          ? getPlayListData
                          : getPaidPlayListData
                      }
                      // data={getPlayListData}
                      ItemSeparatorComponent={
                        <View style={{ height: perfectSize(15) }} />
                      }
                      ListEmptyComponent={() => {
                        return !route?.params?.isFreeAudio ? (
                          <Block
                            flex={1}
                            center
                            middle
                            margin={[responsiveScale(10), 0]}
                          >
                            <Text
                              regular
                              size={scaleSize(15)}
                              color={colors.white}
                              center
                            >
                              {COMING_SOON || `No ${title} found!`}
                            </Text>
                          </Block>
                        ) : null;
                      }}
                      renderItem={({ item }) => {
                        const title =
                          item?.[`title_${selectedLanguage.toUpperCase()}`] ||
                          item?.title_EN ||
                          item?.title;

                        const description =
                          item?.[
                            `description_${selectedLanguage.toUpperCase()}`
                          ] ||
                          item?.description_EN ||
                          item?.description;

                        return (
                          // <TouchableOpacity
                          //   onPress={() => handlePlaylistSelection(item)}
                          // >
                          <FreeAudios
                            title={title}
                            image={item.coverImage}
                            description={description}
                            extraplaylistContainerStyle={{
                              width: "100%",
                              marginTop: perfectSize(0),
                            }}
                            // showDescription={true}
                            extraMainViewStyle={{
                              // marginBottom: perfectSize(30),
                              paddingHorizontal: perfectSize(28),
                            }}
                            extraTitleStyle={{
                              fontSize: scaleSize(20),
                              // lineHeight: scaleSize(20),
                            }}
                            extraDescriptionTextStyle={{
                              fontSize: responsiveScale(16),
                            }}
                            onPress={() =>
                              handlePlaylistSelection(
                                item,
                                item?.title?.toLowerCase()
                              )
                            }
                            isPremium={
                              !isUserSubscribed && !route?.params?.isFreeAudio
                            }
                          />
                          // </TouchableOpacity>
                        );
                      }}
                      keyExtractor={(item) => item.id}
                      showsHorizontalScrollIndicator={false}
                    />
                  </Block>
                </ScrollView>
              ) : (
                <ListEmptyComponent message={COMING_SOON} />
              )}
            </Block>
          </ImageBackground>
        </Block>
      )}
      <SmallPlayer />
      {/* <MusicFinishedModal
        visible={visible}
        nextModalVisible={nextModalVisible}
        handleClose={handleClose}
      /> */}
    </Block>
  );
};
export default Allplaylists;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: scaleSize(16),
  },
  image: {
    height: perfectSize(140),
    width: perfectSize(231),
    borderRadius: 10,
  },
  absolute: {
    position: "absolute",
    top: perfectSize(0),
    left: perfectSize(0),
    bottom: perfectSize(0),
    right: perfectSize(0),
  },
});
