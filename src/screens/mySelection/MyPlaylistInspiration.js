import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Modal,
  Platform,
} from "react-native";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { colors } from "../../styles/theme";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import DeleteIcon from "../../assets/appImages/svgImages/DeleteIcon";
import SuggestedDailyPlan from "../../components/suggestedDailyPlan/SuggestedDailyPlan";
import BackIcon from "../../assets/appImages/svgImages/BackIcon";
import EditIcon from "../../assets/appImages/svgImages/EditIcon";
import RightIcon from "../../assets/appImages/svgImages/RightIcon";
import Sound from "react-native-sound";
import DraggableFlatList from "react-native-draggable-flatlist";
import {
  createuserplaylist,
  deleteuserplaylist,
  getSingleUserPlaylists,
  modifyAudioInPlayList,
  updateUserPlaylists,
} from "../../resources/baseServices/app";
import { useDispatch, useSelector } from "react-redux";
import { setOnePlayListsData } from "../../store/storeAppData/playlists";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MyPlaylistInspirationSkeleton from "../../components/skeletonPlaceholder/MyPlaylistInspirationSkeleton";
import SmallPlayer from "../../components/small-player/SmallPlayer";
import {
  formatTime,
  getTitleByLanguage,
  transformData,
} from "../../helpers/app";
import { useModal } from "../../context/ModalContext";
import { MeditationSessionModal } from "../../modules/modals/MeditationSessionModal";
import Loader from "../../components/loader/Loader";
import i18n from "../../translations/i18n";
import { LandingLogo } from "../../icons/landing/landing-logo";

