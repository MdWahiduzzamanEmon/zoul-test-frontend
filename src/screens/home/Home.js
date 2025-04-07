import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
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
  scaleSize,
} from "../../styles/mixins";
import { colors, deviceHeight, deviceWidth, font } from "../../styles/theme";
import SearchButton from "../../assets/appImages/svgImages/SearchButton";
import CustomDropDown from "../../components/customDropDown/CustomDropDown";
import StreamBg from "../../assets/appImages/stream_bg.png";
import LiveIcon from "../../assets/appImages/live_icon.png";
import {
  getUserProfile,
  updateProfile,
} from "../../resources/baseServices/auth";
import { useModal } from "../../context/ModalContext";
import { ErrorDialog } from "../../components/modal/Modal";
import {
  fetchDailyPlan,
  fetchRecentlyPlayedAudios,
  fetchUserHoroscopeReminders,
  getAllUserPlaylists,
  getDailyWisdomToday,
  getGlobalContentHome,
  getHoroscopeToday,
  getImages,
  getLiveStreams,
  getOnePlayList,
  getUserFavouritesAudio,
  updateTokens,
  getHomePageBanners,
  getLiveStreamBanners,
} from "../../resources/baseServices/app";
import { useDispatch, useSelector } from "react-redux";
import { setCategoriesData } from "../../store/storeAppData/categories";
import {
  setAllAudioListsData,
  setAllExtraAudioListsData,
  setAllFreeAudioListsData,
  setAllInitialAudios,
  setAllInitialExtraAudios,
  setAllInitialFreeAudios,
  setAllUserPlayListsData,
  setFreePlaylists,
  setFreePlaylistsBanner,
  setHomeMasterPlaylistIds,
  setmasterPlaylists,
  setRecentlyPlayedPlaylistBanner,
} from "../../store/storeAppData/playlists";
import {
  persistHoroscopeData,
  setDailyWisdomData,
} from "../../store/storeAppData/dailyWisdom";
import { setUserProfile } from "../../store/user/user";
import { setDailyPlansData } from "../../store/storeAppData/actions/dailyPlansAction";
import { setAudioToRecentlyPlayed } from "../../store/storeAppData/actions/recentlyPlayedAudiosAction";
import {
  buildShortLinkForDailyWisdom,
  getGreeting,
  getLocalizedDataFromFile,
  handleLanguageChange,
  setLastApiCallDate,
  sortDataByOrder,
  transformData,
} from "../../helpers/app";
import { OneSignal } from "react-native-onesignal";
import i18n from "../../translations/i18n";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeSkeleton from "../../components/skeletonPlaceholder/HomeSkeleton";
import { formatDateISO } from "../../constants/languages";
import SmallPlayer, {
  SmallPlayerBottomSpace,
} from "../../components/small-player/SmallPlayer";
import { MeditationSessionModal } from "../../modules/modals/MeditationSessionModal";
import SubscriptionModal from "../../components/subscriptionModal/SubscriptionModal";
import {
  setIsUserSubscribed,
  setSubscribedUser,
} from "../../store/storeAppData/actions/subscriptionAction";
import { useLocale } from "../../context/LocaleProvider";
import { getUserFavourites } from "../../store/storeAppData/favouritesAudio";
import { fetchHoroScopeReminder } from "../../store/settings/setting";
import { useFocusEffect } from "@react-navigation/native";
import { getLocalizedContent } from "../../helpers/audioGoalLocalization";
import useDynamicLinkHandler from "../../hooks/useDynamicLinkHandler";
import { usePlayer } from "../../modules/player";
import { useSmallPlayer } from "../../modules/player/SmallPlayerProvider";
import {
  ERROR_CONTACT_SUPPORT_MESSAGE,
  ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
} from "../../constants/errors";
import useVersionUpdateHandler from "../../hooks/useVersionUpdateHandler";
import UpdateVersionModal from "../../components/modal/UpdateVersionModal";
import HoroscopeView from "../../components/horoscopeView/HoroscopeView";
import FreePlaylistView from "../../components/freePlaylistView/FreePlaylistView";
import MasterChoicePlaylistsView from "../../components/masterChoicePlaylistsView/MasterChoicePlaylistsView";
import SuggestedDailyPlanView from "./components/SuggestedDailyPlanView";
import RecentlyPlayedView from "../../components/recentlyPlayedView/RecentlyPlayedView";
import {
  setDefaultAudioData,
  setIsDailyWisdom,
  setRandomImages,
} from "../../store/audio-category/audioLink";

import AsyncStorage from "@react-native-async-storage/async-storage";
import InAppReview from "react-native-in-app-review";
import useRatePopUpHandler from "../../hooks/useRatePopUpHandler";
import { getTransformedUrl } from "../../utils/ImageService";
import { Backgrounds } from "../../data/background";
import RNRestart from "react-native-restart";
import { SCREEN_NAMES } from "../../utils/utils";
import {
  FONT_WEIGHT_SEMI_BOLD,
  PLAYFAIR_SEMIBOLD,
} from "../../styles/typography";
import { setLiveStreams } from "../../store/liveStream";
import LetterSectionModal from "../../components/modal/LetterSectionModal";
import {
  getAuthToken,
  getRefreshToken,
  setAuthToken,
  setRefreshToken,
  storeLanguage,
} from "../../helpers/auth";
import { mapToTrackFlyweight } from "../../modules/player/utils";

