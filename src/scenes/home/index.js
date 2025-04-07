import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, View, Text } from "react-native";
import Button from "../../components/videoSdk/Button";
import { SCREEN_NAMES } from "../../utils/utils";
import colors from "../../styles/videoSdk/colors";
import MultiSelectDropdown from "../../components/multiSelectDropdown/MultiSelectDropdown";
import {
  createLiveStream,
  getLiveStreams,
  getUsers,
} from "../../resources/baseServices/app";
import { setLiveStreams } from "../../store/liveStream";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, setSpeakersMeta } from "../../store/allUsers";

export default function VS_Home({ navigation }) {
  const [selectedSpeakers, setSelectedSpeakers] = useState([]);
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch();

  const speakersMeta = useSelector(
    (state) => state.allUsersReducer.speakersMeta
  );
  const getUsersApi = useCallback(
    (offset) => {
      const payload = { limit: 20, role: "customer" };
      if (offset) {
        payload.offset = speakersMeta?.currentPage + 1;
      }
      if (inputValue) {
        payload.name = inputValue;
      } else {
        delete payload.name;
      }
      getUsers(payload)
        .then((res) => {
          const response = res?.data;
          dispatch(setUsers(response));
          dispatch(
            setSpeakersMeta({
              count: response?.count,
              totalPages: response?.totalPages,
              currentPage: response?.currentPage,
            })
          );
          setIsLoadingUsers(false);
        })
        .catch((error) => {
          setIsLoadingUsers(false);
          console.log("ERROR WHILE GETTING USERS", error);
        });
    },
    [inputValue, speakersMeta?.currentPage]
  );

  useEffect(() => {
    getUsersApi();
  }, [getUsersApi]);

  const allUsers = useSelector((state) => state.allUsersReducer.users);

  const fetchMoreUsers = async () => {
    await getUsersApi(allUsers?.length / 20);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.primary["900"],
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <MultiSelectDropdown
          isLoading={isLoadingUsers}
          fetchMoreUsers={fetchMoreUsers}
          selectedSpeakers={selectedSpeakers}
          setSelectedSpeakers={setSelectedSpeakers}
          setInputValue={setInputValue}
          inputValue={inputValue}
        />
        <View style={{ backgroundColor: "white" }}>
          <Button
            text={"Create a meeting"}
            loading={isCreatingMeeting}
            style={{ marginHorizontal: 16 }}
            onPress={() => {
              setIsCreatingMeeting(true);
              createLiveStream({
                speakers: selectedSpeakers?.length
                  ? selectedSpeakers?.map((item) => item.id)
                  : [],
              })
                .then((res) => {
                  const response = res?.data?.response;
                  getLiveStreams()
                    .then((res) => {
                      setIsCreatingMeeting(false);
                    })
                    .catch((error) => {
                      setIsCreatingMeeting(false);
                      console.log("ERROR GETTING LIVE STREAMS", error);
                    });
                  dispatch(setLiveStreams(res.data.response));
                  navigation.replace(SCREEN_NAMES.VS_Speaker_Home, {
                    meetingId: response?.roomId,
                    meetingData: response,
                  });
                })
                .catch((error) => {
                  console.log("ERROR IN CREATING LIVE STREAM", error);
                });
            }}
          />
        </View>
        {/* <View
          style={{
            alignSelf: "center",
            flexDirection: "row",
            marginVertical: 16,
          }}
        >
          <Text
            style={{
              color: "#202427",
              fontWeight: "bold",
            }}
          >
            ──────────
          </Text>
          <Text
            style={{
              color: "#ffff",
              fontWeight: "bold",
              marginHorizontal: 6,
            }}
          >
            OR
          </Text>
          <Text
            style={{
              color: "#202427",
              fontWeight: "bold",
            }}
          >
            ──────────
          </Text>
        </View>
        <Button
          text={"Join as a speaker"}
          onPress={() => {
            navigation.navigate(SCREEN_NAMES.VS_Speaker_Home, {
              isCreator: false,
            });
          }}
        />
        <Button
          text={"Join as a viewer"}
          onPress={() => {
            navigation.navigate(SCREEN_NAMES.VS_Viewer_Home, {});
          }}
        /> */}
      </View>
    </SafeAreaView>
  );
}
