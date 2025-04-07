import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Pressable,
  Platform,
} from "react-native";
import { State } from "react-native-track-player";
import { usePlayer } from "../../modules/player";
import { useSmallPlayer } from "../../modules/player/SmallPlayerProvider";
import { useModal } from "../../context/ModalContext";
import { Gap } from "../layout/Gap";
import { MeditationSessionModal } from "../../modules/modals/MeditationSessionModal";
import { Marquee } from "./Margue";
import { Typography } from "./Typography";
import CloseImg from "../../assets/appImages/svgImages/CloseImg";
import PlayGrayIcon from "../../assets/appImages/svgImages/PlayGrayIcon.svg";
import PauseGrayIcon from "../../assets/appImages/svgImages/PauseGrayIcon.svg";
import { responsiveScale } from "../../styles/mixins";
import Text from "../utilities/Text";
import { colors } from "../../styles/theme";
import {
  convertToTrack,
  mapToTrackFlyweight,
} from "../../modules/player/utils";
import { useNetInfoInstance } from "@react-native-community/netinfo";
interface ISmallPlayer {
  isFromBottomTab?: boolean;
  track: any;
  playlist: any;
  isDownloadedAudio?: boolean;
  isFreeAudio?: boolean;
  isDefaultAudio?: boolean;
}

const SmallPlayer: React.FC<ISmallPlayer> = ({
  isFromBottomTab = false,
  track,
  playlist,
  isDownloadedAudio = false,
  isFreeAudio = false,
  isDefaultAudio = false,
}) => {
  const player = usePlayer();
  const smallPlayer = useSmallPlayer();

  const {
    netInfo: { type, isConnected },
    refresh,
  } = useNetInfoInstance();

  const onCloseModal = () => {
    player.reset();
    smallPlayer?.hideSmallPlayer();
  };

  useEffect(() => {
    const init = async () => {
      await player
        .setQueue(
          mapToTrackFlyweight(playlist),
          convertToTrack(track),
          false,
          isDefaultAudio
        )
        .then(() => {
          smallPlayer.openSmallPlayer();
          player.play();
        });
    };
    if (track) init();
    if (isConnected == false) {
      player.pause();
    }
  }, [track]);

  const modal = useModal();

  const img = player.activeTrack.coverFull
    ? {
        uri: player.activeTrack.coverFull.toLowerCase().startsWith("https://")
          ? player.activeTrack.coverFull
          : Platform.OS == "android"
          ? `file://${player.activeTrack.coverFull}`
          : player.activeTrack.coverFull,
      }
    : require("../../assets/appImages/Logo.png");

  if (smallPlayer?.isSmallPlayer) {
    return (
      <View
        style={[
          styles.absoluteContainer,
          { bottom: isFromBottomTab ? "10%" : 0 },
        ]}
      >
        <Pressable
          onPressIn={() => {
            smallPlayer.hideSmallPlayer();
            modal.show(MeditationSessionModal, {
              track: player.activeTrack,
              playlist: player.queue,
              maximize: true,
              isDownloadedAudio,
              isFreeAudio,
            });
          }}
        >
          <ImageBackground
            defaultSource={require("../../assets/appImages/BottomSheetBG.png")}
            source={require("../../assets/appImages/BottomSheetBG.png")}
            style={styles.miniPlayer}
          >
            <View style={{ width: "15%" }}>
              <Image
                source={img}
                style={[
                  styles.cover,
                  { height: responsiveScale(55), width: responsiveScale(55) },
                ]}
              />
            </View>
            <View
              style={{
                width: "15%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PlayButton />
            </View>
            <View style={{ width: "50%" }}>
              <Text
                size={responsiveScale(14)}
                color={colors.white}
                style={{
                  textShadowColor: "#000", // Shadow color
                  textShadowOffset: { width: 2, height: 2 }, // Shadow offset (horizontal and vertical)
                  textShadowRadius: 3,
                }}
              >
                {player.activeTrack.title}
              </Text>
            </View>
            <View style={{ width: "15%" }}>
              <Pressable
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                onPress={onCloseModal}
              >
                <CloseImg />
              </Pressable>
            </View>
            <Gap vertical={16} />
          </ImageBackground>
        </Pressable>
      </View>
    );
  } else {
    return null;
  }
};

const PlayButton = () => {
  const player = usePlayer();
  const isPlaying = player.state === State.Playing;

  const play = async () => {
    await player.play();
  };
  const pause = async () => {
    await player.pause();
  };
  return (
    <Pressable
      onPress={isPlaying ? pause : play}
      style={styles.playStopBtnWrapper}
      hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
    >
      {isPlaying ? <PauseGrayIcon /> : <PlayGrayIcon />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    height: responsiveScale(64),
    zIndex: 0,
  },
  miniPlayer: {
    height: "100%",
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  playStopBtnWrapper: {
    borderRadius: 48 / 2,
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    zIndex: 20,
  },
  cover: { height: 50, aspectRatio: 1 },
  textColumn: { flexDirection: "column", flex: 1 },
});

export default SmallPlayer;

export const SmallPlayerBottomSpace = () => {
  const smallPlayer = useSmallPlayer();
  if (smallPlayer?.isSmallPlayer) {
    return <Gap vertical={64} />;
  }
  return null;
};
