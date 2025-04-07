import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  // Share,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DownArrow from "../../assets/appImages/svgImages/DownArrow";
import AddPlaylistIcon from "../../assets/appImages/svgImages/AddPlaylistIcon";
import Skipback from "../../assets/appImages/svgImages/Skipback";
import Skipnext from "../../assets/appImages/svgImages/Skipnext";
import { usePlayer } from "../player";
import { useSmallPlayer } from "../player/SmallPlayerProvider";
import { ModalManager } from "../../context/ModalManager";
import { Center } from "../../components/layout/Center";
import PlayGrayIcon from "../../assets/appImages/svgImages/PlayGrayIcon";
import { ModalProvider, useModal } from "../../context/ModalContext";
import Block from "../../components/utilities/Block";
import { consoleLog, perfectSize, responsiveScale } from "../../styles/mixins";
import { useDispatch, useSelector } from "react-redux";
import Clouddownloadaltsolid from "../../assets/appImages/svgImages/Clouddownloadaltsolid";
import ShareIcon from "../../assets/appImages/svgImages/ShareIcon";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PenIcon from "../../assets/appImages/svgImages/PenIcon";
import ResetIcon from "../../assets/appImages/svgImages/ResetIcon";
import {
  buildShortLink,
  formatTime,
  handleRecentlyPlayedAudios,
  setLocalizedData,
} from "../../helpers/app";
import { colors } from "../../styles/theme";
import Text from "../../components/utilities/Text";
import PlaylistAddedIcon from "../../assets/appImages/svgImages/PlaylistAddedIcon";
import DownloadIcon from "../../assets/appImages/svgImages/DownloadIcon";
import UnfavouriteIcon from "../../assets/appImages/svgImages/UnfavouriteIcon";
import FavouriteIcon from "../../assets/appImages/svgImages/FavouriteIcon";
import SeekBarComponent from "../player/SeekBarComponent";
import TrackPlayer, { State, useProgress } from "react-native-track-player";
import CloseIcon from "../../assets/appImages/svgImages/CloseIcon";
import PlussolidIcon from "../../assets/appImages/svgImages/PlussolidIcon";
import PauseGrayIcon from "../../assets/appImages/svgImages/PauseGrayIcon";
import { convertToTrack, mapToTrackFlyweight } from "../player/utils";
import { setAllUserPlayListsData } from "../../store/storeAppData/playlists";
import {
  addUserFavouritesAudio,
  createuserplaylist,
  getAllUserPlaylists,
  removeUserFavouritesAudio,
  updateAudioInPlayList,
} from "../../resources/baseServices/app";
import {
  addAudioToFavourites,
  removeAudioFromFavourites,
} from "../../store/storeAppData/favouritesAudio";
import gifs from "../../assets/appGif/appGif";
import CustomToast from "../../components/customToast/CustomToast";
import SubscriptionModal from "../../components/subscriptionModal/SubscriptionModal";
import { setIsFirstFreeAudioPlay } from "../../store/storeAppData/actions/subscriptionAction";
import ProgressBar from "../../components/progressBar/ProgressBar";
import SpinnerLoader from "../../components/progressBar/SpinnerLoader";
import Share from "react-native-share";
import CheckIcon from "../../assets/appImages/svgImages/CheckIcon";
import CongratulationsIcon from "../../assets/appImages/svgImages/CongratulationsIcon.svg";
import i18n from "../../translations/i18n";
import CongratsModal from "../../components/subscriptionModal/CongratulationsModal";
import { YEARLY, YEARLY_PROMO } from "../../constants/InAppPurchase";
import { useNetInfoInstance } from "@react-native-community/netinfo";
import { LandingLogo } from "../../icons/landing/landing-logo";

