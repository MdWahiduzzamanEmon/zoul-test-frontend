import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { consoleLog, perfectSize, responsiveScale } from "../../styles/mixins";
import { colors, deviceHeight, deviceWidth } from "../../styles/theme";
import DownArrow from "../../assets/appImages/svgImages/DownArrow";
import AddPlaylistIcon from "../../assets/appImages/svgImages/AddPlaylistIcon";
import Clouddownloadaltsolid from "../../assets/appImages/svgImages/Clouddownloadaltsolid";
import Share from "../../assets/appImages/svgImages/Share";
import Slider from "@react-native-community/slider";
import Sound from "react-native-sound";
import Skipback from "../../assets/appImages/svgImages/Skipback";
import PlayGrayIcon from "../../assets/appImages/svgImages/PlayGrayIcon";
import Skipnext from "../../assets/appImages/svgImages/Skipnext";
import FavouriteIcon from "../../assets/appImages/svgImages/FavouriteIcon";
import ResetIcon from "../../assets/appImages/svgImages/ResetIcon";
import PauseGrayIcon from "../../assets/appImages/svgImages/PauseGrayIcon";
import PlussolidIcon from "../../assets/appImages/svgImages/PlussolidIcon";
import CloseIcon from "../../assets/appImages/svgImages/CloseIcon";
import PenIcon from "../../assets/appImages/svgImages/PenIcon";
import PlaylistAddedIcon from "../../assets/appImages/svgImages/PlaylistAddedIcon";
import { useNavigation } from "@react-navigation/native";
import i18n from "../../translations/i18n";

const AudioFilePlaying = ({ route }) => {
  const navigation = useNavigation();
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [sliderValue, setSliderValue] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const { image, subtitle } = route.params;
  const [selectedPlaylist, setSelectedPlaylist] = useState(1);
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [newPlaylistModalVisible, setNewPlaylistModalVisible] = useState(false);
  const [newPlaylistText, setnewPlaylistText] = useState("");
  const [isPlaylistAdded, setIsPlaylistAdded] = useState(false);
  const [playlists, setPlaylists] = useState([
    { id: 1, name: "My Meditation" },
    { id: 2, name: "My Sleep" },
    { id: 3, name: "My Relaxation" },
    { id: 4, name: "New Playlist", isNew: true },
  ]);

  useEffect(() => {
    consoleLog("AudioFilePlaying", route.params);
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
      if (duration > 0) {
        setAudioDuration(duration);
      } else {
        console.log("Failed to get audio duration.");
      }
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

  const handleDownArrowPress = (item) => {
    if (route.params?.isFromInspiration) {
      navigation.navigate("MyPlaylistInspiration", {
        playlistItem: item,
        openBottomSheet: true,
      });
    } else {
      navigation.goBack();
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

  const handleSelectPlaylist = (id, isNew) => {
    setSelectedPlaylist(id);
    if (isNew) {
      setPlaylistModalVisible(false);
      setNewPlaylistModalVisible(true);
    }
  };

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
    const newPlaylist = {
      id: playlists.length + 1,
      name: newPlaylistText,
    };
    const updatedPlaylists = [...playlists];
    const newPlaylistIndex = updatedPlaylists.findIndex(
      (playlist) => playlist.isNew
    );
    updatedPlaylists.splice(newPlaylistIndex, 0, newPlaylist);
    setPlaylists(updatedPlaylists);
    setnewPlaylistText("");
    setNewPlaylistModalVisible(false);
    setPlaylistModalVisible(true);
    navigation.navigate("MySelection", { playlists: updatedPlaylists });
  };

  return (
    <Block flex={1}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ImageBackground
        source={require("../../assets/appImages/HomeBackgroundImage.png")}
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
              <TouchableOpacity>
                <Clouddownloadaltsolid
                  height={24}
                  width={24}
                  style={styles.downloadIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Share height={24} width={24} />
              </TouchableOpacity>
            </Block>
          </Block>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: perfectSize(20) }}
          >
            <Block flex={false} center style={styles.imageContainer}>
              <Image
                source={image}
                resizeMode="stretch"
                style={styles.imageBackground}
              />
            </Block>

            <Block flex={false} style={styles.audioInfoContainer}>
              <Block flex={false} row between>
                <Text size={responsiveScale(14)} regular color={colors.white}>
                  Embracing the moment this {"\n"} is a long title here
                </Text>
                <Block flex={false} row>
                  {isPlaylistAdded && (
                    <TouchableOpacity>
                      <PlaylistAddedIcon height={24} width={24} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={{ marginLeft: perfectSize(10) }}>
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
                {subtitle}
              </Text>
              <Text
                size={responsiveScale(12)}
                regular
                color={"#FFFFFFCC"}
                style={styles.description}
              >
                Learn what it means to be turned into the mind and body. In this
                audio file Eve, Rosie and Shula share their thoughts.
              </Text>

              <Block flex={false} style={styles.divider} />

              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={audioDuration}
                value={sliderValue}
                minimumTrackTintColor={colors.white}
                maximumTrackTintColor={colors.lightGray}
                onValueChange={handleSliderValueChange}
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
                <TouchableOpacity onPress={playSound}>
                  <Skipback height={24} width={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={isPlaying ? pauseSound : playSound}
                  style={styles.playButton}
                >
                  {isPlaying ? (
                    <PauseGrayIcon height={50} width={50} />
                  ) : (
                    <PlayGrayIcon height={50} width={50} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={playSound}>
                  <Skipnext height={34} width={34} />
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
          <Block flex={1} style={styles.modalContainer}>
            <Block flex={false} style={styles.modalContent}>
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
            <Block flex={1} style={styles.modalContainer}>
              <Block flex={false} style={styles.modalContent}>
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
                    Confirm
                  </Text>
                </TouchableOpacity>
              </Block>
            </Block>
          </KeyboardAvoidingView>
        </Modal>
      </ImageBackground>
    </Block>
  );
};

export default AudioFilePlaying;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    // height: deviceHeight,
    // width: deviceWidth,
  },
  mainContainer: {
    paddingHorizontal: perfectSize(20),
  },
  headerContainer: {
    marginTop: "17%",
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
  resetButton: {
    left: perfectSize(30),
    marginTop: perfectSize(3),
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
  input: {
    height: perfectSize(43),
    paddingHorizontal: perfectSize(10),
    color: colors.white,
    fontSize: responsiveScale(13),
    fontWeight: "bold",
  },
});
