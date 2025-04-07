import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { getToken } from "../../../api/api";
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

export default function VS_Viewer_Home({ navigation }) {
  const [name, setName] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [isJoinLoading, setIsJoinLoading] = useState(false);
  const user = useSelector((state) => state?.userReducer?.userProfile);

  const liveStream = useSelector(
    (state) => state.liveStreamReducer.liveStreams
  );

  useEffect(() => {
    setName(user?.fullName);
  }, []);

  const naviagateToViewer = (token) => {
    navigation.navigate(SCREEN_NAMES.VS_Meeting, {
      name,
      token,
      meetingId,
      mode: "VIEWER",
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

  useEffect(() => {
    if (liveStream?.id) {
      setMeetingId(liveStream?.roomId);
    }
  }, [liveStream, setMeetingId]);

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
            justifyContent: "center",
          }}
        >
          <View style={{ marginHorizontal: 32 }}>
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
              loading={isJoinLoading}
              onPress={() => {
                setIsJoinLoading(true);
                joinLiveStream(liveStream?.id)
                  .then((res) => {
                    const response = res?.data?.response;
                    setIsJoinLoading(false);
                    naviagateToViewer(response?.token);
                  })
                  .catch(async (error) => {
                    setIsJoinLoading(false);
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
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
