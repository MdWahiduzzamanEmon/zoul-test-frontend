import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import {
  MeetingProvider,
  MeetingConsumer,
  createCameraVideoTrack,
} from "@videosdk.live/react-native-sdk";

import ILSContainer from "./ILSContainer";
import { SCREEN_NAMES } from "../../utils/utils";
import colors from "../../styles/videoSdk/colors";
import { useSelector } from "react-redux";

export default function VS_Meeting({ navigation, route }) {
  const token = route.params.token;
  const meetingId = route.params.meetingId;
  const micEnabled = route.params.micEnabled
    ? route.params.webcamEnabled
    : false;
  const webcamEnabled = route.params.webcamEnabled
    ? route.params.webcamEnabled
    : false;
  const name = route.params.name ? route.params.name : "Test User";
  const mode = route.params.mode ? route.params.mode : "CONFERENCE";
  const user = useSelector((state) => state?.userReducer?.userProfile);
  const isCreator = user?.isLivestreamHost;

  const getTrack = async () => {
    const track = await createCameraVideoTrack({
      optimizationMode: "motion",
      encoderConfig: "h720p_w960p",
      facingMode: "user",
    });
    setCustomTrack(track);
  };

  let [customTrack, setCustomTrack] = useState();
  useEffect(() => {
    getTrack();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.primary[900], padding: 12 }}
    >
      <MeetingProvider
        config={{
          isCreator,
          meetingId,
          micEnabled: micEnabled,
          webcamEnabled: webcamEnabled,
          customCameraVideoTrack: customTrack,
          name,
          mode, // "CONFERENCE" || "VIEWER"
          notification: {
            title: "Video SDK Meeting",
            message: "Meeting is running.",
          },
        }}
        token={token}
      >
        <MeetingConsumer
          {...{
            onMeetingLeft: () => {
              // navigation.navigate(SCREEN_NAMES.VS_Home);
              navigation.goBack();
            },
          }}
        >
          {() => {
            return (
              <ILSContainer
                webcamEnabled={webcamEnabled}
                isCreator={isCreator}
              />
            );
          }}
        </MeetingConsumer>
      </MeetingProvider>
    </SafeAreaView>
  );
}