export const MeditationSessionModal = (props) => {
  const { top, bottom } = useSafeAreaInsets();
  const FOUR_SECONDS = 4;
  const isSharedAudio = props?.isSharedAudio ? props?.isSharedAudio : false;
  const isDefaultAudio = props?.isDefaultAudio ? props?.isDefaultAudio : false;
  const progress = useProgress();
  // const navigation = useNavigation();
  const [duration, setDuration] = useState(0);
  const [newPlaylistText, setnewPlaylistText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [downloads, setDownloads] = useState({});
  const downloadAudioListData = useSelector(
    (state) => state?.playlistsReducer?.downloadAudioListData
  );
  const selectPlayListData = useSelector(
    (state) => state?.categoriesReducer?.selectPlayListData
  );
  const selectedLanguage = useSelector(
    (state) => state?.language.selectedLanguage
  );
  const { selectedAudioDetails } = useSelector(
    (state) => state?.subCategoryAudioReducer
  );
  const selectedData = downloadAudioListData.find(
    (item) => item?.id === selectPlayListData?.id
  );
  const { isUserSubscribed, isFirstFreeAudioPlay } = useSelector(
    (state) => state?.subscription
  );
  const getAllUserPlayListData = useSelector(
    (state) => state?.playlistsReducer?.getAllUserPlayListData
  );
  const randomImages = useSelector(
    (state) => state?.audioLinkReducer?.randomImages
  );
  const {
    netInfo: { type, isConnected },
    refresh,
  } = useNetInfoInstance();
  // const {
  //   selectedSnappoint,
  //   setSelectedSnappoint,
  //   trackForBottomSheet,
  //   openBottomSheet,
  //   selectedMode,
  //   selectDisplayMode,
  //   selectCreateMode,
  // } = useUserPlaylistBottomsheet();
  const dispatch = useDispatch();
  const player = usePlayer();
  const { state } = player;
  const smallPlayer = useSmallPlayer();

  const [isRepeatPressed, setIsRepeatPressed] = useState(false);
  const [newPlaylistModalVisible, setNewPlaylistModalVisible] = useState(false);
  const [randomGif, setRandomGif] = useState(null);
  const [openSubscriptionModal, setOpenSubscriptionModal] = useState(false);
  const [visibleSubscriptionModal, setIsVisibleSubscriptionModal] =
    useState(false);
  const modal = useModal();
  const subscriptionModal = useModal();
  const [activeAudion, setActiveAudion] = useState({});
  const [toastVisible, setToastVisible] = useState(false);
  const [isAudiDownloaded, setIsAudioDownloaded] = useState(false);
  const [isFirstCall, setIsFirstCall] = useState(true);
  const [isChangeStatus, setISChangeStatus] = useState({
    removeStatus: false,
    addStatus: false,
    repeatModeOn: false,
    repeatModeOff: false,
    repeatModeOnAction: "Repeat mode enabled.",
    repeatModeOffAction: "Audio repeat disabled.",
    removeAction: "Audio is removed from",
    addAction: "Audio is successfully added to",
  });

  const showToast = () => {
    setToastVisible(true);
  };
  const favourites = useSelector(
    (state) => state?.favouritesAudioReducer?.favourites || []
  );
  const [playlists, setPlaylists] = useState([]);

  const [fetched, setFetched] = useState(false);
  const [currentTrack, setCurrentTrack] = useState();
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isAudioInPlaylist, setIsAudioInPlayList] = useState([]);
  const [initialsPlaylists, setInitialsPlaylists] = useState([]);
  const audioFavId = activeAudion?.id ? activeAudion?.id : props?.track?.id;
  const [isFavourite, setIsFavourite] = useState(
    favourites?.some((audio) => audio?.id === audioFavId)
  );
  const [isDownloaded, setIsDownloaded] = useState(false);
  const isPlayListDisabled = playlists?.length === 0;

  const checkIfAudioInPlaylists = (playlists, audioId) => {
    return playlists
      ?.map((playlist) => {
        if (playlist?.audios?.some((audio) => audio?.audioId === audioId)) {
          return playlist?.id;
        }
      })
      ?.filter((item) => item);
  };

  const memoizedCallback = useCallback(() => {
    const audioId = player?.activeTrack?.id ?? props?.id;
    const isAudioInPlaylists = checkIfAudioInPlaylists(
      getAllUserPlayListData,
      audioId
    );
    setIsAudioInPlayList(isAudioInPlaylists);
    setInitialsPlaylists(isAudioInPlaylists);
  }, [getAllUserPlayListData, player?.activeTrack?.id, props?.id]);

  useEffect(() => {
    setIsFavourite(favourites?.some((audio) => audio?.id === audioFavId));
  }, [activeAudion, favourites, props]);
  useEffect(() => {
    const init = async () => {
      try {
        if (props.maximize) {
          setFetched(true);
          // setCurrentTrack(player.activeTrack);
          const { shouldPauseForSubscription, shouldUpdateFirstAudio } =
            shouldShowSubscriptionModal();
          if (shouldPauseForSubscription) {
            player.pause();
            setOpenSubscriptionModal(true);
          }

          if (shouldUpdateFirstAudio) dispatch(setIsFirstFreeAudioPlay(false));
        } else {
          setActiveAudion(props.track);
          await player
            .setQueue(
              mapToTrackFlyweight(props.playlist),
              convertToTrack(props.track),
              isSharedAudio,
              isDefaultAudio
            )
            .then(() => {
              player.play();
            });
          setFetched(true);
        }
      } catch (error) {
        console.log("error =--->", error);
      }
    };
    setDownloads((prevState) => ({
      ...prevState,
      [audioFavId]: { trackDownloadProgress: 0, isTrackDownloading: false }, // Mark download as failed
    }));
    init();
  }, [isSharedAudio]);
  useEffect(() => {
    if (currentTrack) {
      const fetchDuration = async () => {
        const { duration } = await TrackPlayer.getProgress();

        setDuration(duration != 0 ? duration : currentTrack.duration);
      };

      fetchDuration();
    } else {
      setDuration(props.track?.duration);
    }
  }, [currentTrack]);

  useEffect(() => {
    if (downloadAudioListData?.length > 0) {
      const audioId = activeAudion?.id ? activeAudion?.id : props.track.id;
      const isDownloaded = downloadAudioListData.some(
        (item) => item?.id === audioId
      );
      setIsDownloaded(isDownloaded);
      if (!isAudiDownloaded && isConnected == false) {
        player.pause();
        onMinimize();
      }
    }
  }, [downloadAudioListData, props, activeAudion]);

  useEffect(() => {
    if (selectedAudioDetails?.id) {
      // setActiveAudion(selectedAudioDetails);
    }
  }, []);

  const handleAddPlaylistPress = async () => {
    if (isUserSubscribed) {
      try {
        setIsLoading(true); // Optional: Display loading indicator
        await fetchAllUserPlaylists(); // Fetch playlists from backend
        setPlaylistModalVisible(true); // Show modal after fetching
      } catch (error) {
        console.error("Failed to load playlists", error);
      } finally {
        setIsLoading(false); // Stop the loader after fetching
      }
    } else {
      pause();
      setOpenSubscriptionModal(true);
    }
  };

  useEffect(() => {
    if (fetched && player.activeTrack) {
      if (player.activeTrack.id !== currentTrack?.id) {
        isConnected == true &&
          handleRecentlyPlayedAudios(dispatch, player.activeTrack.id);
        setCurrentTrack(player.activeTrack);
        setActiveAudion(player.activeTrack);
      }
    }
  }, [player.activeTrack, fetched]);

  const shouldShowSubscriptionModal = () => {
    const isLoadingState = player.state === State.Loading;
    const isPlayingState = player.state === State.Playing;
    const isFreeAudio = props?.isFreeAudio;
    const isDownloadedAudio = props?.isDownloadedAudio;
    const shouldPauseForSubscription =
      isLoadingState &&
      !isUserSubscribed &&
      isFreeAudio &&
      !isFirstFreeAudioPlay &&
      !isDownloadedAudio;
    const shouldUpdateFirstAudio =
      !isUserSubscribed &&
      isFreeAudio &&
      isFirstFreeAudioPlay &&
      isPlayingState;

    return { shouldPauseForSubscription, shouldUpdateFirstAudio };
  };

  useEffect(() => {
    const { shouldPauseForSubscription, shouldUpdateFirstAudio } =
      shouldShowSubscriptionModal();
    if (shouldPauseForSubscription) {
      player.pause();
      setOpenSubscriptionModal(true);
    }

    if (shouldUpdateFirstAudio) dispatch(setIsFirstFreeAudioPlay(false));
  }, [player.state]);

  useEffect(() => {
    const init = async () => {
      if (props.track) {
        // setCurrentTrack(props.track);
        const totalDuration = await TrackPlayer.getDuration();
        setDuration(totalDuration);
      }
    };
    init();
  }, [props.track]);

  const onMinimize = () => {
    props.onClose();
    smallPlayer?.openSmallPlayer();
  };

  const downloadAudio = async () => {
    if (isUserSubscribed) {
      try {
        if (!props.track && !activeAudion?.id) {
          return;
        }
        const downloadableAudio =
          Object.keys(activeAudion).length > 0 ? activeAudion : props.track;
        setDownloads((prevState) => ({
          ...prevState,
          [audioFavId]: { trackDownloadProgress: 0, isTrackDownloading: true },
        }));
        const response = await setLocalizedData(
          downloadableAudio,
          selectedLanguage,
          dispatch,
          (audioId, progress) => {
            if (progress % 10 === 0 || progress === 100) {
              setDownloads((prevState) => ({
                ...prevState,
                [audioId]: {
                  trackDownloadProgress: progress,
                  isTrackDownloading: progress < 100,
                },
              }));
            }
          }
        );
        if (response.isDownloadComplete) {
          setIsAudioDownloaded(true);
        }
      } catch (error) {
        console.error("error downloadAudio =--->", error);
        setDownloads((prevState) => ({
          ...prevState,
          [audioFavId]: { trackDownloadProgress: 0, isTrackDownloading: false }, // Mark download as failed
        }));
      } finally {
        setDownloads((prevState) => ({
          ...prevState,
          [audioFavId]: { trackDownloadProgress: 0, isTrackDownloading: false }, // Mark download as failed
        }));
      }
    } else {
      pause();
      setOpenSubscriptionModal(true);
    }
  };

  const pause = async () => {
    await player.pause();
  };
  const play = async () => {
    await player.play();
  };

  const prevTrack = async () => {
    // const trackPosition = progress.position;
    // if (trackPosition > FOUR_SECONDS) {
    //   await TrackPlayer.seekTo(0);
    //   return;
    // }
    await player.prev();
    getRandomGif(); // Change GIF to a new random one
  };

  const handleRepeatButtonPress = async () => {
    setIsFirstCall(false);
    setIsRepeatPressed(!isRepeatPressed);
    player.toggleRepeatMode();
    // await repeatEvent(); // Removed as 'repeatEvent' is not defined
  };

  useEffect(() => {
    if (!isFirstCall) {
      if (isRepeatPressed) {
        setISChangeStatus((prevState) => ({
          ...prevState,
          repeatModeOn: true,
          repeatModeOff: false,
        }));
      } else {
        setISChangeStatus((prevState) => ({
          ...prevState,
          repeatModeOn: false,
          repeatModeOff: true,
        }));
      }
    }
  }, [isRepeatPressed, isFirstCall]);

  // Function to get a random image
  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * randomImages.length);
    // console.log("randomImages[randomIndex]", randomImages[randomIndex]);
    return randomImages[randomIndex];
  };

  const onClickShareIcon = async () => {
    try {
      if (!player.activeTrack?.id) {
        return;
      }
      setIsSharing(true);
      const poster = getRandomImage();
      const shareLink = await buildShortLink(
        player.activeTrack.title,
        poster,
        player.activeTrack?.id,
        selectedLanguage
      );
      setIsSharing(false);
      // const result = await Share.share({
      //   message: shareLink,
      // });
      const shareOptions = {
        message: player.activeTrack.title,
        url: shareLink,
      };
      const result = await Share.open(shareOptions);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.error("onClickShareIcon =--->", error.message);
    }
  };
  const isPlaying = state === State.Playing;
  const handleSelectPlaylist = (id, isNew) => {
    if (isAudioInPlaylist?.includes(id)) {
      setIsAudioInPlayList(isAudioInPlaylist.filter((item) => item !== id));
    } else {
      setIsAudioInPlayList([...isAudioInPlaylist, id]);
    }
    if (isNew) {
      setPlaylistModalVisible(false); // Close the first modal
      setNewPlaylistModalVisible(true); // Open the new playlist modal
    }
  };

  const handleAddNewPlaylist = async () => {
    if (!newPlaylistText) return;

    try {
      const data = {
        title: newPlaylistText,
      };

      const response = await createuserplaylist("", data);

      if (response && response?.data?.code == 200) {
        fetchAllUserPlaylists();
        setnewPlaylistText("");
        setNewPlaylistModalVisible(false);
        setPlaylistModalVisible(true);
      } else {
        console.error("Unexpected API response:", response);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
    } finally {
      console.log("Playlist creation process done");
    }
  };

  const fetchAllUserPlaylists = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUserPlaylists();
      // console.log("response Playlist", response?.data);

      // Access the userPlaylists array in the response
      if (response && Array.isArray(response?.data?.userPlaylists)) {
        setPlaylists(response.data.userPlaylists); // Set the playlists from the correct key
        dispatch(setAllUserPlayListsData(response.data.userPlaylists)); // Dispatch to Redux if needed
      } else {
        console.error("Unexpected response structure:", response);
        setPlaylists([]); // Set to an empty array if the response is invalid
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
      setPlaylists([]);
    } finally {
      setIsLoading(false);
      console.log("Done fetching playlists");
    }
  };
  const handleClosePlaylistModal = () => {
    setPlaylistModalVisible(false);
  };

  const handleAddtoPlaylistModal = () => {
    handleAddToPlayList();
  };

  const handleCloseNewPlaylistModal = () => {
    setNewPlaylistModalVisible(false);
  };

  const handleFavouriteOnPress = async () => {
    if (isUserSubscribed) {
      const audioId = activeAudion?.id ? activeAudion?.id : props.track.id;
      if (!audioId) {
        console.error("No audio ID available");
        return;
      }

      try {
        // Check if the audio is already in the user's favorites
        const audioExists = favourites?.some((audio) => audio?.id === audioId);

        if (audioExists) {
          // If it exists, remove it from favorites
          const response = await removeUserFavouritesAudio(audioId);
          const removeFav = favourites.filter((audio) => audio?.id !== audioId);
          if (response) {
            dispatch(removeAudioFromFavourites(removeFav));
            setISChangeStatus((prevState) => ({
              ...prevState,
              removeStatus: true,
              addStatus: false,
            }));
            // setIsFavourite(false); // Set the state to indicate it's unfavorited
          }
        } else {
          // If it doesn't exist, add it to favorites
          const response = await addUserFavouritesAudio(audioId);
          if (response.data.code === 200) {
            const audio =
              Object.keys(activeAudion).length > 0 ? activeAudion : props.track;
            dispatch(addAudioToFavourites([...favourites, audio]));
            setISChangeStatus((prevState) => ({
              ...prevState,
              removeStatus: false,
              addStatus: true,
            }));
            // setIsFavourite(true); // Set the state to indicate it's favorited
          }
        }
      } catch (error) {
        console.error("Error in handleFavouriteOnPress --->", error);
      }
    } else {
      setOpenSubscriptionModal(true);
    }
  };

  const handleAddToPlayList = async () => {
    try {
      const forRemove = initialsPlaylists?.filter(
        (i) => !isAudioInPlaylist?.includes(i)
      );
      const forAdd = isAudioInPlaylist?.filter(
        (i) => !initialsPlaylists?.includes(i)
      );

      if (forRemove?.length > 0 && forAdd?.length > 0) {
        console.error("Invalid playlist or audio selection");
        return;
      }
      const AudioID = activeAudion?.id ? activeAudion?.id : props.track.id;
      const data = {
        addToPlaylists: forAdd,
        removeFromPlaylists: forRemove,
      };
      const response = await updateAudioInPlayList(data, AudioID);

      if (response?.data?.code === 200) {
        await fetchAllUserPlaylists();
        showToast();
      }
    } catch (error) {
      console.error("Error adding audio to playlist:", error);
    } finally {
      setPlaylistModalVisible(false);
      console.log("Add to playlist process done");
    }
  };
  const getRandomGif = () => {
    consoleLog("RandomGifts", gifs);
    const randomIndex = Math.floor(Math.random() * gifs.length);
    setRandomGif(gifs[randomIndex]);
  };

  // Set a random GIF initially
  useEffect(() => {
    getRandomGif();
  }, [currentTrack]);

  const nextTrack = async () => {
    await player.next(); // Skip to next track
    getRandomGif(); // Change GIF to a new random one
  };

  useEffect(() => {
    if (getAllUserPlayListData?.length > 0) memoizedCallback();
  }, [player?.activeTrack?.id, getAllUserPlayListData]);

  const downloadState = downloads[audioFavId] || {
    trackDownloadProgress: 0,
    isTrackDownloading: false,
  }; // Default state if not downloading
  const { trackDownloadProgress, isTrackDownloading } = downloadState;
  return (
    <Modal
      animationType={"fade"}
      transparent={true}
      statusBarTranslucent={true}
      visible={true}
      onRequestClose={() => {
        onMinimize();
      }}
      // style={{ height: 100 }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ModalProvider>
          <ModalManager />
          <ImageBackground
            source={require("../../assets/appImages/ExploreBackgroundImageNew.png")}
            style={{ flex: 1 }}
          >
            <View style={wrapperStyle(bottom)}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent:
                    Platform.OS === "android"
                      ? "space-around"
                      : "space-between",
                }}
              >
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: perfectSize(20),
                    flexGrow: 1,
                  }}
                  scrollEnabled={false}
                >
                  {/* <Padding vertical={24}> */}
                  <Center flex={1}>
                    <Block
                      flex={1}
                      style={{
                        width: "100%",
                        // height: perfectSize(550),
                      }}
                      // radius={perfectSize(10)}
                    >
                      <Block
                        flex={false}
                        row
                        between
                        style={[
                          styles.headerContainer,
                          {
                            top: top,
                            alignItems: "flex-end",
                          },
                        ]}
                      >
                        <Block
                          row
                          between
                          flex={false}
                          style={{ width: "63%", alignItems: "flex-end" }}
                        >
                          <Block
                            flex={false}
                            style={{
                              backgroundColor: "rgba(0, 0, 0, 0.3)",
                              borderRadius: 25,
                              height: perfectSize(40),
                              width: perfectSize(40),
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <TouchableOpacity onPress={onMinimize}>
                              <DownArrow height={23} width={23} />
                            </TouchableOpacity>
                          </Block>
                          <LandingLogo
                            height={perfectSize(60)}
                            width={perfectSize(100)}
                          />
                        </Block>
                        <Block
                          flex={false}
                          row
                          between
                          style={styles.headerRight}
                        >
                          <TouchableOpacity
                            onPress={handleAddPlaylistPress}
                            style={{
                              opacity: 1,
                              backgroundColor: "rgba(0, 0, 0, 0.3)",
                              borderRadius: 25,
                              height: perfectSize(40),
                              width: perfectSize(40),
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <AddPlaylistIcon height={18} width={18} />
                          </TouchableOpacity>
                          {!isDownloaded && (
                            <Block flex={false} style={styles.downloadIcon}>
                              {isTrackDownloading ? (
                                <>
                                  {trackDownloadProgress > 0 ? (
                                    <Block flex={false}>
                                      <ProgressBar
                                        progress={trackDownloadProgress}
                                      />
                                    </Block>
                                  ) : (
                                    <Block flex={false}>
                                      <SpinnerLoader />
                                    </Block>
                                  )}
                                </>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => downloadAudio()}
                                >
                                  <Clouddownloadaltsolid
                                    height={24}
                                    width={24}
                                  />
                                </TouchableOpacity>
                              )}
                            </Block>
                          )}
                          <TouchableOpacity
                            onPress={() => onClickShareIcon()}
                            style={styles.downloadIcon}
                            disabled={isSharing}
                          >
                            {isSharing ? (
                              <SpinnerLoader />
                            ) : (
                              <ShareIcon height={20} width={20} />
                            )}
                          </TouchableOpacity>
                        </Block>
                      </Block>
                      <Image
                        source={randomGif}
                        style={{
                          width: "100%",
                          height: "100%",
                          // overflow: "hidden",
                        }}
                        resizeMode="stretch"
                      />
                    </Block>
                  </Center>
                  {/* </Padding> */}
                  <Block flex={0.1}>
                    <Block flex={false} style={styles.audioInfoContainer}>
                      <Block flex={false} row between>
                        <Text
                          size={responsiveScale(14)}
                          regular
                          color={colors.white}
                          style={{ flex: 1 }}
                        >
                          {player.activeTrack.title}
                        </Text>
                        <Block flex={false} row>
                          {isAudioInPlaylist?.length > 0 && (
                            <Block flex={false}>
                              <PlaylistAddedIcon height={24} width={24} />
                            </Block>
                          )}
                          <TouchableOpacity
                            style={{ marginLeft: perfectSize(10) }}
                            onPress={() => handleFavouriteOnPress()}
                          >
                            {isFavourite ? (
                              <FavouriteIcon height={24} width={24} /> // Render FavouriteIcon if the track is favorited
                            ) : (
                              <UnfavouriteIcon height={24} width={24} /> // Render UnfavouriteIcon if the track is not favorited
                            )}
                          </TouchableOpacity>
                        </Block>
                      </Block>
                      <Text
                        size={responsiveScale(12)}
                        regular
                        color={colors.lightBorderColor}
                        style={styles.subtitleText}
                      >
                        {props?.track?.title_EN}
                      </Text>

                      <Block flex={false} style={styles.divider} />

                      <SeekBarComponent />

                      <Block flex={false} row between>
                        <Text
                          size={responsiveScale(12)}
                          regular
                          color={colors.white}
                        >
                          {formatTime(progress.position * 1000)}
                        </Text>
                        <Text
                          size={responsiveScale(12)}
                          regular
                          color={colors.white}
                        >
                          {formatTime(duration * 1000)}
                        </Text>
                      </Block>

                      <Block
                        flex={false}
                        row
                        center
                        style={styles.controlsContainer}
                      >
                        <TouchableOpacity onPress={prevTrack}>
                          <Skipback height={24} width={24} />
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                          onPress={isPlaying ? pause : play}
                          style={styles.playButton}
                        >
                          {isPlaying ? (
                            <PauseGrayIcon height={50} width={50} />
                          ) : (
                            <PlayGrayIcon height={50} width={50} />
                          )}
                        </TouchableOpacity> */}
                        <Pressable
                          onPress={isPlaying ? pause : play}
                          style={styles.playButton}
                        >
                          {isPlaying ? (
                            <PauseGrayIcon height={50} width={50} />
                          ) : (
                            <PlayGrayIcon height={50} width={50} />
                          )}
                        </Pressable>
                        <TouchableOpacity onPress={nextTrack}>
                          <Skipnext height={34} width={34} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.resetButton,
                            isRepeatPressed && styles.isActiveRepeat,
                          ]}
                          onPress={handleRepeatButtonPress}
                        >
                          <Image
                            source={require("../../assets/appImages/Repeat.png")}
                            style={{ height: 24, width: 24 }}
                          />
                        </TouchableOpacity>
                      </Block>
                    </Block>
                  </Block>
                </ScrollView>
                <View style={styles.playerWrapper}>
                  {/* <PlayerNew currentTrack={currentTrack} /> */}
                </View>
              </View>
            </View>
            {/* <UserPlaylistBottomSheet
              selectedSnappoint={selectedSnappoint}
              setSelectedSnappoint={setSelectedSnappoint}
              selectedAudio={trackForBottomSheet}
              selectedMode={selectedMode}
              selectCreateMode={selectCreateMode}
              selectDisplayMode={selectDisplayMode}
            /> */}
          </ImageBackground>
          <CustomToast
            actionIcon={
              <PlaylistAddedIcon height={24} width={24} style={styles.icon} />
            }
            visible={toastVisible}
            message="Audio is successfully added to playlist."
            onHide={() => setToastVisible(false)}
          />
          <CustomToast
            actionIcon={
              <DownloadIcon height={24} width={24} style={styles.icon} />
            }
            visible={isAudiDownloaded}
            message="Audio is successfully downloaded."
            onHide={() => setIsAudioDownloaded(false)}
          />
          {/* {console.log("isChangeStatus", isChangeStatus)} */}
          <CustomToast
            hideOn={1000}
            animationDuration={100}
            actionIcon={
              <ResetIcon height={24} width={24} style={styles.icon} />
            }
            visible={isChangeStatus.repeatModeOn}
            message={`${isChangeStatus.repeatModeOnAction}`}
            onHide={() =>
              setISChangeStatus((prevState) => ({
                ...prevState,
                repeatModeOn: false,
              }))
            }
          />
          <CustomToast
            hideOn={1000}
            animationDuration={100}
            actionIcon={
              <ResetIcon height={24} width={24} style={styles.icon} />
            }
            visible={isChangeStatus.repeatModeOff}
            message={`${isChangeStatus.repeatModeOffAction}`}
            onHide={() =>
              setISChangeStatus((prevState) => ({
                ...prevState,
                repeatModeOff: false,
              }))
            }
          />
          <CustomToast
            hideOn={1000}
            animationDuration={100}
            actionIcon={
              <FavouriteIcon height={24} width={24} style={styles.icon} />
            }
            visible={isChangeStatus.addStatus}
            message={`${isChangeStatus.addAction} favorites.`}
            onHide={() =>
              setISChangeStatus((prevState) => ({
                ...prevState,
                addStatus: false,
              }))
            }
          />
          <CustomToast
            hideOn={1000}
            animationDuration={100}
            actionIcon={
              <UnfavouriteIcon height={24} width={24} style={styles.icon} />
            }
            visible={isChangeStatus.removeStatus}
            message={`${isChangeStatus.removeAction} favorites.`}
            onHide={() =>
              setISChangeStatus((prevState) => ({
                ...prevState,
                removeStatus: false,
              }))
            }
          />
        </ModalProvider>
        <Modal
          transparent={true}
          visible={playlistModalVisible}
          animationType="slide"
          onRequestClose={handleClosePlaylistModal}
        >
          <TouchableWithoutFeedback onPress={handleClosePlaylistModal}>
            <Block flex={1} />
          </TouchableWithoutFeedback>
          {!newPlaylistModalVisible && (
            <Block flex={1} style={styles.modalContainer}>
              <Block flex={false} style={styles.modalContent}>
                <Block flex={false} row style={styles.modalHeader}>
                  <Text
                    color={colors.white}
                    center
                    size={responsiveScale(14)}
                    medium
                  >
                    {i18n.t("Saved to your Playlist")}
                  </Text>
                  <TouchableOpacity
                    onPress={handleClosePlaylistModal}
                    center
                    style={styles.closeButton}
                  >
                    <CloseIcon />
                  </TouchableOpacity>
                </Block>
                <Text
                  color={colors.lightBorderColor}
                  size={responsiveScale(12)}
                  regular
                  style={styles.modalSubtitle}
                >
                  {i18n.t("Add to Playlist")}
                </Text>

                {playlists.map((playlist, index) => (
                  <React.Fragment key={playlist.id}>
                    <TouchableOpacity
                      onPress={() =>
                        handleSelectPlaylist(playlist.id, playlist.isNew)
                      }
                    >
                      <Block
                        flex={false}
                        row
                        center
                        style={styles.playlistItem}
                      >
                        <Block flex={false} style={styles.playlistIcon}>
                          <AddPlaylistIcon height={20} width={20} />
                        </Block>
                        <Text
                          size={responsiveScale(12)}
                          medium
                          color={colors.white}
                          style={styles.playlistText}
                        >
                          {playlist.title}
                        </Text>
                        <TouchableOpacity
                          style={styles.radioButton}
                          onPress={() => handleSelectPlaylist(playlist.id)}
                        >
                          {isAudioInPlaylist?.includes(playlist.id) && (
                            <Block
                              width={perfectSize(18)}
                              height={perfectSize(18)}
                            >
                              <CheckIcon height={"100%"} width={"100%"} />
                            </Block>
                          )}
                        </TouchableOpacity>
                      </Block>
                    </TouchableOpacity>
                    {index < playlists.length - 1 && (
                      <Block
                        flex={false}
                        color={colors.lightBorderColor}
                        style={styles.dividertwo}
                      />
                    )}
                  </React.Fragment>
                ))}

                {/* Option for New Playlist */}
                <TouchableOpacity
                  onPress={() => setNewPlaylistModalVisible(true)}
                >
                  <Block flex={false} row center style={styles.playlistItem}>
                    <Block flex={false} style={styles.playlistIcon}>
                      <PlussolidIcon height={22} width={22} />
                    </Block>
                    <Text
                      size={responsiveScale(12)}
                      medium
                      color={colors.white}
                      style={styles.playlistText}
                    >
                      {i18n.t("New Playlist")}
                    </Text>
                  </Block>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.addButton,
                    {
                      opacity: isPlayListDisabled ? 0.5 : 1,
                    },
                  ]}
                  onPress={handleAddtoPlaylistModal}
                  disabled={isPlayListDisabled}
                >
                  <Text
                    size={responsiveScale(14)}
                    medium
                    color={colors.black}
                    center
                  >
                    {i18n.t("Add to Playlist")}
                  </Text>
                </TouchableOpacity>
              </Block>
            </Block>
          )}
          <Modal
            transparent={true}
            visible={newPlaylistModalVisible}
            animationType="slide"
            onRequestClose={() => setNewPlaylistModalVisible(false)}
          >
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <TouchableWithoutFeedback onPress={handleCloseNewPlaylistModal}>
                <Block flex={1} />
              </TouchableWithoutFeedback>
              <Block flex={1} style={styles.modalContainer}>
                <Block flex={false} style={styles.modalContent}>
                  <Block flex={false} row style={styles.modalHeader}>
                    <Text
                      color={colors.white}
                      center
                      size={responsiveScale(14)}
                      medium
                    >
                      {i18n.t("Create New Playlist")}
                    </Text>
                    <TouchableOpacity
                      onPress={handleCloseNewPlaylistModal}
                      center
                      style={styles.closeButton}
                    >
                      <CloseIcon />
                    </TouchableOpacity>
                  </Block>
                  <Text
                    color={colors.lightBorderColor}
                    size={responsiveScale(12)}
                    regular
                    style={styles.modalSubtitle}
                  >
                    {i18n.t("Choose a title")}
                  </Text>
                  <Block
                    flex={false}
                    row
                    center
                    style={{
                      borderBottomColor: "gray",
                      borderBottomWidth: 0.5,
                      marginBottom: perfectSize(5),
                    }}
                  >
                    <PenIcon />
                    <TextInput
                      style={styles.input}
                      placeholder="Title"
                      placeholderTextColor={colors.lightBorderColor}
                      value={newPlaylistText}
                      onChangeText={setnewPlaylistText}
                      onSubmitEditing={() =>
                        console.log("Submitted:", newPlaylistText)
                      }
                      keyboardType="default"
                      returnKeyType="done"
                      secureTextEntry={false}
                    />
                  </Block>
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      {
                        backgroundColor: newPlaylistText
                          ? colors.white
                          : colors.gray,
                      },
                    ]}
                    onPress={handleAddNewPlaylist}
                    disabled={!newPlaylistText}
                  >
                    <Text
                      size={responsiveScale(14)}
                      medium
                      color={newPlaylistText ? colors.black : colors.white}
                      center
                    >
                      {i18n.t("Confirm")}
                    </Text>
                  </TouchableOpacity>
                </Block>
              </Block>
            </KeyboardAvoidingView>
          </Modal>
        </Modal>
      </GestureHandlerRootView>
      {openSubscriptionModal && (
        <SubscriptionModal
          isVisible={openSubscriptionModal}
          hideModal={() => {
            setOpenSubscriptionModal(false);
            player.play();
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
      {/* {visibleSubscriptionModal && (
        <SubscriptionModal
          isVisible={visibleSubscriptionModal}
          hideModal={() => {
            setIsVisibleSubscriptionModal(false);
          }}
          onSubscribedUser={(plan) => {
            setIsVisibleSubscriptionModal(false);
            setTimeout(() => {
              console.log("plan onSubscribedUser", plan);
              subscriptionModal.show(CongratsModal, {
                message: `Welcome to Zoul.`,
                btnTitle: "Ok",
              });
            }, 1000);
          }}
        />
      )} */}
    </Modal>
  );
};

const wrapperStyle = () => ({
  height: "100%",
});

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
    width: "100%",
    paddingHorizontal: 15,
  },
  headerRight: {
    // paddingRight: perfectSize(10),
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  downloadIcon: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 25,
    height: perfectSize(40),
    width: perfectSize(40),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: perfectSize(8),
  },
  audioInfoContainer: {
    // backgroundColor: "#390111",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: perfectSize(16),
    borderRadius: perfectSize(8),
    marginTop: perfectSize(30),
    marginHorizontal: 20,
  },
  subtitleText: {
    marginTop: perfectSize(7),
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
  },
  controlsContainer: {
    marginTop: perfectSize(10),
    justifyContent: "center",
    marginLeft: perfectSize(40),
  },
  playButton: {
    marginHorizontal: perfectSize(32),
  },
  resetButton: {
    left: perfectSize(30),
    marginTop: perfectSize(3),
    height: 34,
    width: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainerPlaylist: {
    justifyContent: "flex-end",
  },
  modalContentPlaylist: {
    backgroundColor: colors.lightblack,
    padding: perfectSize(16),
    borderTopLeftRadius: perfectSize(14),
    borderTopRightRadius: perfectSize(14),
  },
  modalContainer: {
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.lightblack,
    padding: perfectSize(16),
    borderTopLeftRadius: perfectSize(14),
    borderTopRightRadius: perfectSize(14),
  },
  modalHeader: {
    justifyContent: "center",
  },
  closeButton: {
    left: perfectSize(70),
  },
  modalSubtitle: {
    marginTop: perfectSize(18),
  },
  playlistItem: {
    marginTop: perfectSize(12),
  },
  playlistIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  playlistText: {
    flex: 1,
  },
  radioButton: {
    width: 25,
    height: 25,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.lightBorderColor,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  dividertwo: {
    width: "100%",
    height: perfectSize(0.6),
    marginTop: perfectSize(10),
    alignSelf: "center",
    paddingHorizontal: perfectSize(20),
  },
  addButton: {
    padding: perfectSize(12),
    backgroundColor: colors.white,
    marginTop: perfectSize(15),
    borderRadius: perfectSize(8),
    marginBottom: perfectSize(10),
  },
  input: {
    height: perfectSize(43),
    paddingHorizontal: perfectSize(10),
    color: colors.white,
    fontSize: responsiveScale(13),
    fontWeight: "bold",
    width: "93%",
  },
  isActiveRepeat: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 25,
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
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10, // Adjust spacing as needed
  },
});