import NetworkModal from "../../components/modal/NetworkModal";
import MasterEventLogger from "../../utils/MasterEventLogger";
import { SCREEN_WIDTH } from "../../constants/metrics";
import { LandingLogo } from "../../icons/landing/landing-logo";
import LogoIcon from "../../components/common/SvgIcons/LogoIcon";
import AuthenticationModal from "../../components/modal/AuthenticationModal";
import useAuthorizedSession from "../../hooks/useAuthorizedSession";

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const [authToken] = useAuthorizedSession();

  useEffect(() => {
    const updateUserTokens = async () => {
      const refreshToken = await getRefreshToken();
      const accessToken = await getAuthToken();

      if (!refreshToken) {
        try {
          const response = await updateTokens({ accessToken });
          if (response?.data?.accessToken && response?.data?.refreshToken) {
            await setAuthToken(response?.data?.accessToken);
            await setRefreshToken(response?.data?.refreshToken);
          }
        } catch (error) {
          console.error("error while updating user tokens", error);
        }
      }
    };
    updateUserTokens();
  }, []);

  // const [NetworkModalVisible, setNetworkModalvisible] = useState(true);

  const { changeLocale } = useLocale();
  const modal = useModal();

  const { minVersion, unSupportedVersion, updatedVersionModalMessage } =
    useVersionUpdateHandler();
  const { isRatePopupShown } = useRatePopUpHandler();
  const { horoscopeData, loading, fetchAudioData, fetchHoroscopeData } =
    useDynamicLinkHandler({
      isFromHome: true,
    });
  const { top } = useSafeAreaInsets();
  const player = usePlayer();
  const smallPlayer = useSmallPlayer();
  const [homeBanners, setHomeBanners] = useState([]);
  const [liveStreamBanner, setLiveStreamBanner] = useState({});
  const user = useSelector((state) => state?.userReducer?.userProfile);
  const liveStreams = useSelector(
    (state) => state.liveStreamReducer.liveStreams
  );

  const isEnterFirstTime = useSelector(
    (state) => state.authReducer.isEnterFirstTime
  );

  const dailyPlans = useSelector(
    (state) => state?.dailyPlanReducer?.dailyPlansData
  );
  const recentlyPlayedAudios = useSelector(
    (state) => state?.recentlyPlayedAudiosReducer?.recentlyPlayedAudios
  );

  const isUserSubscribed = useSelector(
    (state) => state?.subscription?.isUserSubscribed
  );

  const selectedLanguage = useSelector(
    (state) => state?.language.selectedLanguage
  );

  const freePlaylists = useSelector(
    (state) => state?.playlistsReducer?.freePlaylists
  );

  const { freePlaylistsBannerImage } = useSelector(
    (state) => state?.playlistsReducer
  );

  const { recentlyPlayedPlaylistsBannerImage } = useSelector(
    (state) => state?.playlistsReducer
  );

  // const horoscopeReminder = useSelector(
  //   (state) => state?.settingReducer?.userHoroscopeReminders
  // );
  const audioLinkDetail = useSelector(
    (state) => state?.audioLinkReducer?.audioLinkDetail
  );

  const defaultAudio = useSelector(
    (state) => state?.audioLinkReducer?.defaultAudio
  );

  const audioDeeplink = useSelector(
    (state) => state?.audioLinkReducer?.audioDeeplink
  );

  const horoscopeReminder = useSelector(
    (state) => state?.settingReducer?.userHoroscopeReminders
  );

  const isHoroscopeDeeplink = useSelector(
    (state) => state?.audioLinkReducer?.isHoroscopeDeeplink
  );
  const [freePlaylistsData, setFreePlaylistsData] = useState([]);
  const [categoriesData, setCategoriestsData] = useState([]);
  const [masterChoicePlaylistdata, setMasterChoicePlaylistdata] = useState([]);
  const [extraPlaylists, setExtraPlaylists] = useState([]);
  const [globalContentItem, setGlobalContentItem] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [openSubscriptionModal, setOpenSubscriptionModal] = useState(false);
  const [openLetterSectionModal, setOpenLetterSectionModal] = useState(false);
  const [
    masterChoicePlaylistForDefaultAudio,
    setMasterChoicePlaylistForDefaultAudio,
  ] = useState([]);

  const updateLanguage = async (lg) => {
    await storeLanguage("SET", lg);
  };

  const LogEventonAppStart = async () => {
    let appopen = await AsyncStorage.getItem("AppOpne");

    if (appopen == undefined || appopen == null) {
      appopen = JSON.stringify(0);
    } else {
      appopen = JSON.stringify(JSON.parse(appopen) + 1);
    }
    await AsyncStorage.setItem("AppOpne", appopen);
    const eventName = "AppOpen";
    const data = {
      number_of_session: JSON.parse(appopen),
      user_id: user?.id,
    };
    await MasterEventLogger({ name: eventName, data: data, userId: user?.id });
  };

  useEffect(() => {
    if (!authToken) return;
    LogEventonAppStart();
  }, [authToken]);

  useFocusEffect(
    useCallback(() => {
      if (!authToken) return;
      // setNetworkModalvisible(true);
      fetchGlobalContent();
      // updateUserTimeZone();
      // fetchHoroscopeReminders();
      // fetchAllUserPlaylists();
      fetchHomePageBanners();
      fetchLiveStreamBanners();
    }, [
      authToken,
      fetchGlobalContent,
      fetchHomePageBanners,
      fetchLiveStreamBanners,
    ])
  );

  // useEffect(() => {
  //   if (!authToken) return;
  //   fetchGlobalContent();
  //   // updateUserTimeZone();
  //   // fetchHoroscopeReminders();
  //   // fetchAllUserPlaylists();
  //   fetchHomePageBanners();
  //   fetchLiveStreamBanners();
  // }, [authToken]);

  useEffect(() => {
    changeLocale(user?.preferred_language?.toLowerCase() ?? "en");
    updateLanguage(user?.preferred_language?.toLowerCase() ?? "en");
  }, [user?.preferred_language]);

  useEffect(() => {
    changeLocale(user?.preferred_language?.toLowerCase() ?? "en");
  }, [user?.preferred_language]);

  useEffect(() => {
    if (
      audioLinkDetail !== null &&
      audioLinkDetail !== undefined &&
      audioLinkDetail?.title &&
      audioLinkDetail?.link &&
      audioLinkDetail?.duration &&
      audioLinkDetail?.id
    ) {
      setTimeout(() => {
        modal.show(MeditationSessionModal, {
          track: audioLinkDetail,
          playlist: [audioLinkDetail],
          isSharedAudio: true,
        });
      }, 500);
    }
  }, [audioLinkDetail]);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        if (audioDeeplink) {
          await fetchAudioData(audioDeeplink?.audioID, audioDeeplink?.language);
        }
      } catch (error) {
        console.error("error fetchAudio =---> Home", error);
      }
    };
    fetchAudio();
  }, [audioDeeplink]);

  // useEffect(() => {
  //   const fetchHoroscope = async () => {
  //     try {
  //       if (isHoroscopeDeeplink && Object.keys(user).length > 0) {
  //         await fetchHoroscopeData();
  //       }
  //     } catch (error) {
  //       console.error("error fetchAudio =---> Home", error);
  //     }
  //   };
  //   fetchHoroscope();
  // }, [isHoroscopeDeeplink, user]);

  // useEffect(() => {
  //   if (horoscopeData !== null && horoscopeData !== undefined) {
  //     handleHoroscopeReadNow();
  //   }
  // }, [horoscopeData]);

  const getStreams = useCallback(async () => {
    return getLiveStreams()
      .then((res) => {
        dispatch(setLiveStreams(res.data.response));
        return res.data.response;
      })
      .catch((error) => {
        console.log("ERROR GETTING LIVE STREAMS", error);
      });
  }, [dispatch]);

  useEffect(() => {
    getStreams();
  }, [getStreams]);

  useEffect(() => {
    async function fetchRecentAudios() {
      const recentlyPlayedAudios = await fetchRecentlyPlayedAudios();
      if (recentlyPlayedAudios?.status == 200) {
        dispatch(setAudioToRecentlyPlayed(recentlyPlayedAudios?.data));
      }
    }
    fetchRecentAudios();
  }, [dispatch]);

  // useEffect(() => {
  //   if (
  //     !loading &&
  //     defaultAudio !== null &&
  //     defaultAudio !== undefined &&
  //     Object.keys(defaultAudio)?.length > 0 &&
  //     defaultAudio?.link &&
  //     (audioDeeplink == null || audioDeeplink == undefined) &&
  //     !isHoroscopeDeeplink &&
  //     (audioLinkDetail?.title === null ||
  //       audioLinkDetail?.title === undefined ||
  //       audioLinkDetail?.link === null ||
  //       audioLinkDetail?.link === undefined) &&
  //     (audioLinkDetail === null || audioLinkDetail === undefined) &&
  //     (horoscopeData === null || horoscopeData === undefined) &&
  //     // !isDailyWisdomLink &&
  //     !unSupportedVersion
  //   ) {
  //     // modal.show(MeditationSessionModal, {
  //     //   track: defaultAudio,
  //     //   playlist: [defaultAudio],
  //     //   isDefaultAudio: true,
  //     // });
  //     modal.show(SmallPlayer, {
  //       track: defaultAudio,
  //       playlist: [defaultAudio],
  //       isDefaultAudio: true,
  //     });
  //   }
  // }, [
  //   defaultAudio,
  //   audioLinkDetail,
  //   horoscopeData,
  //   // isDailyWisdomLink,
  //   audioDeeplink,
  //   isHoroscopeDeeplink,
  //   unSupportedVersion,
  // ]);

  useEffect(() => {
    if (unSupportedVersion) {
      modal.show(UpdateVersionModal, {
        buttonText:
          updatedVersionModalMessage?.buttonText ?? i18n.t("Update Now"),
        message:
          updatedVersionModalMessage?.message ?? i18n.t("Discover New Version"),
      });
    }
  }, [unSupportedVersion, updatedVersionModalMessage]);

  const handleInAppReview = async () => {
    if (await InAppReview.isAvailable()) {
      const hasFlowFinishedSuccessfully =
        await InAppReview.RequestInAppReview();
      if (hasFlowFinishedSuccessfully) {
        const currentTime = Date.now();
        const fifteenDaysFromNow = currentTime + 2 * 24 * 60 * 60 * 1000;
        await AsyncStorage.setItem(
          "hasSubmittedReview",
          fifteenDaysFromNow?.toString()
        );
      }
    }
  };

  useEffect(() => {
    const trackAppLaunches = async () => {
      try {
        // Get the current launch count from AsyncStorage
        const hasSubmittedReview = await AsyncStorage.getItem(
          "hasSubmittedReview"
        );

        const lastReviewTimestamp = hasSubmittedReview
          ? parseInt(hasSubmittedReview, 10)
          : NaN;
        if (isNaN(lastReviewTimestamp) || Date.now() > lastReviewTimestamp) {
          const launchCount = await AsyncStorage.getItem("launchCount");
          const newLaunchCount = launchCount ? parseInt(launchCount) + 1 : 1;
          // Store the updated launch count back to AsyncStorage
          await AsyncStorage.setItem("launchCount", newLaunchCount.toString());

          // Show in-app review on specific launch counts
          if (newLaunchCount % 5 === 0 && newLaunchCount <= 25) {
            handleInAppReview();
          }
        }
      } catch (error) {
        console.error("Error tracking app launches:", error);
      }
    };
    if (isRatePopupShown) {
      trackAppLaunches();
    }
  }, [isRatePopupShown]);

  useEffect(() => {
    // fetchGlobalContent();
  }, []);

  useEffect(() => {
    if (!authToken) return;
    getLocalizedDataFromFile(dispatch);
  }, [authToken, dispatch]);

  useEffect(() => {
    fetchDailyPlans();
  }, [selectedLanguage, authToken]);

  useFocusEffect(
    useCallback(() => {
      if (!authToken) return;
      handleUserProfile();
    }, [authToken, handleUserProfile])
  );
  // useEffect(() => {
  //   if (!authToken) return;
  //   handleUserProfile();
  // }, [authToken]);

  useEffect(() => {
    if (!authToken) return;
    updateUserTimeZone();
    fetchHoroscopeReminders();
    fetchAllUserPlaylists();
  }, [
    authToken,
    fetchAllUserPlaylists,
    fetchHoroscopeReminders,
    updateUserTimeZone,
  ]);

  const fetchHomePageBanners = useCallback(async () => {
    try {
      const res = await getHomePageBanners();
      if (res?.status == 200) {
        setHomeBanners(res?.data);
      }
    } catch (error) {
      console.error("error fetching home-page-banners =--->", error);
      modal.show(ErrorDialog, {
        message:
          error?.response?.data?.message ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    }
  }, []);

  const fetchLiveStreamBanners = useCallback(async () => {
    try {
      const res = await getLiveStreamBanners();
      if (res?.status == 200) {
        setLiveStreamBanner(res?.data[0]);
      }
    } catch (error) {
      console.error("error fetching live-stream-banners =--->", error);
      modal.show(ErrorDialog, {
        message:
          error?.response?.data?.message ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    }
  }, []);

  const fetchDailyPlans = async () => {
    try {
      // Fetch Daily Plan
      const dailyPlans = await fetchDailyPlan("home");
      const updateDailyPlans = Object.keys(dailyPlans?.data).map((key) => {
        const updateAudios = dailyPlans?.data[key]
          ?.map((audio) => {
            return getLocalizedContent(audio, selectedLanguage?.toUpperCase());
          })
          ?.filter((audio) => audio?.link && audio?.title && audio?.duration);
        return {
          title: key,
          data: updateAudios ?? [],
        };
      });
      dispatch(setDailyPlansData(updateDailyPlans));
    } catch (error) {
      console.error("error fetchDailyPlans =--->", error);
    }
  };

  // const handleHoroscopeReadNow = () => {
  //   try {
  //     user?.birthDate
  //       ? navigation.navigate("HoroscopeDetailScreen")
  //       : navigation.navigate("BirthDayDetail", {
  //           isHome: true,
  //           birthday: user?.birthDate,
  //           horoscopeReminder: horoscopeReminder,
  //         });
  //   } catch (error) {
  //     console.error("Error handleHoroscopeReadNow", error);
  //   }
  // };

  const fetchDailyWisdomToday = useCallback(async () => {
    try {
      const res = await getDailyWisdomToday();
      dispatch(setDailyWisdomData(res?.data));
      if (user?.zodiacSign) {
        const horoscopeRes = await getHoroscopeToday(formatDateISO(new Date()));
        dispatch(persistHoroscopeData(horoscopeRes.data[0][user?.zodiacSign]));
      }
      setLastApiCallDate(new Date().toISOString());
    } catch (error) {
      console.log("error fetchDailyWisdomToday =--->", error);
    } finally {
      console.log("Done: fetchDailyWisdomToday");
    }
  }, [dispatch, user?.zodiacSign]);

  const convertDefaultAudio = useCallback(
    async (currentLanguage, homeApiRes) => {
      if (currentLanguage) {
        let defaultAudio = null;

        if (homeApiRes?.data) {
          // Check for localized default audio
          if (
            currentLanguage.toUpperCase() !== "EN" &&
            homeApiRes.data[`defaultAudio_${currentLanguage}`] !== null &&
            homeApiRes.data[`defaultAudio_${currentLanguage}`] !== undefined
          ) {
            defaultAudio = getLocalizedContent(
              homeApiRes.data[`defaultAudio_${currentLanguage}`],
              currentLanguage
            );
          }

          // Fallback to English default audio
          if (
            !defaultAudio &&
            currentLanguage.toUpperCase() === "EN" &&
            homeApiRes.data.defaultAudio !== null &&
            homeApiRes.data.defaultAudio !== undefined
          ) {
            defaultAudio = getLocalizedContent(
              homeApiRes.data.defaultAudio,
              currentLanguage.toUpperCase()
            );
          }
        }
        dispatch(setDefaultAudioData(defaultAudio));
      }
    },
    [dispatch]
  );

  const fetchGlobalContent = useCallback(async () => {
    // setIsLoading(true);
    try {
      // Fetch global content
      const homeApiRes = await getGlobalContentHome();
      setGlobalContentItem(homeApiRes?.data);
      const currentLanguage = await storeLanguage("GET");
      await convertDefaultAudio(
        currentLanguage?.toUpperCase() ??
          user?.preferred_language?.toUpperCase() ??
          selectedLanguage?.toUpperCase(),
        homeApiRes
      );
      // Fetch categories
      const sortedCategoryData = sortDataByOrder(homeApiRes?.data?.categories);
      const categoryData = sortedCategoryData || [];
      dispatch(setCategoriesData(categoryData));
      setCategoriestsData(categoryData);

      // Fetch playlists
      setExtraPlaylists(homeApiRes?.data?.extraPlaylist ?? []);
      setMasterChoicePlaylistdata(homeApiRes?.data?.masterChoicePlaylist ?? []);

      setFreePlaylistsData(homeApiRes?.data?.freePlaylist ?? []);
      dispatch(setFreePlaylists(homeApiRes?.data?.freePlaylist ?? []));
      dispatch(
        setFreePlaylistsBanner(homeApiRes?.data?.freePlaylistBannerImage ?? "")
      );
      dispatch(
        setRecentlyPlayedPlaylistBanner(
          homeApiRes?.data?.recentlyPlayedBannerImage ?? ""
        )
      );

      const { audioList: extraAudios, initialAudios: initialExtraAudios } =
        await getAllAudios(homeApiRes?.data?.extraPlaylist ?? []);
      dispatch(setAllExtraAudioListsData(extraAudios));
      dispatch(setAllInitialExtraAudios(initialExtraAudios));

      const { audioList, initialAudios } = await getAllAudios(
        homeApiRes?.data?.masterChoicePlaylist ?? [],
        true
      );
      const updatedArray = audioList.map(({ playlistId, ...rest }) => rest);
      setMasterChoicePlaylistForDefaultAudio(updatedArray);
      dispatch(
        setHomeMasterPlaylistIds(
          homeApiRes?.data?.masterChoicePlaylist?.map((item) => item?.id)
        )
      );
      dispatch(setAllAudioListsData(audioList));
      dispatch(setAllInitialAudios(initialAudios));

      const { audioList: freeAudioList, initialAudios: initialFreeAudios } =
        await getAllAudios(homeApiRes?.data?.freePlaylist ?? []);
      dispatch(setAllFreeAudioListsData(freeAudioList));
      dispatch(setAllInitialFreeAudios(initialFreeAudios));

      dispatch(
        setmasterPlaylists(homeApiRes?.data?.masterChoicePlaylist ?? [])
      );

      const res = await getUserFavouritesAudio();
      const audioData = res?.data?.audios
        ?.map((items, index) =>
          getLocalizedContent(items, selectedLanguage?.toUpperCase())
        )
        .filter((audio) => audio?.link && audio?.title && audio?.duration);
      dispatch(getUserFavourites(audioData));

      const randomImages = await getImages();
      dispatch(setRandomImages(randomImages?.data?.value?.images));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetchGlobalContent =--->", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    convertDefaultAudio,
    dispatch,
    getAllAudios,
    selectedLanguage,
    user?.preferred_language,
  ]);

  const shouldShowDefaultAudioModal = () => {
    const isEmptyOrNull = (value) => value === null || value === undefined;
    const hasValidLink = (obj) => obj?.link && Object.keys(obj)?.length > 0;
    // const hasValidAudio = (obj) =>
    //   obj?.link && obj?.title && obj?.duration && Object.keys(obj)?.length > 0;

    return (
      !loading &&
      hasValidLink(defaultAudio) &&
      // hasValidAudio(defaultAudio) &&
      isEmptyOrNull(audioDeeplink) &&
      !isHoroscopeDeeplink &&
      isEmptyOrNull(audioLinkDetail?.title) &&
      isEmptyOrNull(audioLinkDetail?.link) &&
      isEmptyOrNull(audioLinkDetail) &&
      isEmptyOrNull(horoscopeData) &&
      !unSupportedVersion &&
      player?.state !== "playing"
    );
  };

  const showModalWithAudio = (track, playlist) => {
    setIsLoading(false);
    modal.show(SmallPlayer, {
      track,
      playlist,
      isDefaultAudio: true,
    });
  };

  // const addTracksToQueue = async (tracks) => {
  //   await player.addTraksToQueue(mapToTrackFlyweight(tracks));
  // };

  // const filterOutDefaultAudio = (playlist, defaultAudio) => {
  //   if (!playlist || !defaultAudio) return playlist; // Return the original playlist if input is invalid

  //   return playlist.filter((audio) => audio?.id !== defaultAudio?.id);
  // };

  useEffect(() => {
    setIsLoading(true);
    if (shouldShowDefaultAudioModal()) {
      if (isUserSubscribed && masterChoicePlaylistForDefaultAudio?.length > 0) {
        // consoleLog("DefaultMasterChoice", masterChoicePlaylistForDefaultAudio)
        // console.log("DefaultMasterChoice", masterChoicePlaylistForDefaultAudio);
        const findDefaultAudioFromMasterChoice =
          masterChoicePlaylistForDefaultAudio?.find(
            (audio) => audio?.id === defaultAudio?.id
          );
        if (findDefaultAudioFromMasterChoice) {
          // Add the filtered audios to the queue
          showModalWithAudio(
            findDefaultAudioFromMasterChoice,
            masterChoicePlaylistForDefaultAudio
          );
        }
        if (!findDefaultAudioFromMasterChoice) {
          const updatedData = [
            defaultAudio,
            ...masterChoicePlaylistForDefaultAudio,
          ];
          showModalWithAudio(defaultAudio, updatedData);
        }
      }
      if (!isUserSubscribed) {
        showModalWithAudio(defaultAudio, [defaultAudio]);
      }
    } else {
      setIsLoading(false);
    }
  }, [
    defaultAudio,
    audioLinkDetail,
    horoscopeData,
    // isDailyWisdomLink,
    audioDeeplink,
    isHoroscopeDeeplink,
    unSupportedVersion,
    isUserSubscribed,
    masterChoicePlaylistForDefaultAudio?.length,
    selectedLanguage,
  ]);

  const fetchHoroscopeReminders = useCallback(async () => {
    try {
      const res = await fetchUserHoroscopeReminders();
      if (res?.data) {
        const { reminders } = res?.data;
        const reminderList = Object.keys(reminders).map((key) => ({
          payloadTitle: key,
          time: reminders[key].time,
          toggle: reminders[key].enabled,
        }));
        dispatch(fetchHoroScopeReminder(reminderList));
      }
    } catch (error) {
      console.error("error fetching user horoscope reminders =--->", error);
      modal.show(ErrorDialog, {
        message:
          error?.response?.data?.message ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    }
  }, []);

  const getAllAudios = useCallback(
    async (playlists, isFromMasterChoice) => {
      try {
        let audioList = [];
        let initialAudios = [];
        let firstValidPlaylistId = null;
        let lastValidPlaylistId = null;

        for (const playlist of playlists) {
          const title = playlist?.title?.toLowerCase();
          const isExcludedTitle =
            title === "deep sleep" ||
            title === "sleep" ||
            (isFromMasterChoice && title === "daily dose from duchess");
          if (!isExcludedTitle) {
            const playlistAudios = await getOnePlayList(playlist.id);
            // consoleLog("PlayListData", playlistAudios?.data?.audios);
            const currentLanguage = await storeLanguage("GET");
            const audios = playlistAudios?.data?.audios || [];
            const temp = audios.map((item) => {
              return {
                ...item,
                playlistId: playlist.id,
              };
            });

            initialAudios = [...initialAudios, ...temp];
            const checkCurrentLanguage = isFromMasterChoice
              ? currentLanguage?.toUpperCase() ||
                user?.preferred_language ||
                selectedLanguage?.toUpperCase()
              : selectedLanguage?.toUpperCase();

            const localizedAudios = await Promise.all(
              temp.map((audio) => {
                const localizedAudio = getLocalizedContent(
                  audio,
                  checkCurrentLanguage
                );
                return localizedAudio;
              })
            );

            const validAudios = localizedAudios.filter(
              (audio) => audio?.link && audio?.title && audio?.duration
            );

            if (validAudios.length > 0 && isFromMasterChoice) {
              if (!firstValidPlaylistId) {
                firstValidPlaylistId = playlist.id;
                AsyncStorage.setItem(
                  "firstValidPlaylistId",
                  firstValidPlaylistId
                );
              }
              lastValidPlaylistId = playlist.id;
              AsyncStorage.setItem("lastValidPlaylistId", lastValidPlaylistId);
            }

            audioList = [...audioList, ...validAudios];
          }
        }
        return { audioList, initialAudios };
      } catch (error) {
        console.error("error getAllAudios =--->", error);
        throw error; // Re-throw the error to handle it in the calling function
      }
    },
    [user?.preferred_language, selectedLanguage]
  );

  // const getAllAudios = async (playlists, isFromMasterChoice) => {
  //   try {
  //     let audioList = [];
  //     let initialAudios = [];

  //     for (const playlist of playlists) {
  //       console.log(playlist.id);
  //      if(playlist.id=="57e9cb35-c427-4eae-89ca-bd105a16c24f")
  //      {

  //      }
  //      else{
  //       const title = playlist?.title?.toLowerCase();
  //       const isExcludedTitle =
  //         title === "deep sleep" ||
  //         title === "sleep" ||
  //         (isFromMasterChoice && title === "daily dose from duchess");
  //       if (!isExcludedTitle) {
  //         const playlistAudios = await getOnePlayList(playlist.id);
  //         const currentLanguage = await storeLanguage("GET");
  //         const audios = playlistAudios?.data?.audios || [];
  //         // console.log('audios',audios[0]);
  //         const temp=audios.map((item)=>{
  //           return(
  //             {
  //               ...item,playlistId:playlist.id
  //             }
  //           )
  //         })
  //         initialAudios = [...initialAudios, ...temp];
  //         const checkCurrentLanguage = isFromMasterChoice
  //           ? currentLanguage?.toUpperCase() ||
  //             user?.preferred_language ||
  //             selectedLanguage?.toUpperCase()
  //           : selectedLanguage?.toUpperCase();
  //         const localizedAudios = await Promise.all(
  //           audios.map((audio) => {
  //             const localizedAudio = getLocalizedContent(
  //               audio,
  //               checkCurrentLanguage
  //             );
  //             return localizedAudio;
  //           })
  //         );

  //         const validAudios = localizedAudios.filter(
  //           (audio) => audio?.link && audio?.title && audio?.duration
  //         );
  //         audioList = [...audioList, ...validAudios];
  //       }
  //      }
  //     }
  //     for (const playlist of playlists) {
  //       console.log('playlist',playlist)
  //       if(playlist.id!="57e9cb35-c427-4eae-89ca-bd105a16c24f")
  //       {
  //        const title = playlist?.title?.toLowerCase();
  //        const isExcludedTitle =
  //          title === "deep sleep" ||
  //          title === "sleep" ||
  //          (isFromMasterChoice && title === "daily dose from duchess");
  //        if (!isExcludedTitle) {
  //          const playlistAudios = await getOnePlayList(playlist.id);
  //          const currentLanguage = await storeLanguage("GET");
  //          const audios = playlistAudios?.data?.audios || [];
  //          // console.log('audios',audios[0]);
  //          const temp=audios.map((item)=>{
  //            return(
  //              {
  //                ...item,playlistId:playlist.id
  //              }
  //            )
  //          })
  //          initialAudios = [...initialAudios, ...temp];
  //          const checkCurrentLanguage = isFromMasterChoice
  //            ? currentLanguage?.toUpperCase() ||
  //              user?.preferred_language ||
  //              selectedLanguage?.toUpperCase()
  //            : selectedLanguage?.toUpperCase();
  //          const localizedAudios = await Promise.all(
  //            audios.map((audio) => {
  //              const localizedAudio = getLocalizedContent(
  //                audio,
  //                checkCurrentLanguage
  //              );
  //              return localizedAudio;
  //            })
  //          );

  //          const validAudios = localizedAudios.filter(
  //            (audio) => audio?.link && audio?.title && audio?.duration
  //          );
  //          audioList = [...audioList, ...validAudios];
  //        }
  //       }
  //       else{}
  //      }
  //     return { audioList, initialAudios };
  //   } catch (error) {
  //     console.error("error getAllAudios =--->", error);
  //     throw error; // Re-throw the error to handle it in the calling function
  //   }
  // };

  const handlePlaylistSelection = (
    item,
    isRecentlyPlayed = false,
    title = "",
    isExtra = false
  ) => {
    console.log("item", item);
    if (isRecentlyPlayed) {
      navigation.navigate("GettingOverplaylist", { isRecentlyPlayed });
      return;
    }

    navigation.navigate("GettingOverplaylist", {
      item,
      isDeepSleep: title == "deep sleep" ? true : false,
      isExtra,
      isDuchess: title == "daily dose from duchess" ? true : false,
    });
  };

  const updateUserTimeZone = useCallback(async () => {
    try {
      await updateProfile({
        userTimezone: Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone,
      });
    } catch (error) {
      console.error("error update user profile time zone =--->", error);
      modal.show(ErrorDialog, {
        messageTitle:
          error?.response?.data?.errorTitle ??
          ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
        message:
          error?.response?.data?.errorBody ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    }
  }, []);

  const handleUserProfile = useCallback(async () => {
    try {
      const res = await getUserProfile();
      consoleLog("UserProfile", res?.status);

      if (res?.status == 200) {
        OneSignal.login(res?.data?.id);

        dispatch(setUserProfile(res?.data));
        fetchDailyWisdomToday(res?.data);

        if (res?.data?.isActivePurchase) {
          dispatch(setIsUserSubscribed(true));
        } else {
          dispatch(setIsUserSubscribed(false));
        }
      }

      //send test notification with one signal foreground service:Foreground means app is open

      OneSignal.sendTag("userId", res?.data?.id);
    } catch (error) {
      console.error("error handleUserProfile =--->", error);
      modal.show(ErrorDialog, {
        messageTitle:
          error?.response?.data?.errorTitle ??
          ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
        message:
          error?.response?.data?.errorBody ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    }
  }, [dispatch, fetchDailyWisdomToday, modal]);

  const fetchAllUserPlaylists = useCallback(async () => {
    try {
      const response = await getAllUserPlaylists();
      // Access the userPlaylists array in the response
      if (response && Array.isArray(response?.data?.userPlaylists)) {
        dispatch(setAllUserPlayListsData(response.data.userPlaylists)); // Dispatch to Redux if needed
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      if (error?.response) {
        console.error("Error fetching playlists, response:", error?.response);
      } else if (error?.request) {
        console.error("Error fetching playlists, no response:", error?.request);
      } else {
        console.error(
          "Error setting up fetch playlists request:",
          error?.message
        );
      }
    }
  }, [dispatch]);

  const handleHoroscopeReadNow = () => {
    try {
      user?.birthDate
        ? navigation.navigate("HoroscopeDetailScreen")
        : navigation.navigate("BirthDayDetail", {
            isExplore: true,
            birthday: user?.birthDate,
            horoscopeReminder: horoscopeReminder,
          });
    } catch (error) {
      console.error("Error handleHoroscopeReadNow", error);
    }
  };

  const { width: deviceWidth } = Dimensions.get("window");
  const IMAGE_ASPECT_RATIO = 159 / 39; // Adjust aspect ratio based on your image (width/height) new
  // const IMAGE_ASPECT_RATIO = 1500 / 1076; // Adjust aspect ratio based on your image (width/height)
  const calculatedHeight = deviceWidth / IMAGE_ASPECT_RATIO;

  // const initRevenueCat = async (Id) => {
  //   try {
  //     Purchases.setDebugLogsEnabled(true);
  //     Purchases.configure({
  //       apiKey: AppID[Platform.OS],
  //       appUserID: Id,
  //     });
  //   } catch (error) {
  //     console.error("error initRevenueCat =--->", error);
  //   }
  // };

  const isHost = user?.isLivestreamHost;
  const isSpeaker = liveStreams?.isSpeaker;

  return (
    <Block flex={1}>
      {isLoading ? (
        // <Loader />
        <Block flex={1} style={{ paddingTop: top }}>
          <HomeSkeleton />
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
                <TouchableOpacity style={{ height: 37, width: 37 }}>
                  {/* <BackIcon height={32} width={32} /> */}
                </TouchableOpacity>

                {/* <LogoIcon height={23} width={26} /> */}

                <Block
                  flex={false}
                  // marginBottom={scaleSize(10)}
                  // center

                  // bottom
                  style={
                    {
                      // marginTop: 10
                    }
                  }
                >
                  <LandingLogo
                    color={colors.logoColor}
                    height={perfectSize(60)}
                    width={perfectSize(100)}
                  />
                </Block>
                <Block flex={false} style={{ width: "10%" }}>
                  <TouchableOpacity
                    style={styles.searchBtnView}
                    onPress={() => navigation.navigate("SearchScreen")}
                  >
                    <SearchButton height={37} width={37} />
                    {/* <SearchButton height={35} width={35} /> */}
                  </TouchableOpacity>
                </Block>
              </Block>
              <Block
                flex={false}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: perfectSize(30),
                  paddingVertical: perfectSize(10),
                }}
              >
                <Block flex={false} style={{ width: "60%" }}>
                  <Text regular size={scaleSize(18)} color={colors.white}>
                    {getGreeting()}
                    {user?.fullName
                      ? ` ${user?.fullName.split(" ")?.[0]} `
                      : "Guest"}
                  </Text>
                </Block>

                <Block
                  // style={{ width: "40%" }}
                  flex={false}
                  margin={[0, scaleSize(2), 0, scaleSize(2)]}
                >
                  <CustomDropDown
                    onChange={async (lg) => {
                      await storeLanguage("SET", lg);
                      handleLanguageChange(lg, dispatch, changeLocale);
                      fetchGlobalContent();
                      player.reset();
                      smallPlayer.hideSmallPlayer();
                      RNRestart.Restart();
                    }}
                  />
                </Block>
                {/* <Block flex={false} style={{ width: "10%" }}>
                  <TouchableOpacity
                    style={styles.searchBtnView}
                    onPress={() => navigation.navigate("SearchScreen")}
                  >
                    <SearchButton height={35} width={35} />
                  </TouchableOpacity>
                </Block> */}
              </Block>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: perfectSize(30),
                  flexGrow: 1,
                  paddingBottom: perfectSize(60),
                }}
              >
                {/* <Block
                  style={{
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: "#EBA902",
                    paddingVertical: 2,
                    marginTop: 32,
                    marginBottom: 24,
                  }}
                >
                  <ImageBackground source={StreamBg} resizeMode="cover">
                    <Block
                      style={[styles.absolute, styles.androidBlurBackground]}
                    />

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginHorizontal: 16,
                      }}
                    >
                      <View style={{ alignItems: "center" }}>
                        <Image
                          source={LiveIcon}
                          style={{ height: 28, width: 38, marginBottom: 2 }}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          disabled={true}
                          style={{
                            backgroundColor: "#6E0F1A",
                            borderRadius: 5,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            marginTop: 4,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              lineHeight: 17,
                              fontSize: 17,
                              fontWeight: 800,
                            }}
                          >
                            LIVE
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          marginHorizontal: 12,
                          // flexGrow: 1,
                          // flexShrink: 1,
                        }}
                      >
                        <View
                          style={{
                            // marginHorizontal: 12,
                            // flexGrow: 1,
                            // flexShrink: 1,
                            alignItems: "flex-start",
                            marginBottom: 8,
                            marginTop: 6,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "flex-end",
                            }}
                          >
                            <Text
                              style={{
                                color: "#6B0021",
                                fontSize: 30,
                                fontFamily: font.extra_bold,
                              }}
                            >
                              LIVE{" "}
                            </Text>
                            <Text
                              style={{
                                color: "#6B0021",
                                fontSize: 26,
                                fontFamily: font.SemiBoldItalic,
                              }}
                            >
                              Streaming
                            </Text>
                          </View>
                          <Text
                            style={{
                              color: "#5B3D17",
                              fontSize: 16,
                              fontFamily: font.extra_bold_italic,
                              lineHeight: 17,
                            }}
                          >
                            With the Duchess of York
                          </Text>
                          <Text
                            style={{
                              color: "#5B3D17",
                              fontSize: 12,
                              fontWeight: 700,
                              lineHeight: 19,
                              marginTop: Platform.OS === "ios" ? 0 : -4,
                            }}
                          >
                            SUNDAY, 19 JAN. 11:00 AM
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={{
                          backgroundColor: "#6C4B23",
                          borderRadius: 40,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          marginTop: 4,
                        }}
                        onPress={async () => {
                          const streamData = await getStreams();
                          if (!isHost && !streamData?.id) {
                            alert("Livestream isn't available right now.");
                          } else if (
                            (isHost && !streamData?.id) ||
                            streamData?.status === "ended"
                          ) {
                            navigation.navigate(SCREEN_NAMES.VS_Home);
                          } else if (isSpeaker || isHost) {
                            navigation.navigate(SCREEN_NAMES.VS_Speaker_Home);
                          } else {
                            navigation.navigate(
                              SCREEN_NAMES.VS_Viewer_Home,
                              {}
                            );
                          }
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            lineHeight: 17,
                            fontSize: 11,
                            fontWeight: "700",
                          }}
                        >
                          {isHost &&
                          (!liveStreams?.id || liveStreams?.status === "ended")
                            ? "HOST"
                            : "JOIN"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ImageBackground>
                </Block> */}

                <FlatList
                  data={[...homeBanners]}
                  scrollEnabled={false}
                  style={{ flex: 1, marginTop: perfectSize(5) }}
                  contentContainerStyle={{
                    paddingBottom: isUserSubscribed
                      ? perfectSize(14.5)
                      : perfectSize(24),
                    flex: 1,
                  }}
                  ItemSeparatorComponent={
                    <View style={{ height: perfectSize(14.5) }} />
                  }
                  renderItem={({ item, index }) => {
                    const isDuchess =
                      item?.title_en == "Letter from Sarah" ? true : false;
                    // consoleLog("my banner is:", item)
                    // consoleLog("my banner is:", getTransformedUrl(item.url))
                    const title =
                      item?.[`title_${selectedLanguage}`] ||
                      item?.title_EN ||
                      item?.title;

                    const description =
                      item?.[`description_${selectedLanguage}`] ||
                      item?.description_EN ||
                      item?.description;
                    return (
                      <Block
                        flex={false}
                        paddingHorizontal={perfectSize(29)}
                        // paddingVertical={perfectSize(10)}
                        // padding={[0, 0, isUserSubscribed ? perfectSize(29) : 0, 0]}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            isDuchess
                              ? setOpenLetterSectionModal(true)
                              : handleHoroscopeReadNow();
                          }}
                        >
                          <ImageBackground
                            source={{ uri: item?.image_url }}
                            // source={Backgrounds.missLetterImage1}
                            style={{
                              // width: "100%",
                              width: SCREEN_WIDTH * 0.85,
                              // height: calculatedHeight,
                              height: isDuchess
                                ? SCREEN_WIDTH * 0.2
                                : SCREEN_WIDTH * 0.18,
                              // height: SCREEN_WIDTH * 0.18,
                              flexDirection: "column",
                              justifyContent: "space-evenly",
                              justifyContent: "center",
                              alignItems: "flex-end",
                              alignSelf: "center",
                              paddingHorizontal: perfectSize(10),
                            }}
                            imageStyle={{
                              // width: "100%",
                              // height: "100%",
                              borderWidth: 0.5,
                              borderColor: colors.cream,
                              borderRadius: scaleSize(10),
                            }}
                            resizeMode="cover"
                          >
                            {/* <Block
                            flex={false}
                            margin={[0, scaleSize(10), 0, 0]}
                            style={{
                              width: "48.8%",
                              flexDirection: "row",
                              justifyContent: "flex-end",
                              // alignSelf:""
                              // textAlign:"flex-end",
                            }}
                          >
                            <TouchableOpacity
                            disabled={true}
                              onPress={() => {
                                isDuchess ? setOpenLetterSectionModal(true) : handleHoroscopeReadNow()
                              }}
                            >
                              <Text
                                size={scaleSize(12)}
                                regular
                                color={colors.darkRed}
                                style={{
                                  lineHeight: scaleSize(12),
                                  paddingBottom: scaleSize(5),

                                }}
                              >
                                {isDuchess ? i18n.t("Read More") : i18n.t("Read Now")}
                              </Text>
                            </TouchableOpacity>
                          </Block> */}
                          </ImageBackground>
                        </TouchableOpacity>
                      </Block>
                    );
                  }}
                />

                {/* Live stream banner */}

                <Block
                  flex={false}
                  // paddingHorizontal={perfectSize(29)}
                  paddingBottom={
                    isUserSubscribed ? perfectSize(0) : perfectSize(10)
                  }
                  paddingTop={
                    isUserSubscribed ? perfectSize(0) : perfectSize(10)
                  }
                >
                  <TouchableOpacity
                    disabled={!liveStreamBanner?.livestream_status}
                    onPress={async () => {
                      const streamData = await getStreams();
                      if (!isHost && !streamData?.id) {
                        alert("Livestream isn't available right now.");
                      } else if (
                        (isHost && !streamData?.id) ||
                        streamData?.status === "ended"
                      ) {
                        navigation.navigate(SCREEN_NAMES.VS_Home);
                      } else if (isSpeaker || isHost) {
                        navigation.navigate(SCREEN_NAMES.VS_Speaker_Home);
                      } else {
                        navigation.navigate(SCREEN_NAMES.VS_Viewer_Home, {});
                      }
                    }}
                  >
                    <ImageBackground
                      source={
                        liveStreamBanner?.image_url !== null &&
                        liveStreamBanner?.image_url !== undefined
                          ? { uri: liveStreamBanner?.image_url }
                          : Backgrounds.livestreamBackground
                      }
                      style={{
                        width: SCREEN_WIDTH * 0.85,
                        height: SCREEN_WIDTH * 0.18,
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        alignSelf: "center",
                        paddingHorizontal: perfectSize(10),
                      }}
                      imageStyle={{
                        borderWidth: 0.5,
                        borderColor: colors.cream,
                        borderRadius: scaleSize(10),
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </Block>

                {/* Free Playlists View extraPlaylists */}
                {!isUserSubscribed && freePlaylistsData?.length > 0 ? (
                  <FreePlaylistView
                    onPressViewAll={() =>
                      navigation.navigate("Allplaylists", {
                        isFreeAudio: true,
                        source: "free",
                        data: freePlaylistsData,
                      })
                    }
                    selectedLanguage={selectedLanguage}
                    freePlaylistsData={freePlaylistsData}
                  />
                ) : null}

                {/* Main Banner View */}
                {/* <DailyWisdom
                  ref={dailyWisdomRef}
                  getDailyWisdomData={getDailyWisdomData}
                  isSharing={isSharing}
                  shareImage={shareImage}
                  onLayout={(event) => {
                    const { y } = event.nativeEvent.layout; // Capture position
                    setDailyWisdomPosition(y);
                  }}
                /> */}

                {/* Horoscope View */}

                {/* <HoroscopeView user={user} onRead={handleHoroscopeReadNow} /> */}
                {masterChoicePlaylistdata?.length > 0 ? (
                  <>
                    {/* <Block flex={false} style={styles.divider} /> */}
                    <MasterChoicePlaylistsView
                      masterChoicePlaylistdata={masterChoicePlaylistdata}
                      onPressViewAll={() =>
                        navigation.navigate("Allplaylists", {
                          isFreeAudio: false,
                          source: "free",
                          data: masterChoicePlaylistdata,
                        })
                      }
                      onPress={(item) => {
                        handlePlaylistSelection(
                          item,
                          false,
                          item?.title.toLowerCase()
                        );
                      }}
                      selectedLanguage={selectedLanguage}
                      title={i18n.t("Goal-Based Playlists")}
                      isPremium={!isUserSubscribed}
                    />
                  </>
                ) : null}
                {/* Categories View */}
                {/* <CategoriesView
                  categoriesData={categoriesData}
                  selectedLanguage={selectedLanguage}
                  onPress={(item) =>
                    navigation.navigate("CategoriesScreen", {
                      categorieItemId: item?.id,
                      browseByGoalItem: item,
                    })
                  }
                /> */}

                <Block flex={false} style={styles.dividerView} />

                {/* Recently Played View*/}
                {recentlyPlayedAudios?.audios?.length > 0 && (
                  <RecentlyPlayedView
                    bannerImage={recentlyPlayedPlaylistsBannerImage}
                    recentlyPlayedAudios={recentlyPlayedAudios}
                    onPress={() =>
                      handlePlaylistSelection(
                        recentlyPlayedAudios?.audios[0],
                        true
                      )
                    }
                  />
                )}

                {/*  Suggested Daily Plan View */}
                {/* <SuggestedDailyPlanView
                  dailyPlans={dailyPlans}
                  onPress={(subItem) => {
                    const audios = dailyPlans.map((plan) => plan.data).flat();
                    if (isUserSubscribed) {
                      modal.show(MeditationSessionModal, {
                        track: subItem,
                        playlist: audios,
                      });
                    } else {
                      setOpenSubscriptionModal(true);
                    }
                  }}
                /> */}

                {/* {extraPlaylists?.length > 0 ? (
                  <MasterChoicePlaylistsView
                    masterChoicePlaylistdata={extraPlaylists}
                    onPress={(item) => {
                      handlePlaylistSelection(
                        item,
                        false,
                        item?.title.toLowerCase(),
                        true
                      );
                    }}
                    selectedLanguage={selectedLanguage}
                    visibleTitle={false}
                  />
                ) : null} */}

                <Block flex={1} style={styles.tipImageContainer}>
                  <ImageBackground
                    source={
                      globalContentItem?.image
                        ? { uri: getTransformedUrl(globalContentItem?.image) }
                        : Backgrounds.audioPlayTipImage
                    }
                    style={{
                      aspectRatio: 1320 / 1148,
                      width: "100%",
                      borderRadius: 8,
                      overflow: "hidden",
                    }}
                    resizeMode="cover"
                  />
                  {/* <Image
                    source={
                      globalContentItem?.image
                        ? { uri: getTransformedUrl(globalContentItem?.image) }
                        : Backgrounds.audioPlayTipImage
                    }
                    style={styles.tipImage}
                    resizeMode="contain"
                  /> */}
                </Block>
              </ScrollView>
            </Block>
          </ImageBackground>

          {/* <SmallPlayerBottomSpace /> */}
          {/* <SmallPlayer isFreeAudio={false} isDownloadedAudio={false} /> */}
        </Block>
      )}
      {openSubscriptionModal && (
        <SubscriptionModal
          isVisible={openSubscriptionModal}
          hideModal={() => {
            setOpenSubscriptionModal(false);
          }}
        />
      )}
      {openLetterSectionModal && (
        <LetterSectionModal
          isVisible={openLetterSectionModal}
          hideModal={() => {
            setOpenLetterSectionModal(false);
          }}
        />
      )}

      {/* <AuthenticationModal isVisible={true} refresh={refresh} /> */}
    </Block>
  );
};
export default Home;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: perfectSize(20),
    paddingVertical: perfectSize(10),
  },
  video: {
    height: deviceHeight * 0.4,
    width: deviceWidth * 0.9,
    borderRadius: 20,
    marginTop: perfectSize(20),
  },
  categoryImageContainer: {
    height: perfectSize(210),
    marginTop: perfectSize(25),
    paddingHorizontal: perfectSize(20),
  },
  categoryImageBackground: {
    height: "100%",
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },
  PosterImageContainer: {
    height: perfectSize(282),
    marginTop: perfectSize(20),
    paddingHorizontal: perfectSize(20),
  },
  categoryOverlayText: {
    marginLeft: perfectSize(15),
    padding: perfectSize(12),
  },
  horoscopeIcon: {
    alignSelf: "center",
    bottom: perfectSize(2),
  },
  categoriesContainer: {
    marginTop: perfectSize(20),
    paddingHorizontal: perfectSize(20),
  },
  categoriesListContainer: {
    alignItems: "center",
  },
  categoriesList: {
    marginTop: perfectSize(15),
  },
  yourSuggestedContainer: {
    height: 100,
    paddingHorizontal: perfectSize(20),
    marginVertical: perfectSize(20),
  },
  suggestedBackground: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 8,
    overflow: "hidden",
  },
  suggestedText: {
    padding: 10,
    alignSelf: "flex-end",
  },
  viewMoreText: {
    padding: 10,
    justifyContent: "flex-end",
  },
  divider: {
    width: "90%",
    height: perfectSize(1),
    marginVertical: perfectSize(24),
    alignSelf: "center",
    backgroundColor: colors.lightPinkBorderColor,
  },
  dividerView: {
    width: "85%",
    marginTop: perfectSize(30),
    height: perfectSize(1),
    alignSelf: "center",
    backgroundColor: colors.white,
  },
  audioListContainer: {
    gap: 20,
    paddingLeft: perfectSize(16),
    marginBottom: perfectSize(15),
  },
  recentlyPlayedContainer: {
    paddingHorizontal: perfectSize(20),
    marginTop: perfectSize(5),
  },
  image: {
    height: perfectSize(140),
    width: perfectSize(231),
    borderRadius: 10,
  },
  searchBtnView: {
    // justifyContent: "flex-end",
    // alignItems: "flex-end",
  },
  dropdownView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: perfectSize(20),
    paddingHorizontal: perfectSize(7),
    paddingVertical: perfectSize(5),
    borderWidth: 1,
    borderColor: colors.white,
  },
  languageText: {
    marginHorizontal: perfectSize(7),
  },
  shareIconView: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flex: 1,
  },
  dropdown: {
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 115,
  },
  placeholderStyle: {
    fontSize: responsiveScale(11),
    color: colors.white,
  },
  selectedTextStyle: {
    fontSize: responsiveScale(11),
    color: colors.white,
    marginLeft: 5,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: responsiveScale(11),
  },
  sectionContainer: {
    paddingHorizontal: perfectSize(20),
  },
  row: {
    justifyContent: "space-between",
  },
  bottomContentContainer: {
    padding: perfectSize(20),
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.playViewColor, // Dark red background
  },
  bottomImage: {
    width: perfectSize(66),
    height: perfectSize(64),
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  playIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
  },
  closeIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  playlistContainer: {
    height: perfectSize(192),
    marginTop: perfectSize(20),
    borderRadius: perfectSize(10),
    overflow: "hidden",
    paddingHorizontal: perfectSize(20),
    marginBottom: perfectSize(10),
  },
  imageBackground: {
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
    borderRadius: perfectSize(10),
    overflow: "hidden",
  },
  numberText: {
    marginLeft: perfectSize(15),
    marginTop: perfectSize(4),
  },
  playButton: {
    bottom: perfectSize(15),
    alignItems: "center",
  },
  infoContainer: {
    paddingHorizontal: perfectSize(14),
    paddingVertical: perfectSize(8),
    height: "33%",
  },
  titleText: {
    flex: 1,
  },
  absolute: {
    position: "absolute",
    top: perfectSize(0),
    left: perfectSize(0),
    bottom: perfectSize(0),
    right: perfectSize(0),
  },
  androidBlurBackground: {
    // backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  downArrowContainer: {
    paddingHorizontal: perfectSize(20),
  },
  tipImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: perfectSize(23),
    marginRight: perfectSize(22),
    marginTop: scaleSize(20),
    overflow: "hidden",
  },
  tipImage: {
    width: "100%",
    aspectRatio: 651 / 785,
    height: undefined,
    borderRadius: 8,
  },
});
