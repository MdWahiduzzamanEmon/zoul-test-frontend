import React, { useRef, useState, useEffect, memo } from "react";
import {
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  Share,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { perfectSize, responsiveScale } from "../../styles/mixins";
import Block from "../utilities/Block";
import PlayGrayIcon from "../../assets/appImages/svgImages/PlayGrayIcon.svg";
import Text from "../utilities/Text";
import CloseImg from "../../assets/appImages/svgImages/CloseImg";
import { colors } from "../../styles/theme";
import DownArrow from "../../assets/appImages/svgImages/DownArrow";
import AddPlaylistIcon from "../../assets/appImages/svgImages/AddPlaylistIcon";
import Clouddownloadaltsolid from "../../assets/appImages/svgImages/Clouddownloadaltsolid";
import ShareIcon from "../../assets/appImages/svgImages/Share";
import PlaylistAddedIcon from "../../assets/appImages/svgImages/PlaylistAddedIcon";
import FavouriteIcon from "../../assets/appImages/svgImages/FavouriteIcon";
import Slider from "@react-native-community/slider";
import Skipback from "../../assets/appImages/svgImages/Skipback";
import Skipnext from "../../assets/appImages/svgImages/Skipnext";
import ResetIcon from "../../assets/appImages/svgImages/ResetIcon";
import PauseGrayIcon from "../../assets/appImages/svgImages/PauseGrayIcon";
import PlussolidIcon from "../../assets/appImages/svgImages/PlussolidIcon";
import CloseIcon from "../../assets/appImages/svgImages/CloseIcon";
import PenIcon from "../../assets/appImages/svgImages/PenIcon";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { getAsyncData } from "../../helpers/auth";
import Sound from "react-native-sound";
import MusicFinishedModal from "./MusicFinishedModal";
import { buildShortLink, setLocalizedData } from "../../helpers/app";
import {
  addUserFavouritesAudio,
  addUserPlaylists,
  removeUserFavouritesAudio,
} from "../../resources/baseServices/app";
import { useDispatch, useSelector } from "react-redux";
import {
  addAudioToFavourites,
  removeAudioFromFavourites,
} from "../../store/storeAppData/favouritesAudio";
import i18n from "../../translations/i18n";
const CommonBottomSheet = ({
  bottomSheetRef,
  enablePanDownToClose,
  handleComponent,
  onChange,
  handleDownArrowPress,
  // closeIconOnPress,
  playListImage,
  playListLable,
  playListSubLable,
  audioUrl,
  handleAudioCompletion,
  isFirstPlay,
}) => {
  const downloadAudioListData = useSelector(
    (state) => state?.playlistsReducer?.downloadAudioListData
  );
  const selectPlayListData = useSelector(
    (state) => state?.categoriesReducer?.selectPlayListData
  );
  const selectedLanguage = useSelector(
    (state) => state?.language.selectedLanguage
  );
  const selectedData = downloadAudioListData.find(
    (item) => item?.id === selectPlayListData?.id
  );
  const languageCode = selectedLanguage.toUpperCase();

  const audioFilePath = downloadAudioListData.some(
    (item) => item?.id === selectPlayListData?.id
  )
    ? selectedData?.link
    : selectPlayListData?.[`link_${languageCode}`] !== null
    ? selectPlayListData?.[`link_${languageCode}`]
    : "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3";

  const sharedValue = useSharedValue(0);
  const snapPoints = React.useMemo(() => ["10%", "100%"], []);
  const [volume, setVolume] = useState(1);
  const [audioDuration, setAudioDuration] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playListData, setPlayListData] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(1);
  const [newPlaylistModalVisible, setNewPlaylistModalVisible] = useState(false);
  const [musicFinishedModalVisible, setMusicFinishedModalVisible] =
    useState(false);
  const [nextModalVisible, setNextModalVisible] = useState(false);
  const favourites = useSelector(
    (state) => state?.favouritesAudioReducer?.favourites || []
  );
  const { selectedAudioDetails } = useSelector(
    (state) => state?.subCategoryAudioReducer
  );

  const [playlists, setPlaylists] = useState([
    { id: 1, name: "My Meditation" },
    { id: 2, name: "My Sleep" },
    { id: 3, name: "My Relaxation" },
    { id: 4, name: "New Playlist", isNew: true },
  ]);
  const [isPlaylistAdded, setIsPlaylistAdded] = useState(false);
  const [sound, setSound] = useState(null);
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [newPlaylistText, setnewPlaylistText] = useState("");
  const intervalRef = useRef(null);
  const dispatch = useDispatch();

  const handleSliderValueChange = (value) => {
    if (sound) {
      sound.setCurrentTime(value); // Set the audio's current playback time based on the slider value
    }
  };

  const animatedStyles = useAnimatedStyle(() => {
    const height = interpolate(sharedValue.value, [0, 1], [100, 0]);
    const opacity = interpolate(sharedValue.value, [0, 1], [1, 0]);
    return {
      height,
      opacity,
    };
  });

  const fetchData = async () => {
    const useState = await getAsyncData("playListData");
    setPlayListData(JSON.parse(useState));
  };
  useEffect(() => {
    fetchData();
  }, [onChange]);

  useEffect(() => {
    if (audioUrl) {
      const audioFilePath = audioUrl?.length
        ? audioUrl
        : "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3";

      const newSound = new Sound(audioFilePath, null, (error) => {
        if (error) {
          console.log("Failed to load sound", error);
          return;
        }
        setSound(newSound);
        const duration = newSound.getDuration();
        // console.log("Audio Duration: ", duration);
        // if (duration > 0) {
        //   setAudioDuration(duration);
        // } else {
        //   console.log("Failed to get audio duration.");
        // }
        setAudioDuration(duration > 0 ? duration : 0);
        if (!isFirstPlay) playSound(newSound); // Automatically start playing the new audio
      });

      return () => {
        if (sound) {
          sound.release();
        }
      };
    }
  }, [audioUrl, isFirstPlay]);

  const handleAddPlaylistPress = () => {
    setPlaylistModalVisible(true);
  };

  const handleClosePlaylistModal = () => {
    setPlaylistModalVisible(false);
    setIsPlaylistAdded(true);
  };

  const handleCloseNewPlaylistModal = () => {
    setNewPlaylistModalVisible(false);
  };

  const handleAddNewPlaylist = async () => {
    if (!newPlaylistText.trim()) {
      return;
    }

    try {
      const data = {
        title: newPlaylistText,
      };
      const response = await addUserPlaylists(data);
      if (response) {
        setnewPlaylistText("");
        setNewPlaylistModalVisible(false);
      }
    } catch (error) {
      console.error("Error handleAddNewPlaylist =--->", error);
    } finally {
    }
  };

  const playSound = (sound) => {
    if (sound) {
      sound.setVolume(volume);
      sound.play(async (success) => {
        if (success) {
          setIsPlaying(false);
          // setMusicFinishedModalVisible(true);
          await handleAudioCompletion?.();
          setSliderValue(0);
        } else {
          console.log("Playback failed");
        }
        // Clear the interval when playback ends
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      });
      setIsPlaying(true);
      // Start updating sliderValue
      intervalRef.current = setInterval(() => {
        sound.getCurrentTime((seconds, isPlaying) => {
          setSliderValue(seconds);
        });
      }, 1000);
    }
  };

  const skipToNextOrPrevious = async (isSkipPrevious = false) => {
    if (
      (isSkipPrevious && selectedAudioDetails?.previousAudioButtonDisabled) ||
      (!isSkipPrevious && selectedAudioDetails?.nextAudioButtonDisabled)
    ) {
      return; // Prevent triggering the action if the button is disabled
    }
    setIsPlaying(false);
    setSliderValue(0);
    setSound(null);
    if (sound) {
      sound.release(); // Release the previous sound instance
    }
    await handleAudioCompletion(isSkipPrevious);
  };

  // useEffect(() => {
  //   let timer;
  //   if (musicFinishedModalVisible) {
  //     timer = setTimeout(() => {
  //       setNextModalVisible(true);
  //     }, 2000);
  //   } else {
  //     setNextModalVisible(false);
  //   }
  //   return () => {
  //     if (timer) {
  //       clearTimeout(timer);
  //     }
  //   };
  // }, [musicFinishedModalVisible]);
  const handleCloseNextModal = () => {
    setNextModalVisible(false);
    setMusicFinishedModalVisible(false);
  };
  const pauseSound = () => {
    if (sound) {
      sound.pause(() => {
        console.log("Paused");
      });
      setIsPlaying(false);
    }
  };

  const handleSelectPlaylist = (id, isNew) => {
    setSelectedPlaylist(id);
    if (isNew) {
      setPlaylistModalVisible(false);
      setNewPlaylistModalVisible(true);
    }
  };
  useEffect(() => {
    sharedValue.value = withTiming(1, { duration: 500 });
  }, []);

  const onClickShareIcon = async () => {
    try {
      const shareLink = await buildShortLink(
        audioFilePath,
        playListLable,
        "https://zoul-prod-assets.s3.eu-west-2.amazonaws.com/category/test/meditation.png"
      );

      const result = await Share.share({
        message: shareLink,
        url: shareLink,
      });
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
      console.log(error.message);
    }
  };
  const handleFavouriteOnPress = async (audioId) => {
    try {
      const audioExists = favourites?.some((audio) => audio?.id === audioId);

      if (audioExists) {
        const response = await removeUserFavouritesAudio(audioId);

        if (response) {
          dispatch(removeAudioFromFavourites(audioId));
        }
      } else {
        const response = await addUserFavouritesAudio(audioId);

        if (response) {
          dispatch(addAudioToFavourites(response));
        }
      }
    } catch (error) {
      console.error("Error Add handleFavouriteOnPress --->", error);
    } finally {
    }
  };
  const downloadAudio = () => {
    setLocalizedData(selectPlayListData, selectedLanguage, dispatch);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseSound();
    } else {
      playSound(sound);
    }
  };

  const closeIconOnPress = () => {
    if (sound) {
      setSound(null);
      sound.release();
    }
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={enablePanDownToClose}
      handleComponent={handleComponent}
      onChange={onChange}
      index={1}
      style={{
        backgroundColor: colors.playViewColor,
        shadowColor: colors.playViewColor,
      }}
      backgroundStyle={{
        backgroundColor: colors.playViewColor,
      }}
      animatedIndex={sharedValue}
    >
      <Animated.View style={[{ overflow: "hidden" }, animatedStyles]}>
        <Block flex={false} style={styles.containertwo}>
          <Image source={playListImage} style={styles.bottomImage} />
          <Block flex={false} style={styles.contentContainer}>
            <TouchableOpacity style={styles.playIconContainer}>
              <PlayGrayIcon />
            </TouchableOpacity>
            <Block
              flex={1}
              padding={[
                perfectSize(0),
                perfectSize(4),
                perfectSize(0),
                perfectSize(0),
              ]}
            >
              <Text
                regular
                color={colors.white}
                size={responsiveScale(14)}
                numberOfLines={1}
                allowFontScaling={false}
              >
                {playListLable}
              </Text>
              <Text regular color={"#a17580"} size={responsiveScale(12)}>
                {playListSubLable || "Meditation"}
              </Text>
            </Block>
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={() => closeIconOnPress()}
            >
              <CloseImg />
            </TouchableOpacity>
          </Block>
        </Block>
      </Animated.View>
      <ImageBackground
        source={require("../../assets/appImages/BottomSheetBG.png")}
        resizeMode="stretch"
        style={styles.bgImage}
      >
        <Block flex={1} style={styles.mainContainer}>
          <Block flex={false} row between style={styles.headerContainer}>
            <Block flex={false}>
              <TouchableOpacity onPress={handleDownArrowPress}>
                <DownArrow height={32} width={32} />
              </TouchableOpacity>
            </Block>
            <Block flex={false} row between style={styles.headerRight}>
              <TouchableOpacity onPress={handleAddPlaylistPress}>
                <AddPlaylistIcon height={24} width={24} />
              </TouchableOpacity>
              {!downloadAudioListData.some(
                (item) => item?.id === selectPlayListData?.id
              ) && (
                <TouchableOpacity onPress={() => downloadAudio()}>
                  <Clouddownloadaltsolid
                    height={24}
                    width={24}
                    style={styles.downloadIcon}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => onClickShareIcon()}
                style={styles.downloadIcon}
              >
                <ShareIcon height={24} width={24} />
              </TouchableOpacity>
            </Block>
          </Block>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: perfectSize(20) }}
          >
            <Block flex={false} center style={styles.imageContainer}>
              <Image
                source={playListImage}
                resizeMode="stretch"
                style={styles.imageBackground}
              />
            </Block>

            <Block flex={false} style={styles.audioInfoContainer}>
              <Block flex={false} row between>
                <Text
                  size={responsiveScale(14)}
                  regular
                  color={colors.white}
                  style={{ flex: 1 }}
                >
                  {playListLable ||
                    "Embracing the moment this is a long title here"}
                </Text>
                <Block flex={false} row>
                  {isPlaylistAdded && (
                    <TouchableOpacity>
                      <PlaylistAddedIcon height={24} width={24} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={{ marginLeft: perfectSize(10) }}
                    onPress={() => handleFavouriteOnPress(playListData?.id)}
                  >
                    <FavouriteIcon height={24} width={24} />
                  </TouchableOpacity>
                </Block>
              </Block>
              <Text
                size={responsiveScale(12)}
                regular
                color={colors.lightBorderColor}
                style={styles.subtitleText}
              >
                {playListData?.subtitle}
              </Text>
              <Text
                size={responsiveScale(12)}
                regular
                color={"#FFFFFFCC"}
                style={styles.description}
              >
                {playListSubLable ||
                  "Learn what it means to be turned into the mind and body. In this  audio file Eve, Rosie and Shula share their thoughts."}
              </Text>

              <Block flex={false} style={styles.divider} />

              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={audioDuration}
                value={sliderValue}
                minimumTrackTintColor={colors.white}
                maximumTrackTintColor={colors.lightGray}
                onSlidingComplete={handleSliderValueChange}
              />

              <Block flex={false} row between>
                <Text
                  size={responsiveScale(12)}
                  regular
                  color={colors.lightBorderColor}
                >
                  {new Date(sliderValue * 1000).toISOString().substr(11, 8)}
                </Text>
                <Text
                  size={responsiveScale(12)}
                  regular
                  color={colors.lightBorderColor}
                >
                  {new Date(audioDuration * 1000).toISOString().substr(11, 8)}{" "}
                </Text>
              </Block>

              <Block flex={false} row center style={styles.controlsContainer}>
                <TouchableOpacity
                  disabled={selectedAudioDetails?.previousAudioButtonDisabled}
                  onPress={() => skipToNextOrPrevious(true)}
                >
                  <Skipback
                    style={{
                      opacity: selectedAudioDetails?.previousAudioButtonDisabled
                        ? 0.5
                        : 1,
                    }}
                    height={24}
                    width={24}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => togglePlayPause()}
                  style={styles.playButton}
                >
                  {isPlaying ? (
                    <PauseGrayIcon height={50} width={50} />
                  ) : (
                    <PlayGrayIcon height={50} width={50} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={selectedAudioDetails?.nextAudioButtonDisabled}
                  onPress={() => skipToNextOrPrevious()}
                >
                  <Skipnext
                    style={{
                      opacity: selectedAudioDetails?.nextAudioButtonDisabled
                        ? 0.5
                        : 1,
                    }}
                    height={34}
                    width={34}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.resetButton}>
                  <ResetIcon height={24} width={24} />
                </TouchableOpacity>
              </Block>
            </Block>
          </ScrollView>
        </Block>

        <Modal
          transparent={true}
          visible={playlistModalVisible}
          animationType="slide"
          onRequestClose={handleClosePlaylistModal}
        >
          <TouchableWithoutFeedback onPress={handleClosePlaylistModal}>
            <Block flex={1} />
          </TouchableWithoutFeedback>
          <Block flex={1} style={styles.modalContainerPlaylist}>
            <Block flex={false} style={styles.modalContentPlaylist}>
              <Block flex={false} row style={styles.modalHeader}>
                <Text
                  color={colors.white}
                  center
                  size={responsiveScale(14)}
                  medium
                >
                  Saved to your Playlist
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
                    <Block flex={false} row center style={styles.playlistItem}>
                      <Block flex={false} style={styles.playlistIcon}>
                        {playlist.isNew ? (
                          <PlussolidIcon height={22} width={22} />
                        ) : (
                          <AddPlaylistIcon height={20} width={20} />
                        )}
                      </Block>
                      <Text
                        size={responsiveScale(12)}
                        medium
                        color={colors.white}
                        style={styles.playlistText}
                      >
                        {playlist.name}
                      </Text>
                      {!playlist.isNew && (
                        <TouchableOpacity
                          style={styles.radioButton}
                          onPress={() => handleSelectPlaylist(playlist.id)}
                        >
                          {selectedPlaylist === playlist.id && (
                            <Block
                              flex={false}
                              style={styles.radioButtonInner}
                            />
                          )}
                        </TouchableOpacity>
                      )}
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
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleClosePlaylistModal}
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
        </Modal>

        <Modal
          transparent={true}
          visible={newPlaylistModalVisible}
          animationType="slide"
          onRequestClose={handleCloseNewPlaylistModal}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={handleCloseNewPlaylistModal}>
              <Block flex={1} />
            </TouchableWithoutFeedback>
            <Block flex={1} style={styles.modalContainerPlaylist}>
              <Block flex={false} style={styles.modalContentPlaylist}>
                <Block flex={false} row style={styles.modalHeader}>
                  <Text
                    color={colors.white}
                    center
                    size={responsiveScale(14)}
                    medium
                  >
                    Create New Playlist
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
                    style={styles.inputtwo}
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
                    Confirm
                  </Text>
                </TouchableOpacity>
              </Block>
            </Block>
          </KeyboardAvoidingView>
        </Modal>
      </ImageBackground>
      <MusicFinishedModal
        visible={musicFinishedModalVisible}
        onClose={() => setMusicFinishedModalVisible(false)}
        nextModalVisible={nextModalVisible}
        handleClose={() => {
          handleCloseNextModal();
        }}
      />
    </BottomSheet>
  );
};

