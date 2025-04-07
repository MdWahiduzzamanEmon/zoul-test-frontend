import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  Clipboard,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { useMeeting, usePubSub } from "@videosdk.live/react-native-sdk";
import {
  CallEnd,
  Chat,
  Copy,
  EndForAll,
  Leave,
  MicOff,
  MicOn,
  Participants,
  Recording,
  ScreenShare,
  VideoOff,
  CameraSwitch,
  VideoOn,
} from "../../../assets/videoSdk/icons";
import colors from "../../../styles/videoSdk/colors";
import IconContainer from "../../../components/videoSdk/IconContainer";
import Menu from "../../../components/videoSdk/Menu";
import BottomSheet from "../../../components/videoSdk/BottomSheet";
import ParticipantView from "./ParticipantView";
import RemoteParticipantPresenter from "./RemoteParticipantPresenter";
import Toast from "react-native-simple-toast";
import ParticipantListViewer from "../Components/ParticipantListViewer";
import ChatViewer from "../Components/ChatViewer";
import LocalParticipantPresenter from "../Components/LocalParticipantPresenter";
import MenuItem from "../Components/MenuItem";
const MemoizedParticipant = React.memo(
  ParticipantView,
  ({ participantId }, { participantId: oldParticipantId }) =>
    participantId === oldParticipantId
);
import { MemoizedParticipantGrid } from "./ParticipantGrid";
// import ChatViewer from "../Components/ChatViewer";
import { convertRFValue } from "../../../styles/videoSdk/spacing";
import Blink from "../../../components/videoSdk/Blink";
import { useOrientation } from "../../../utils/useOrientation";
import { useDispatch, useSelector } from "react-redux";
import { endLiveStream } from "../../../resources/baseServices/app";
import { setLiveStreams } from "../../../store/liveStream";
import Orientation from "react-native-orientation-locker";

