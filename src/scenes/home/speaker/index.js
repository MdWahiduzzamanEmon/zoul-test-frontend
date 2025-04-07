import { RTCView, mediaDevices } from "@videosdk.live/react-native-sdk";
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Clipboard,
} from "react-native";
import {
  Copy,
  MicOff,
  MicOn,
  VideoOff,
  VideoOn,
} from "../../../assets/videoSdk/icons";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-simple-toast";
import { createMeeting, getToken } from "../../../api/api";
import Button from "../../../components/videoSdk/Button";
import { SCREEN_NAMES } from "../../../utils/utils";
import colors from "../../../styles/videoSdk/colors";
import TextInputContainer from "../../../components/videoSdk/TextInputContainer";
import { useSelector } from "react-redux";
import {
  getLiveStreams,
  joinLiveStream,
} from "../../../resources/baseServices/app";
import { setLiveStreams } from "../../../store/liveStream";

export default function VS_Speaker_Home({ navigation, route }) {
  const [tracks, setTrack] = useState("");
  const [micOn, setMicon] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [name, setName] = useState("");
  const [meetingId, setMeetingId] = useState("");

  // const [token, setToken] = useState("");
  const liveStream = useSelector(
    (state) => state.liveStreamReducer.liveStreams
  );

  const user = useSelector((state) => state?.userReducer?.userProfile);
  const isCreator = user?.isLivestreamHost;
  const meetingData = route?.params?.meetingData;
  useEffect(() => {
    setMeetingId(route?.params?.meetingId || liveStream?.roomId);
  }, [route?.params?.meetingId, liveStream?.roomId]);

  useEffect(() => {
    setName(user?.fullName);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (mediaDevices && mediaDevices.getUserMedia) {
        mediaDevices
          ?.getUserMedia({ audio: false, video: true })
          ?.then((stream) => {
            setTrack(stream);
          })
          ?.catch((e) => {
            console.log(e);
          });
      }
    }, [])
  );

  const disposeVideoTrack = () => {
    setTrack((stream) => {
      stream?.getTracks?.()?.forEach((track) => {
        track.enabled = false;
        return track;
      });
    });
  };

  const naviagateToSpeaker = (token) => {
    disposeVideoTrack();
    navigation.replace(SCREEN_NAMES.VS_Meeting, {
      name: name.trim(),
      token: token,
      meetingId: meetingId,
      micEnabled: micOn,
      webcamEnabled: videoOn,
      mode: "CONFERENCE",
      isCreator,
    });
  };

  const getStreams = useCallback(async () => {
    return getLiveStreams()
      .then((res) => {
        dispatch(setLiveStreams(res.data.response));
        return res.data.response;
      })
      .catch((error) => {
        console.log("ERROR GETTING LIVE STREAMS", error);
      });
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        backgroundColor: colors.primary["900"],
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colors.primary["900"],
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              paddingTop: "15%",
              height: "45%",
            }}
          >
            <View
              style={{
                flex: 1,
                width: "50%",
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                {videoOn && tracks ? (
                  <RTCView
                    streamURL={tracks.toURL()}
                    objectFit={"cover"}
                    mirror={true}
                    style={{
                      flex: 1,
                      borderRadius: 20,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#202427",
                    }}
                  >
                    <Text style={{ color: colors.primary[100] }}>
                      Camera Off
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "transparent",
                  justifyContent: "space-evenly",
                  position: "absolute",
                  bottom: 10,
                  right: 0,
                  left: 0,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setMicon(!micOn);
                  }}
                  style={{
                    height: 50,
                    aspectRatio: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 100,
                    backgroundColor: micOn ? colors.primary["100"] : "red",
                  }}
                >
                  {micOn ? (
                    <MicOn width={25} height={25} fill={colors.black} />
                  ) : (
                    <MicOff
                      width={25}
                      height={25}
                      fill={colors.primary["100"]}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setVideoOn(!videoOn);
                  }}
                  style={{
                    height: 50,
                    aspectRatio: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 100,
                    backgroundColor: videoOn ? colors.primary["100"] : "red",
                  }}
                >
                  {videoOn ? (
                    <VideoOn width={25} height={25} fill={colors.black} />
                  ) : (
                    <VideoOff
                      width={35}
                      height={35}
                      fill={colors.primary["100"]}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ marginHorizontal: 32 }}>
            {isCreator ? (
              <>
                <View
                  style={{
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#202427",
                    borderRadius: 12,
                    marginVertical: 12,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Meeting Code : {meetingId}
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
                <TextInputContainer
                  placeholder={"Enter your name"}
                  value={name}
                  setValue={setName}
                />
                <Button
                  text={"Join"}
                  loading={isJoining}
                  onPress={() => {
                    setIsJoining(true);
                    joinLiveStream(meetingData?.id || liveStream?.id)
                      .then((res) => {
                        const response = res?.data?.response;
                        setIsJoining(false);
                        naviagateToSpeaker(response?.token);
                      })
                      .catch(async (error) => {
                        setIsJoining(false);
                        console.log("ERROR JOINING LIVE STREAM", error);
                        const streamData = await getStreams();
                        alert(
                          streamData?.id
                            ? "Something wen't wrong!"
                            : "Livestream isn't available right now."
                        );
                      });
                  }}
                />
              </>
            ) : (
              <>
                <TextInputContainer
                  placeholder={"Enter meeting code"}
                  value={meetingId}
                  disabled={true}
                  setValue={setMeetingId}
                />
                <TextInputContainer
                  placeholder={"Enter your name"}
                  value={name}
                  setValue={setName}
                />
                <Button
                  text={"Join"}
                  loading={isJoining}
                  onPress={() => {
                    setIsJoining(true);
                    joinLiveStream(liveStream?.id)
                      .then((res) => {
                        setIsJoining(false);
                        const response = res?.data?.response;
                        naviagateToSpeaker(response?.token);
                      })
                      .catch((error) => {
                        setIsJoining(false);
                        console.log("ERROR JOINING LIVE STREAM", error);
                        alert("Something wen't wrong!");
                      });
                  }}
                />
              </>
            )}
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