const MyPlaylistInspiration = ({ navigation, route }) => {
  const selectedLanguage = useSelector(
    (state) => state?.language.selectedLanguage
  );
  const playlistItem = route.params.playlistItem;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(playlistItem.title);
  const titleInputRef = React.useRef(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [sliderValue, setSliderValue] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const { image, subtitle } = route.params;
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [newPlaylistModalVisible, setNewPlaylistModalVisible] = useState(false);
  const [newPlaylistText, setnewPlaylistText] = useState("");
  const [isPlaylistAdded, setIsPlaylistAdded] = useState(false);
  const [playlists, setPlaylists] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { top } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const userId = playlistItem?.userId; // Assuming you have the user ID in the playlistItem
  const [isSingleAudioDelete, setIsSingleAudioDelete] = useState(false);
  const [selectedAudioId, setSelectedAudioId] = useState(null);

  const fetchSingleUserPlaylist = async () => {
    try {
      setIsLoading(true);
      const response = await getSingleUserPlaylists(playlistItem?.id);
      if (response && response?.data) {
        setPlaylists(response?.data?.audios);
        dispatch(setOnePlayListsData(response?.data?.audios));
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      if (error?.response) {
        console.error(
          "Error fetching single playlist, response:",
          error?.response
        );
      } else if (error?.request) {
        console.error(
          "Error fetching single playlist, no response:",
          error?.request
        );
      } else {
        console.error(
          "Error setting up fetch playlist request:",
          error?.message
        );
      }
    } finally {
      setIsLoading(false); // Always set loading to false when done
      console.log("Done fetching playlist");
    }
  };
  useEffect(() => {
    fetchSingleUserPlaylist();
  }, [userId]);

  const handleEditPress = () => {
    setIsEditing(true);
    Keyboard.dismiss();
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  // const handleSaveTitle = () => {
  //   setIsEditing(false);
  // };

  const handleDeletePress = () => {
    setModalVisible(true);
  };
  const handleDeleteiteamPress = (item) => {
    const AudioID = item?.audioId || item?.id || item?.audio?.id;
    if (AudioID) {
      setSelectedAudioId(AudioID); // Set the selected audio ID for deletion
      setIsSingleAudioDelete(true); // Indicate that we're deleting a single audio
      setModalVisible(true); // Show the modal
    } else {
      console.error("AudioID is undefined in item:", item);
    }
  };
  const modal = useModal();
  const confirmDelete = async () => {
    try {
      if (isSingleAudioDelete && selectedAudioId) {
        // Handle single audio delete
        await handleRemoveAudioList(playlistItem?.id, selectedAudioId);
        setModalVisible(false);
      } else {
        // Handle full playlist delete
        const response = await deleteuserplaylist(playlistItem.id);
        if (response) {
          setModalVisible(false);
          navigation.goBack();
        } else {
          console.error("Failed to delete playlist");
        }
      }
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  const handleCancle = () => {
    setModalVisible(false);
  };

  const cancelDelete = () => {
    setModalVisible(false);
    setIsSingleAudioDelete(false); // Reset deletion state
    setSelectedAudioId(null); // Clear selected audio
  };

  const bottomSheetRef = useRef(null);
  const snapPoints = React.useMemo(() => ["9%", "100%"], []);

  const handleNavigate = (audioData, item) => {
    try {
      const outputArray = item?.map(({ audio }) => {
        const {
          id,
          order,
          tags,
          premium,
          bannerImage,
          authorName,
          excel_audio_id,
          ...rest
        } = audio;

        return transformData(audio);
      });
      const updateAudioData = transformData(audioData);
      modal.show(MeditationSessionModal, {
        track: updateAudioData,
        playlist: outputArray,
      });
    } catch (error) {
      console.error("Error navigating to audio:", error);
    }
  };

  useEffect(() => {
    const audioFilePath =
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3";

    const newSound = new Sound(audioFilePath, null, (error) => {
      if (error) {
        console.log("Failed to load sound", error);
        return;
      }
      console.log("Sound loaded successfully");
      setSound(newSound);
      const duration = newSound.getDuration();
      console.log("Audio Duration: ", duration);
    });

    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, []);

  const playSound = () => {
    if (sound) {
      sound.setVolume(volume);
      sound.play((success) => {
        if (success) {
          console.log("Finished playing");
        } else {
          console.log("Playback failed");
        }
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const pauseSound = () => {
    if (sound) {
      sound.pause(() => {
        console.log("Paused");
      });
      setIsPlaying(false);
    }
  };

  const handleSliderValueChange = (value) => {
    setSliderValue(value);
    if (sound) {
      sound.setCurrentTime(value);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isPlaying && sound) {
      interval = setInterval(() => {
        sound.getCurrentTime((seconds) => {
          setSliderValue(seconds);
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, sound]);

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

  const handleAddNewPlaylist = () => {
    setPlaylistModalVisible(false);
    setNewPlaylistModalVisible(true);
  };

  const handleDragEnd = ({ data }) => {
    try {
      setPlaylists(data);
      const audios = data.map((item, index) => {
        return {
          audio: item.audioId,
          sequence: item.sequence,
        };
      });
      updateUserPlaylists(playlistItem.id, {
        title,
        audios,
      })
        .then((response) => {
          console.log("response =--->", JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("Error updating playlist:", error);
        })
        .finally(() => {
          console.log("Playlist update process done");
        });
    } catch (error) {
      console.error("Error updating playlist:", error);
    }
  };

  const handleConfirmPress = async () => {
    if (!newPlaylistText) return;

    try {
      const data = {
        title: newPlaylistText,
      };

      const response = await createuserplaylist("", data);

      if (response && response?.data?.code == 200) {
        console.log("New playlist created successfully:", response?.data);
        // fetchAllUserPlaylists();
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

  const handleSaveTitle = async () => {
    if (!title.trim()) {
      console.error("Title cannot be empty.");
      return;
    }

    try {
      const data = {
        title: title.trim(),
      };
      const response = await updateUserPlaylists(playlistItem.id, data);

      if (response && response?.data?.code === 200) {
        console.log("Playlist title updated successfully:", response.data);
        setIsEditing(false);
        navigation.goBack();
      } else {
        console.error("Failed to update playlist title:", response);
      }
    } catch (error) {
      console.error("Error updating playlist title:", error);
    }
  };

  const handleRemoveAudioList = async (playListID, AudioID) => {
    if (!playListID || !AudioID) {
      console.error("Invalid playlist or audio selection", {
        playListID,
        AudioID,
      });

      console.error("Invalid playlist or audio selection");
      return;
    }
    try {
      const response = await modifyAudioInPlayList(playListID, AudioID, false);
      console.log("response======>", response);
      if (response?.data?.code === 200) {
        const removeAudio = playlists?.filter(
          (item) => item?.audioId !== AudioID
        );
        dispatch(setOnePlayListsData(removeAudio));
        setPlaylists(removeAudio);
        console.log("Audio remove to playlist successfully:", response.data);
      } else {
        console.error("Unexpected API response:", response);
      }
    } catch (error) {
      console.error("Error remove audio to playlist:", error);
    } finally {
      console.log("Remove to playlist process done");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Block flex={1}>
        {isLoading ? (
          // <Loader />
          <Block flex={1} style={{ paddingTop: top }}>
            <MyPlaylistInspirationSkeleton />
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
              <Block flex={1} style={styles.container}>
                <Block
                  flex={false}
                  row
                  between
                  center
                  style={{ alignItems: "flex-end" }}
                >
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon height={32} width={32} />
                  </TouchableOpacity>
                  <LandingLogo
                    color={colors.logoColor}
                    height={perfectSize(60)}
                    width={perfectSize(100)}
                  />
                  <TouchableOpacity onPress={handleDeletePress}>
                    <DeleteIcon height={24} width={24} />
                  </TouchableOpacity>
                </Block>
                <Block
                  flex={false}
                  row
                  between
                  center
                  style={{ marginTop: "6%" }}
                >
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      ref={titleInputRef}
                      cursorColor={colors.logoColor}
                      value={title}
                      onChangeText={(text) => setTitle(text)}
                      autoFocus={true}
                      onSubmitEditing={handleSaveTitle}
                      selectionColor={colors.white}
                    />
                  ) : (
                    <Text size={scaleSize(32)} color={colors.white} medium>
                      {title}
                    </Text>
                  )}
                  <TouchableOpacity
                    onPress={isEditing ? handleSaveTitle : handleEditPress}
                  >
                    {isEditing ? (
                      <RightIcon height={24} width={24} />
                    ) : (
                      <EditIcon height={24} width={24} />
                    )}
                  </TouchableOpacity>
                </Block>
                {/* <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              contentContainerStyle={{
                paddingBottom: "10%",
              }}
            > */}

                <Block style={{ flex: 1, marginTop: perfectSize(10) }}>
                  {playlists?.length > 0 && (
                    <DraggableFlatList
                      data={playlists}
                      nestedScrollEnabled={true}
                      keyExtractor={(item, index) => index.toString()}
                      onDragEnd={handleDragEnd}
                      renderItem={({ item, drag, isActive }) => {
                        if (!item?.audio) {
                          return null;
                        }
                        const updateItem = transformData(item?.audio);

                        return (
                          <SuggestedDailyPlan
                            title={updateItem?.title}
                            duration={formatTime(updateItem?.duration * 1000)}
                            image={updateItem?.bannerImage}
                            subtitle={updateItem?.description}
                            handleonPress={() =>
                              handleNavigate(item?.audio, playlists)
                            }
                            extraimagestyle={{
                              height: perfectSize(80),
                              width: perfectSize(80),
                              borderRadius: perfectSize(6),
                            }}
                            showMenuIcon={true}
                            isEditing={isEditing}
                            Icon={
                              isEditing
                                ? require("../../assets/appImages/DeleteIcon.png")
                                : require("../../assets/appImages/MenuIcon.png")
                            }
                            onpress={() =>
                              isEditing
                                ? handleDeleteiteamPress(item?.audio)
                                : handleEditPress()
                            }
                            onLongPress={drag}
                            isActive={isActive}
                          />
                        );
                      }}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.listContent}
                      ListFooterComponent={() => {
                        return <Block flex={false} height={perfectSize(80)} />;
                      }}
                    />
                  )}
                </Block>
                {/* </ScrollView> */}
              </Block>
              {isEditing && (
                <Block flex={false} style={{ backgroundColor: "#393939E5" }}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveTitle}
                  >
                    <Text color={colors.logoColor} medium size={scaleSize(18)}>
                      {i18n.t("Save Changes")}
                    </Text>
                  </TouchableOpacity>
                </Block>
              )}
              <SmallPlayer />
            </ImageBackground>
          </Block>
        )}
      </Block>

      {/* <Modal transparent visible={isModalVisible} onRequestClose={cancelDelete}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={handleCancle}
        >
          <Block flex={false} style={styles.modalContent}>
            <Text
              size={responsiveScale(18)}
              color={colors.white}
              style={styles.modalText}
              regular
            >
              Are you sure you want to delete this playlist?
            </Text>
            <TouchableOpacity
              onPress={confirmDelete}
              style={styles.deleteButton}
            >
              <Text size={responsiveScale(16)} color={colors.black}>
                Delete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCancle}
              style={[
                styles.deleteButton,
                {
                  backgroundColor: "#FFFFFF33",
                  marginVertical: perfectSize(1),
                  marginBottom: perfectSize(10),
                },
              ]}
            >
              <Text size={responsiveScale(16)} color={colors.white}>
                Cancel
              </Text>
            </TouchableOpacity>
          </Block>
        </TouchableOpacity>
      </Modal> */}
      <Modal transparent visible={isModalVisible} onRequestClose={cancelDelete}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={cancelDelete}
        >
          <Block flex={false} style={styles.modalContent}>
            <Text
              size={responsiveScale(18)}
              color={colors.white}
              style={styles.modalText}
              regular
            >
              {isSingleAudioDelete
                ? "Are you sure you want to delete this audio from the playlist?"
                : "Are you sure you want to delete this playlist?"}
            </Text>
            <TouchableOpacity
              onPress={confirmDelete}
              style={styles.deleteButton}
            >
              <Text size={responsiveScale(16)} color={colors.black}>
                {i18n.t("Delete")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={cancelDelete}
              style={[
                styles.deleteButton,
                {
                  backgroundColor: "#FFFFFF33",
                  marginVertical: perfectSize(1),
                  marginBottom: perfectSize(10),
                },
              ]}
            >
              <Text size={responsiveScale(16)} color={colors.white}>
                {i18n.t("Cancel")}
              </Text>
            </TouchableOpacity>
          </Block>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default MyPlaylistInspiration;

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
  bgImage: {
    flex: 1,
    // height: deviceHeight,
    // width: deviceWidth,
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
    marginHorizontal: perfectSize(20),
  },
  imageContainer: {
    marginTop: 10,
  },
  imageBackground: {
    width: "100%",
    marginTop: perfectSize(10),
    overflow: "hidden",
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
  playlistItem: {
    marginTop: perfectSize(12),
  },
  dividertwo: {
    width: "100%",
    height: perfectSize(0.3),
    marginTop: perfectSize(10),
    alignSelf: "center",
    paddingHorizontal: perfectSize(20),
  },
});