export default function MeetingViewer({ setlocalParticipantMode }) {
  const {
    localParticipant,
    participants,
    pinnedParticipants,
    localWebcamOn,
    localMicOn,
    leave,
    changeWebcam,
    end,
    toggleWebcam,
    toggleMic,
    presenterId,
    localScreenShareOn,
    toggleScreenShare,
    meetingId,
    activeSpeakerId,
    changeMode,
    hlsState,
    startHls,
    stopHls,
    enableScreenShare,
    disableScreenShare,
  } = useMeeting({
    onError: (data) => {
      const { code, message } = data;
      Toast.show(`Error: ${code}: ${message}`);
    },
  });

  const liveStream = useSelector(
    (state) => state.liveStreamReducer.liveStreams
  );

  const user = useSelector((state) => state?.userReducer?.userProfile);
  const isCreator = user?.isLivestreamHost;
  const leaveMenu = useRef();
  const bottomSheetRef = useRef();
  const cameraDeviceMenuRef = useRef();
  const hlsRef = useRef();
  const recordRef = useRef();
  const orientation = useOrientation();
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  const [bottomSheetView, setBottomSheetView] = useState("");
  const [screenRecording, setScreenRecording] = useState(false);
  const dispatch = useDispatch();
  const participantIds = useMemo(() => {
    const pinnedParticipantId = [...pinnedParticipants.keys()].filter(
      (participantId) => {
        return participantId != localParticipant?.id;
      }
    );
    // const regularParticipantIds = [...participants.keys()].filter(
    //   participantId => {
    //     return (
    //       ![...pinnedParticipants.keys()].includes(participantId) &&
    //       localParticipant?.id != participantId
    //     );
    //   },
    // );
    const ids = [
      localParticipant?.id,
      ...pinnedParticipantId,
      // ...regularParticipantIds,
    ].slice(0, presenterId ? 2 : 6);

    if (activeSpeakerId) {
      if (!ids.includes(activeSpeakerId)) {
        ids[ids.length - 1] = activeSpeakerId;
      }
    }
    return ids;
  }, [
    participants,
    activeSpeakerId,
    pinnedParticipants,
    presenterId,
    localScreenShareOn,
  ]);

  const meeting = useMeeting();

  useEffect(() => {
    global.allowLandscape = true;

    Orientation.getDeviceOrientation((deviceOrientation) => {
      Orientation.unlockAllOrientations();
    });

    return () => {
      global.allowLandscape = false;
      Orientation.getDeviceOrientation((deviceOrientation) => {
        Orientation.lockToPortrait();
      });
    };
  }, []);

  useEffect(() => {
    if (hlsRef.current) {
      if (hlsState === "HLS_STARTING" || hlsState === "HLS_STOPPING") {
        hlsRef.current.start();
      } else {
        hlsRef.current.stop();
      }
    }
  }, [hlsState]);
  useEffect(() => {
    if (recordRef.current) {
      if (screenRecording) {
        recordRef.current.start();
      } else {
        recordRef.current.stop();
      }
    }
  }, [screenRecording]);

  usePubSub("RAISE_HAND", {
    onMessageReceived: (data) => {
      const { senderName } = data;
      Toast.show(`${senderName} raised hand 🖐🏼`);
    },
  });

  // useEffect(() => {
  //   if (Platform.OS == "ios") {
  //     VideosdkRPK.addListener("onScreenShare", (event) => {
  //       if (event === "START_BROADCAST") {
  //         enableScreenShare();
  //       } else if (event === "STOP_BROADCAST") {
  //         disableScreenShare();
  //       }
  //     });

  //     return () => {
  //       VideosdkRPK.removeAllListeners("onScreenShare");
  //     };
  //   }
  // }, []);

  const _handleHLS = () => {
    if (!hlsState || hlsState === "HLS_STOPPED") {
      startHls({
        layout: {
          type: "SPOTLIGHT",
          priority: "PIN",
        },
        theme: "DARK",
        orientation: "landscape",
        quality: "high",
      });
    } else if (hlsState === "HLS_PLAYABLE") {
      stopHls();
    }
  };

  usePubSub(`CHANGE_MODE_${localParticipant?.id}`, {
    onMessageReceived: (data) => {
      const { message } = data;
      if (message.mode === "VIEWER") {
        changeMode("VIEWER");
        setlocalParticipantMode("VIEWER");
      }
    },
  });

  useEffect(() => {
    if (hlsRef.current) {
      if (hlsState === "HLS_STARTING" || hlsState === "HLS_STOPPING") {
        hlsRef.current.start();
      } else {
        hlsRef.current.stop();
      }
    }
  }, [hlsState]);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          marginTop: 24,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.primary[100],
              }}
            >
              {meetingId ? meetingId : "xxx - xxx - xxx"}
            </Text>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                marginLeft: 10,
              }}
              onPress={() => {
                Clipboard.setString(meetingId);
                Toast.show("Meeting Id copied Successfully");
              }}
            >
              <Copy fill={colors.primary[100]} width={18} height={18} />
            </TouchableOpacity>
          </View>
        </View>
        {isCreator ? (
          <View style={{ flexDirection: "row" }}>
            {hlsState === "HLS_STARTED" ||
            hlsState === "HLS_STOPPING" ||
            hlsState === "HLS_PLAYABLE" ||
            hlsState === "HLS_STARTING" ? (
              <Blink ref={hlsRef} duration={500}>
                <TouchableOpacity
                  onPress={() => {
                    _handleHLS();
                  }}
                  activeOpacity={1}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: 8,
                    padding: 10,
                    borderRadius: 8,
                    borderWidth: 1.5,
                    backgroundColor: "#FF5D5D",
                  }}
                >
                  <Text
                    style={{
                      fontSize: convertRFValue(12),
                      color: colors.primary[100],
                    }}
                  >
                    {hlsState === "HLS_STARTED"
                      ? "Live Starting"
                      : hlsState === "HLS_STOPPING"
                      ? "Live Stopping"
                      : hlsState === "HLS_STARTING"
                      ? "Live Starting"
                      : hlsState === "HLS_PLAYABLE"
                      ? "Stop Live"
                      : null}
                  </Text>
                </TouchableOpacity>
              </Blink>
            ) : isCreator ? (
              <TouchableOpacity
                onPress={() => {
                  _handleHLS();
                }}
                activeOpacity={1}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 8,
                  padding: 8,
                  borderRadius: 8,
                  borderWidth: 1.5,
                  borderColor: "#2B3034",
                }}
              >
                <Text
                  style={{
                    fontSize: convertRFValue(12),
                    color: colors.primary[100],
                  }}
                >
                  Go Live
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={() => {
                setBottomSheetView("PARTICIPANT_LIST");
                bottomSheetRef.current.show();
              }}
              activeOpacity={1}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginHorizontal: 8,
                width: 60,
                borderRadius: 8,
                borderWidth: 1.5,
                borderColor: "#2B3034",
              }}
            >
              <Participants height={20} width={20} fill={colors.primary[100]} />
              <Text
                style={{
                  fontSize: convertRFValue(12),
                  color: colors.primary[100],
                  marginLeft: 4,
                }}
              >
                {participants ? [...participants.keys()].length : 1}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      {/* Center */}
      <View
        style={{
          flex: 1,
          flexDirection: orientation == "PORTRAIT" ? "column" : "row",
          marginVertical: 12,
        }}
      >
        {presenterId && !localScreenShareOn ? (
          <RemoteParticipantPresenter presenterId={presenterId} />
        ) : presenterId && localScreenShareOn ? (
          <LocalParticipantPresenter />
        ) : null}

        <MemoizedParticipantGrid
          participantIds={participantIds}
          isPresenting={presenterId != null}
          isFrontCamera={isFrontCamera}
        />
      </View>
      <Menu
        ref={leaveMenu}
        menuBackgroundColor={colors.primary[700]}
        placement="left"
      >
        <MenuItem
          title={"Leave"}
          description={"Only you will leave the call"}
          icon={<Leave width={22} height={22} />}
          onPress={() => {
            leave();
          }}
        />
        <View
          style={{
            height: 1,
            backgroundColor: colors.primary["600"],
          }}
        />
        {isCreator ? (
          <MenuItem
            title={"End"}
            description={"End call for all participants"}
            icon={<EndForAll />}
            onPress={() => {
              endLiveStream(liveStream?.id)
                .then((res) => {
                  const response = res?.data?.response;
                  dispatch(setLiveStreams(response));
                  end();
                })
                .catch((error) => {
                  console.log("ERROR WHILE ENDING LIVE STREAM", error);
                });
            }}
          />
        ) : null}
      </Menu>
      <Menu
        ref={cameraDeviceMenuRef}
        menuBackgroundColor={colors.primary[700]}
        placement="left"
        left={150}
        bottom={70}
      >
        <MenuItem
          title={"Rotate Camera"}
          description={`Switch to ${isFrontCamera ? "back" : "front"} camera`}
          icon={<CameraSwitch width={22} height={22} fill="white" />}
          onPress={() => {
            setIsFrontCamera((prevState) => !prevState);
            changeWebcam();
            cameraDeviceMenuRef.current?.close();
          }}
        />
        <MenuItem
          title={`Camera ${localWebcamOn ? "off" : "on"}`}
          description={`Turn ${localWebcamOn ? "off" : "on"} the camera`}
          icon={
            localWebcamOn ? (
              <VideoOff width={22} height={22} fill="white" />
            ) : (
              <VideoOn width={22} height={22} fill="white" />
            )
          }
          onPress={() => {
            toggleWebcam();
            cameraDeviceMenuRef.current?.close();
          }}
        />
      </Menu>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <IconContainer
          backgroundColor={"red"}
          Icon={() => {
            return <CallEnd height={26} width={26} fill="#FFF" />;
          }}
          onPress={() => {
            leaveMenu.current.show();
          }}
        />
        <IconContainer
          style={{
            borderWidth: 1.5,
            borderColor: "#2B3034",
          }}
          backgroundColor={!localMicOn ? colors.primary[100] : "transparent"}
          onPress={() => {
            toggleMic();
          }}
          Icon={() => {
            return localMicOn ? (
              <MicOn height={24} width={24} fill="#FFF" />
            ) : (
              <MicOff height={28} width={28} fill="#1D2939" />
            );
          }}
        />
        <IconContainer
          style={{
            borderWidth: 1.5,
            borderColor: "#2B3034",
          }}
          backgroundColor={!localWebcamOn ? colors.primary[100] : "transparent"}
          onPress={() => {
            cameraDeviceMenuRef.current?.show();
          }}
          Icon={() => {
            return localWebcamOn ? (
              <VideoOn height={24} width={24} fill="#FFF" />
            ) : (
              <VideoOff height={36} width={36} fill="#1D2939" />
            );
          }}
        />
        <IconContainer
          onPress={() => {
            setBottomSheetView("CHAT");
            bottomSheetRef.current.show();
          }}
          style={{
            borderWidth: 1.5,
            borderColor: "#2B3034",
          }}
          Icon={() => {
            return <Chat height={22} width={22} fill="#FFF" />;
          }}
        />
        {/* {isCreator ? (
          <IconContainer
            style={{
              borderWidth: 1.5,
              borderColor: "#2B3034",
            }}
            onPress={() => {
              if (presenterId == null || localScreenShareOn) {
                if (Platform.OS === "android") {
                  toggleScreenShare();
                } else {
                  // VideosdkRPK.startBroadcast();
                }
              }
            }}
            Icon={() => {
              return <ScreenShare height={22} width={22} fill="#FFF" />;
            }}
          />
        ) : null} */}
        {isCreator ? (
          <Blink ref={recordRef} duration={500}>
            <IconContainer
              style={{
                borderWidth: 1.5,
                borderColor: "#2B3034",
              }}
              onPress={async () => {
                try {
                  if (screenRecording) {
                    await meeting.stopRecording();
                  } else {
                    await meeting.startRecording();
                  }
                  setScreenRecording((prev) => {
                    return !prev;
                  });
                } catch (error) {
                  console.log({ error });
                }
              }}
              Icon={() => {
                return (
                  <Recording
                    height={22}
                    width={22}
                    fill={screenRecording ? "green" : "#FFF"}
                  />
                );
              }}
            />
          </Blink>
        ) : null}
      </View>
      <BottomSheet
        sheetBackgroundColor={"#2B3034"}
        draggable={false}
        radius={12}
        hasDraggableIcon
        closeFunction={() => {
          setBottomSheetView("");
        }}
        ref={bottomSheetRef}
        height={Dimensions.get("window").height * 0.5}
      >
        {bottomSheetView === "CHAT" ? (
          <ChatViewer raiseHandVisible={false} />
        ) : bottomSheetView === "PARTICIPANT_LIST" ? (
          <ParticipantListViewer
            participantIds={[...participants.keys()]}
            isCreator={isCreator}
          />
        ) : null}
      </BottomSheet>
    </>
  );
}
