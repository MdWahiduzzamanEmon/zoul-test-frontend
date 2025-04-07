/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
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
import { colors, deviceWidth } from "../../styles/theme";
import CustomDropDown from "../../components/customDropDown/CustomDropDown";
import BackIcon from "../../assets/appImages/svgImages/BackIcon.svg";
import SuggestYourPlan from "../../components/suggestYourPlan/SuggestYourPlan";
import SearchButton from "../../assets/appImages/svgImages/SearchButton";
import FavouriteIcon from "../../assets/appImages/svgImages/FavouriteIcon.svg";
import FreeAudios from "../../components/freeAudios/FreeAudios";
import DownloadIcon from "../../assets/appImages/svgImages/DownloadIcon.svg";
import {
  fetchRecentlyPlayedAudios,
  getOnePlayList,
  getUserFavouritesAudio,
} from "../../resources/baseServices/app";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllAudioListsData,
  setAllExtraAudioListsData,
  setAllFreeAudioListsData,
  setIsLooped,
  setLoopedList,
  setLoopedListId,
  setOnePlayListsData,
} from "../../store/storeAppData/playlists";
import { getUserFavourites } from "../../store/storeAppData/favouritesAudio";
import ListEmptyComponent from "../../components/emptyComponent/EmptyComponent";
import {
  formatTime,
  getTitleByLanguage,
  handleLanguageChange,
} from "../../helpers/app";
import i18n from "../../translations/i18n";
import PlaylistSkeleton from "../../components/skeletonPlaceholder/PlaylistSkeleton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SmallPlayer from "../../components/small-player/SmallPlayer";
import { MeditationSessionModal } from "../../modules/modals/MeditationSessionModal";
import { useModal } from "../../context/ModalContext";
import { useLocale } from "../../context/LocaleProvider";
import { getLocalizedContent } from "../../helpers/audioGoalLocalization";
import SubscriptionModal from "../../components/subscriptionModal/SubscriptionModal";
import { setIsFirstFreeAudioPlay } from "../../store/storeAppData/actions/subscriptionAction";
import { usePlayer } from "../../modules/player";
import { useSmallPlayer } from "../../modules/player/SmallPlayerProvider";
import Loader from "../../components/loader/Loader";
import GettingOverplaylistSkeleton from "../../components/skeletonPlaceholder/GettingOverplaylistSkeleton";
import CongratulationsIcon from "../../assets/appImages/svgImages/CongratulationsIcon.svg";
import RNRestart from "react-native-restart";
import { COMING_SOON, RECENTLY_PLAYED_EMPTY } from "../../constants/errors";
import { storeLanguage } from "../../helpers/auth";
import { YEARLY, YEARLY_PROMO } from "../../constants/InAppPurchase";
import { LandingLogo } from "../../icons/landing/landing-logo";
import { SCREEN_WIDTH } from "../../constants/metrics";
import CongratsModal from "../../components/subscriptionModal/CongratulationsModal";
import { useFocusEffect } from "@react-navigation/native";
import { PlayerContext } from "../../modules/player/context";
import { setAudioToRecentlyPlayed } from "../../store/storeAppData/actions/recentlyPlayedAudiosAction";
import NetworkModal from "../../components/modal/NetworkModal";
import { useNetInfoInstance } from "@react-native-community/netinfo";
import CustomToast from "../../components/customToast/CustomToast";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GettingOverplaylist = ({ navigation, route }) => {
  const [playlist, setPlaylist] = useState("");

  const player = usePlayer();
  const currentPlaylistId = player?.activeTrack?.playlistId;

  const smallPlayer = useSmallPlayer();
  const [isOnePlayListsDataLoading, setIsOnePlayListsDataLoading] =
    useState(false);
  const [openSubscriptionModal, setOpenSubscriptionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isChangeStatus, setISChangeStatus] = useState({
    isVisible: false,
    repeatMode: false,
    repeatModeOnAction: "Playlist looping is enabled.",
    repeatModeOffAction: "Playlist looping is disabled.",
  });

  const dispatch = useDispatch();
  const { changeLocale } = useLocale();
  const { top } = useSafeAreaInsets();
  const modal = useModal();
  // const item = route?.params?.item;
  const [item, setItem] = useState(route?.params?.item);
  const isExploreMasterChoice = route?.params?.isExploreMasterChoice;

  const {
    showFavouriteIcon,
    showDownloadIcon,
    isRecentlyPlayed,
    isFreeAudio,
    isDeepSleep,
    isDownloadedAudio,
    isExtra,
    isDuchess,
  } = route?.params;

  const isUserSubscribed = useSelector(
    (state) => state?.subscription?.isUserSubscribed
  );

  const loopedList = useSelector(
    (state) => state?.playlistsReducer?.loopedList
  );

  const isLooping = useSelector((state) => state?.playlistsReducer?.isLooping);
  // const isLooping = useSelector((state) => {
  //   console.log("Redux state updated:", state?.playlistsReducer?.isLooping);
  //   return state?.playlistsReducer?.isLooping;
  // });

  const loopedListId = useSelector(
    (state) => state?.playlistsReducer?.loopedListId
  );

  const favourites = useSelector(
    (state) => state?.favouritesAudioReducer?.favourites || []
  );

  const selectedLanguage = useSelector(
    (state) => state?.language.selectedLanguage
  );

  const homeMasterPlaylistIds = useSelector(
    (state) => state?.playlistsReducer?.homeMasterPlaylistIds
  );

  const getOnePlayListData = useSelector((state) => {
    return state?.playlistsReducer?.getOnePlayListData;
  });

  const recentlyPlayedAudiosSaved = useSelector(
    (state) => state?.recentlyPlayedAudiosReducer?.recentlyPlayedAudios
  );

  const downloadData = useSelector(
    (state) => state?.playlistsReducer?.downloadAudioListData
  );

  const allAudios = useSelector((state) => state?.playlistsReducer?.allAudios);

  const allExtraAudios = useSelector(
    (state) => state?.playlistsReducer?.allExtraAudios
  );
  const allInitialAudios = useSelector(
    (state) => state?.playlistsReducer?.allInitialAudios
  );

  const allExtraInitialAudios = useSelector(
    (state) => state?.playlistsReducer?.allExtraInitialAudios
  );

  const allFreeAudios = useSelector(
    (state) => state?.playlistsReducer?.allFreeAudios
  );

  const allFreeInitialAudios = useSelector(
    (state) => state?.playlistsReducer?.allFreeInitialAudios
  );

  const [forceRender, setForceRender] = useState(isLooping);

  // useEffect(() => {
  //   setForceRender((prev) => !prev); // Toggle state to force a re-render
  // }, [isLooping]);

  // useFocusEffect(
  //   React.useCallback(async () => {
  //     const firstValidPlaylistId = await AsyncStorage.getItem(
  //       "firstValidPlaylistId"
  //     );
  //     const lastValidPlaylistId = await AsyncStorage.getItem(
  //       "lastValidPlaylistId"
  //     );

  //     console.log("firstValidPlaylistId", firstValidPlaylistId, item?.id);
  //     console.log("lastValidPlaylistId", lastValidPlaylistId, currentPlaylistId);
  //     setItem({ id: currentPlaylistId });

  //     if (
  //       currentPlaylistId != null &&
  //       currentPlaylistId != "" &&
  //       currentPlaylistId != undefined
  //       // item?.id == currentPlaylistId &&
  //       // currentPlaylistId != firstValidPlaylistId &&
  //       // currentPlaylistId != lastValidPlaylistId
  //     ) {
  //       fetchPlaylistData(currentPlaylistId);
  //     }
  //   }, [currentPlaylistId])
  // );

  useEffect(() => {
    if (getOnePlayListData?.id && getOnePlayListData?.id == loopedListId) {
      dispatch(setIsLooped(true));
      dispatch(setLoopedList(getOnePlayListData?.audios));
    } else {
      dispatch(setIsLooped(false));
      dispatch(setLoopedList([]));
      dispatch(setLoopedListId(""));
    }

    // fetchPlaylistData();
    updateMasterChoiceAudios();
  }, [
    selectedLanguage,
    getOnePlayListData?.id,
    loopedListId,
    getOnePlayListData?.audios,
    updateMasterChoiceAudios,
    dispatch,
  ]);

  useEffect(() => {
    fetchPlaylistData(item?.id);
  }, []);

  useEffect(() => {
    if (showFavouriteIcon) {
      fetchFavouriteAudios();
    }
  }, [showFavouriteIcon]);

  const fetchPlaylistData = async (id) => {
    setIsLoading(true);
    try {
      if (showDownloadIcon) {
        return;
      }
      setIsOnePlayListsDataLoading(true);
      if (isRecentlyPlayed) {
        if (recentlyPlayedAudiosSaved?.audios?.length == 0) {
          const recentlyPlayedAudios = await fetchRecentlyPlayedAudios();
          dispatch(setAudioToRecentlyPlayed(recentlyPlayedAudios?.data));
          const updatedAudios = recentlyPlayedAudios?.data?.audios
            ?.filter(
              (audio) =>
                audio[`title_${selectedLanguage?.toUpperCase()}`] &&
                audio[`link_${selectedLanguage?.toUpperCase()}`]
            )
            .map((items) =>
              getLocalizedContent(items, selectedLanguage?.toUpperCase())
            )
            .filter((audio) => audio?.link && audio?.title);
          setPlaylist({
            ...recentlyPlayedAudios?.data,
            audios: updatedAudios,
          });
        } else {
          const updatedAudios = recentlyPlayedAudiosSaved?.audios
            ?.filter(
              (audio) =>
                audio[`title_${selectedLanguage?.toUpperCase()}`] &&
                audio[`link_${selectedLanguage?.toUpperCase()}`]
            )
            .map((items) =>
              getLocalizedContent(items, selectedLanguage?.toUpperCase())
            )
            .filter((audio) => audio?.link && audio?.title);
          setPlaylist({ ...recentlyPlayedAudiosSaved, audios: updatedAudios });
        }

        setIsLoading(false);
        return;
      }
      const res = await getOnePlayList(id);
      const playlistData = res?.data;
      const updatedAudios = playlistData?.audios
        ?.filter(
          (audio) =>
            audio[`title_${selectedLanguage?.toUpperCase()}`] &&
            audio[`link_${selectedLanguage?.toUpperCase()}`]
        )
        .map((items) =>
          getLocalizedContent(items, selectedLanguage?.toUpperCase())
        )
        .filter((audio) => audio?.link && audio?.title && audio?.duration);

      const temp = updatedAudios.map((it) => {
        return { ...it, playlistId: id };
      });
      dispatch(setOnePlayListsData({ ...playlistData, audios: temp }));
      setPlaylist({ ...playlistData, audios: temp });
    } catch (error) {
      console.error("Error fetchPlaylistData =--->", error);
    } finally {
      setIsOnePlayListsDataLoading(false);
      setIsLoading(false);
    }
  };

  const fetchFavouriteAudios = async () => {
    try {
      const res = await getUserFavouritesAudio();

      const audioData = res?.data?.audios
        ?.filter(
          (audio) =>
            audio[`title_${selectedLanguage?.toUpperCase()}`] &&
            audio[`link_${selectedLanguage?.toUpperCase()}`]
        )
        ?.map((items, index) =>
          getLocalizedContent(items, selectedLanguage?.toUpperCase())
        )
        .filter((audio) => audio?.link && audio?.title && audio?.duration);
      dispatch(getUserFavourites(audioData));
    } catch (error) {
      console.error("Error fetchFavouriteAudios =--->", error);
    } finally {
      console.log("Done");
    }
  };

  const updateMasterChoiceAudios = useCallback(async () => {
    try {
      const updatedMasterChoiceAudios = allInitialAudios
        ?.filter(
          (audio) =>
            audio[`title_${selectedLanguage?.toUpperCase()}`] &&
            audio[`link_${selectedLanguage?.toUpperCase()}`]
        )
        .map((items) => {
          const localizedAudio = getLocalizedContent(
            items,
            selectedLanguage?.toUpperCase()
          );
          return localizedAudio;
        })
        .filter((audio) => audio?.link && audio?.title && audio?.duration);
      dispatch(setAllAudioListsData(updatedMasterChoiceAudios));

      const updatedExtraAudios = allExtraInitialAudios
        ?.filter(
          (audio) =>
            audio[`title_${selectedLanguage?.toUpperCase()}`] &&
            audio[`link_${selectedLanguage?.toUpperCase()}`]
        )
        ?.map((audio) => {
          const localizedAudio = getLocalizedContent(
            audio,
            selectedLanguage?.toUpperCase()
          );
          return localizedAudio;
        })
        .filter((audio) => audio?.link && audio?.title && audio?.duration);
      dispatch(setAllExtraAudioListsData(updatedExtraAudios));

      const updateFreeAudios = allFreeInitialAudios
        ?.filter(
          (audio) =>
            audio[`title_${selectedLanguage?.toUpperCase()}`] &&
            audio[`link_${selectedLanguage?.toUpperCase()}`]
        )
        .map((audio) => {
          const localizedAudio = getLocalizedContent(
            audio,
            selectedLanguage?.toUpperCase()
          );
          return localizedAudio;
        })
        .filter((audio) => audio?.link && audio?.title && audio?.duration);
      dispatch(setAllFreeAudioListsData(updateFreeAudios));
    } catch (error) {
      console.error("Error updateMasterChoiceAudios =--->", error);
    }
  }, [
    allExtraInitialAudios,
    allFreeInitialAudios,
    allInitialAudios,
    dispatch,
    selectedLanguage,
  ]);

  useEffect(() => {
    consoleLog("playerState", player.activeTrack);
    if (
      !player?.activeTrack?.url?.length &&
      !isRecentlyPlayed &&
      (isUserSubscribed || isFreeAudio)
    ) {
      playFirstAudio(isLooping);
    }
  }, [
    playlist,
    isFreeAudio,
    isDeepSleep,
    isRecentlyPlayed,
    isExtra,
    isUserSubscribed,
    isDuchess,
    isLooping,
    forceRender,
  ]);

  const playFirstAudio = (isLooping) => {
    let loopedList = isLooping ? getOnePlayListData?.audios : allAudios;
    const allPlaylistAudioData =
      isExploreMasterChoice && homeMasterPlaylistIds?.includes(item.id)
        ? allAudios || []
        : [...(allAudios || []), ...(playlist?.audios || [])];

    const isNotPremiumAudioList = !isUserSubscribed
      ? playlist?.audios?.filter((audio) => !audio.premium)
      : playlist?.audios;

    const updatedAudioList =
      isLooping && isUserSubscribed
        ? loopedList
        : isDuchess
        ? playlist?.audios || []
        : isFreeAudio && isNotPremiumAudioList?.length
        ? isDeepSleep
          ? isNotPremiumAudioList || []
          : allFreeAudios
        : isDeepSleep && isUserSubscribed
        ? playlist?.audios || []
        : isUserSubscribed && isExtra
        ? allExtraAudios
        : isExploreMasterChoice
        ? allPlaylistAudioData
        : allAudios || [];

    const isAnyIdMatched = isNotPremiumAudioList?.some((audio) =>
      updatedAudioList?.some((updatedAudio) => updatedAudio.id === audio.id)
    );
    if (isLooping) {
      loopedList?.length > 0 &&
        modal.show(SmallPlayer, {
          track: loopedList?.[0],
          playlist: loopedList,
        });
    } else {
      updatedAudioList?.length > 0 &&
        isAnyIdMatched &&
        modal.show(SmallPlayer, {
          track: isNotPremiumAudioList?.[0],
          playlist: updatedAudioList,
        });
    }
  };

  const managePlaylistOnPress = (item) => {
    console.log("PlayerState", player.activeTrack, player.state);
    const allPlaylistAudioData =
      isExploreMasterChoice && homeMasterPlaylistIds?.includes(item.id)
        ? allAudios || []
        : [...(allAudios || []), ...(playlist?.audios || [])];
    try {
      if (!isUserSubscribed && !isFreeAudio && !isRecentlyPlayed) {
        setOpenSubscriptionModal(true);
        return;
      }

      if (!isUserSubscribed && isFreeAudio && !isDownloadedAudio) {
        dispatch(setIsFirstFreeAudioPlay(true));
      }

      const allData =
        isLooping && isUserSubscribed
          ? loopedList
          : isDuchess
          ? playlist?.audios || []
          : showFavouriteIcon
          ? favourites
          : showDownloadIcon
          ? downloadData
          : isFreeAudio
          ? isDeepSleep
            ? playlist?.audios || []
            : allFreeAudios
          : isDeepSleep
          ? playlist?.audios || []
          : isRecentlyPlayed
          ? playlist?.audios || []
          : isExtra
          ? allExtraAudios || []
          : isExploreMasterChoice
          ? allPlaylistAudioData
          : allAudios || [];

      modal.show(MeditationSessionModal, {
        track: item,
        playlist: allData,
        isFreeAudio: isFreeAudio,
        isDownloadedAudio,
        isRecentlyPlayed,
        // onClose: () => {
        //   // modal.close();
        //   setTimeout(() => {
        //     smallPlayer.openSmallPlayer();
        //     updateCurrentList();
        //   }, 1000);
        //   // consoleLog("Closed");
        // },
      });
    } catch (error) {
      console.error("Error managePlaylistOnPress =--->", error);
    }
  };

  const ListHeaderComponent = () => {
    const IMG = showDownloadIcon
      ? Platform.OS === "android"
        ? isRecentlyPlayed
          ? getOnePlayListData?.coverImage
          : `file://${downloadData[0]?.bannerImage}`
        : downloadData[0]?.bannerImage
      : getOnePlayListData?.coverImage;
    if (!IMG) {
      return;
    }
    return (
      <Block flex={false}>
        <Text regular size={scaleSize(18)} light color={colors.white}>
          {i18n.t("Playlist")}
        </Text>

        {isRecentlyPlayed ? null : (
          <FreeAudios
            image={IMG}
            description={
              !isRecentlyPlayed &&
              playlist?.[`description_${selectedLanguage?.toUpperCase()}`]
            }
            showDescription={true}
            // isPremium={!isUserSubscribed}
            extraplaylistContainerStyle={{
              width: "100%",
              borderRadius: 0,
              marginTop: perfectSize(10),
            }}
            extraimageBackgroundStyle={{
              borderRadius: 0,
            }}
            extraTitleStyle={{
              fontSize: scaleSize(20),
              // lineHeight: scaleSize(20),
            }}
            onPress={() => {}}
            isShowAudioContent={false}
            isBlurView={showFavouriteIcon || showDownloadIcon ? true : false}
            isshowResetIcon={isUserSubscribed}
            isLoop={
              isLooping &&
              isUserSubscribed &&
              loopedListId == getOnePlayListData?.id
            }
            onPressLoop={() => {
              player.pause();
              dispatch(
                setLoopedListId(isLooping ? "" : getOnePlayListData?.id)
              );
              dispatch(setIsLooped(!isLooping));
              dispatch(
                setLoopedList(
                  !isLooping ? getOnePlayListData?.audios : allAudios
                )
              );
              setISChangeStatus((prevState) => ({
                ...prevState,
                isVisible: true,
                repeatMode: !isLooping,
              }));
              player.reset();
              smallPlayer.hideSmallPlayer();
              setForceRender((prev) => !prev);

              setTimeout(() => {
                playFirstAudio(!isLooping);
              }, 1000);
            }}
            dataLength={
              showFavouriteIcon
                ? favourites?.length
                : showDownloadIcon
                ? downloadData?.length
                : playlist?.audios?.length
            }
            noPlayIcon={true}
          />
        )}
      </Block>
    );
  };

  const title =
    playlist?.[`title_${selectedLanguage?.toUpperCase()}`] ||
    playlist?.title_EN ||
    playlist?.title;

  const renderItem = ({ item, index }) => {
    const img =
      showDownloadIcon && Platform.OS === "android"
        ? `file://${item?.bannerImage}`
        : item?.bannerImage;

    return (
      <SuggestYourPlan
        image={img}
        title={item?.title}
        onPress={() => managePlaylistOnPress(item, index)}
        duration={formatTime(item?.duration * 1000)}
        mainContainer={{ marginTop: perfectSize(8) }}
        stylesProps={{
          widthRatio: 0.43,
          heightRatio: 1.42857,
          textTitleSize: 15,
        }}
      />
    );
  };

  const [NetworkModalVisible, setNetworkModalvisible] = useState(true);
  const {
    netInfo: { type, isConnected },
    refresh,
  } = useNetInfoInstance();

  useFocusEffect(
    useCallback(() => {
      setNetworkModalvisible(true);
    }, [])
  );
  return (
    <Block flex={1}>
      {isLoading ? (
        // <Loader />
        <Block flex={1} style={{ paddingTop: top }}>
          <GettingOverplaylistSkeleton />
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
            <Block flex={1}>
              {/* header View */}
              <Block flex={false}>
                <Block
                  flex={false}
                  row
                  between
                  style={{
                    paddingRight: perfectSize(20),
                    paddingLeft: perfectSize(14),
                    justtifyContent: "space-between",
                    alignItems: "flex-end",
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
                  {isRecentlyPlayed && (
                    <Block flex={false} style={{ marginRight: perfectSize(7) }}>
                      <Image
                        style={{
                          height: 32,
                          width: 32,
                          tintColor: colors.white,
                        }}
                        source={require("../../assets/appImages/recent.png")}
                      />
                    </Block>
                  )}
                  {showFavouriteIcon && (
                    <Block flex={false} style={{ marginRight: perfectSize(7) }}>
                      <Image
                        style={{
                          height: 32,
                          width: 32,
                          tintColor: colors.white,
                        }}
                        source={require("../../assets/appImages/favorite.png")}
                      />
                    </Block>
                  )}
                  {showDownloadIcon && (
                    <Block flex={false} style={{ marginRight: perfectSize(7) }}>
                      <Image
                        style={{
                          height: 32,
                          width: 32,
                          tintColor: colors.white,
                        }}
                        source={require("../../assets/appImages/download.png")}
                      />
                    </Block>
                  )}

                  <Text
                    medium
                    size={scaleSize(32)}
                    color={colors.white}
                    style={{
                      width: SCREEN_WIDTH * 0.5,
                    }}
                  >
                    {isRecentlyPlayed
                      ? i18n.t("Recently Played")
                      : ((showFavouriteIcon && "Favorite") ||
                          (showDownloadIcon && i18n.t("Download")) ||
                          title ||
                          playlist?.title_EN) ??
                        ""}
                  </Text>
                  <CustomDropDown
                    isDisable={!isConnected}
                    onChange={async (lg) => {
                      if (isConnected) {
                        await storeLanguage("SET", lg);
                        handleLanguageChange(lg, dispatch, changeLocale);
                        player.reset();
                        RNRestart.Restart();
                        smallPlayer?.hideSmallPlayer();
                      }
                    }}
                  />
                </Block>
                {/* <Block
                  flex={false}
                  padding={[
                    perfectSize(19),
                    perfectSize(18),
                    0,
                    perfectSize(12),
                    0,
                  ]}
                  row
                  between
                  center
                >
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon height={32} width={32} />
                  </TouchableOpacity>
                  <Block
                    flex={false}
                    // marginBottom={scaleSize(10)}
                    // center
                    // bottom
                    style={{
                      // marginTop: 10
                    }}
                  >
                    <LandingLogo height={perfectSize(60)} width={perfectSize(100)} />
                  </Block>
                  <CustomDropDown
                    onChange={async (lg) => {
                      await storeLanguage("SET", lg);
                      handleLanguageChange(lg, dispatch, changeLocale);
                      player.reset();
                      smallPlayer?.hideSmallPlayer();
                      RNRestart.Restart();
                    }}
                  />
                </Block> */}

                {/* <Block
                  flex={false}
                  row
                  center
                  paddingHorizontal={perfectSize(20)}
                  style={{ marginTop: perfectSize(15) }}
                >
                  {showFavouriteIcon && (
                    <Block flex={false} style={{ marginRight: perfectSize(7) }}>
                      <FavouriteIcon />
                    </Block>
                  )}
                  {showDownloadIcon && (
                    <Block flex={false} style={{ marginRight: perfectSize(7) }}>
                      <DownloadIcon />
                    </Block>
                  )}

                  <Text medium size={scaleSize(28)} color={colors.white}>
                    {isRecentlyPlayed
                      ? "Recently Played"
                      : ((showFavouriteIcon && "Favorite") ||
                        (showDownloadIcon && "Download") ||
                        title ||
                        playlist?.title_EN) ??
                      ""}
                  </Text>
                </Block> */}
              </Block>

              {/* Main Banner View */}
              {/* <Block flex={1} style={{ paddingHorizontal: perfectSize(20) }}> */}
              <Block
                flex={1}
                row
                style={{
                  marginTop: perfectSize(8),
                  paddingHorizontal: perfectSize(20),
                }}
              >
                <FlatList
                  data={
                    showFavouriteIcon
                      ? favourites
                      : showDownloadIcon
                      ? downloadData
                      : playlist?.audios
                  }
                  keyExtractor={(item, index) => index}
                  numColumns={2}
                  columnWrapperStyle={styles.row}
                  renderItem={renderItem}
                  ListHeaderComponent={() =>
                    !(showDownloadIcon && downloadData?.length == 0) ? (
                      <ListHeaderComponent />
                    ) : null
                  }
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    flexGrow: 1,
                  }}
                  ListEmptyComponent={() => (
                    <ListEmptyComponent
                      message={
                        isRecentlyPlayed ? RECENTLY_PLAYED_EMPTY : COMING_SOON
                      }
                    />
                  )}
                  ListFooterComponent={() => {
                    return <Block flex={false} height={perfectSize(80)} />;
                  }}
                />
              </Block>
              {/* </Block> */}
            </Block>
          </ImageBackground>
        </Block>
      )}
      <SmallPlayer
        isFreeAudio={isFreeAudio}
        isDownloadedAudio={isDownloadedAudio}
      />
      <CustomToast
        hideOn={2000}
        animationDuration={100}
        visible={isChangeStatus?.isVisible}
        message={
          isChangeStatus?.repeatMode
            ? isChangeStatus?.repeatModeOnAction
            : isChangeStatus?.repeatModeOffAction
        }
        onHide={() =>
          setISChangeStatus((prevState) => ({
            ...prevState,
            isVisible: false,
          }))
        }
      />
      {openSubscriptionModal && (
        <SubscriptionModal
          isVisible={openSubscriptionModal || true}
          hideModal={() => {
            setOpenSubscriptionModal(false);
          }}
          onSubscribedUser={(plan) => {
            setOpenSubscriptionModal(false);
            setTimeout(() => {
              modal.show(CongratsModal, {
                message:
                  plan == YEARLY || plan == YEARLY_PROMO
                    ? i18n.t("Year Plan Update")
                    : i18n.t("Month Plan Update"),
                btnTitle: "Ok",
              });
            }, 1000);
          }}
        />
      )}
      <NetworkModal
        // isVisible={isConnected&&(!NetworkModalVisible)}
        isVisible={
          isConnected == false &&
          (showDownloadIcon == false || showDownloadIcon == undefined)
        }
        refresh={refresh}
        onPress={() => {
          player.pause();
          modal.close();
          navigation.navigate("GettingOverplaylist", {
            showDownloadIcon: true,
          });
          setNetworkModalvisible(false);
        }}
      />
    </Block>
  );
};
export default GettingOverplaylist;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    // height: deviceHeight,
    // width: deviceWidth,
  },
  categoryImageBackground: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
  categoryImageBackgroundBlock: {
    height: perfectSize(180),
  },
  row: {
    justifyContent: "space-between",
  },

  image: {
    height: deviceWidth * 0.3,
    width: deviceWidth * 0.44,
    borderRadius: perfectSize(5),
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: perfectSize(20),
  },
  bgImagemodel: { height: perfectSize(290), width: "100%" },

  modalView: {
    padding: perfectSize(20),
  },
  confettiContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },

  button: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: perfectSize(20),
  },
});