export default memo(CommonBottomSheet);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: perfectSize(16),
  },
  title: {
    marginTop: "22%",
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
  image: {
    height: perfectSize(120),
    width: perfectSize(174),
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
  input: {
    fontSize: responsiveScale(27),
    color: colors.white,
  },
  saveButton: {
    backgroundColor: colors.white,
    padding: perfectSize(10),
    borderRadius: perfectSize(8),
    alignItems: "center",
    marginVertical: perfectSize(10),
    alignSelf: "center",
    width: "90%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#393939E5",
    borderRadius: perfectSize(8),
    paddingVertical: perfectSize(10),
    borderWidth: perfectSize(1),
    borderColor: "#FFFFFF33",
    padding: perfectSize(20),
  },
  modalText: {
    marginBottom: perfectSize(10),
    marginTop: perfectSize(10),
  },
  deleteButton: {
    backgroundColor: colors.white,
    paddingVertical: perfectSize(10),
    borderRadius: perfectSize(8),
    alignItems: "center",
    marginVertical: perfectSize(10),
    width: "100%",
  },
  containertwo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.playViewColor,
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
  androidBlurBackground: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  mainContainer: {
    paddingHorizontal: perfectSize(20),
  },
  headerContainer: {
    marginTop: "20%",
  },
  headerRight: {
    paddingRight: perfectSize(10),
    justifyContent: "flex-end",
  },
  downloadIcon: {
    marginLeft: perfectSize(20),
  },
  imageContainer: {
    marginTop: 10,
  },
  imageBackground: {
    width: "100%",
    marginTop: perfectSize(10),
    overflow: "hidden",
    height: perfectSize(300),
  },
  audioInfoContainer: {
    backgroundColor: "#390111",
    padding: perfectSize(16),
    borderRadius: perfectSize(8),
    marginTop: perfectSize(30),
  },
  subtitleText: {
    marginTop: perfectSize(7),
  },
  description: {
    marginTop: perfectSize(10),
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
  },
  slider: {
    width: "100%",
    height: perfectSize(40),
    marginTop: perfectSize(5),
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
    width: 20,
    height: 20,
    borderRadius: 10,
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
    height: perfectSize(0.3),
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
  inputtwo: {
    height: perfectSize(43),
    paddingHorizontal: perfectSize(10),
    color: colors.white,
    fontSize: responsiveScale(13),
    fontWeight: "bold",
  },
});
