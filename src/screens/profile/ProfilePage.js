import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Text as TextView,
} from "react-native";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors, font } from "../../styles/theme";
import SettingIcon from "../../assets/appImages/svgImages/SettingIcon";
import Settings from "../settings/Settings";
import InvitePeopleIcon from "../../assets/appImages/svgImages/InvitePeopleIcon.svg";
import AddImageIcon from "../../assets/appImages/svgImages/AddImageIcon.svg";
import FavouriteIcon from "../../assets/appImages/svgImages/FavouriteIcon.svg";
import ProfileStarsIcon from "../../assets/appImages/svgImages/ProfileStarsIcon.svg";
import DownloadIcon from "../../assets/appImages/svgImages/DownloadIcon.svg";
import FreeAudios from "../../components/freeAudios/FreeAudios";
import { useDispatch, useSelector } from "react-redux";
import i18n from "../../translations/i18n";
import { getUserProfile } from "../../resources/baseServices/auth";
import { setUserProfile } from "../../store/user/user";
import { OneSignal } from "react-native-onesignal";
import ProfileSkeleton from "../../components/skeletonPlaceholder/ProfileSkeleton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocale } from "../../context/LocaleProvider";
import Loader from "../../components/loader/Loader";
import {
  ERROR_CONTACT_SUPPORT_MESSAGE,
  ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
} from "../../constants/errors";
import Whatsapp from "../../assets/appImages/svgImages/Whatsapp.svg";
import ImagePicker from "react-native-image-crop-picker";
import { getAuthToken } from "../../helpers/auth";
import API from "../../constants/baseApi";
import useVersionUpdateHandler from "../../hooks/useVersionUpdateHandler";
import { generateWhatsAppLink } from "../../utils/utils";
import { useModal } from "../../context/ModalContext";
import { useNetInfoInstance } from "@react-native-community/netinfo";
import { Backgrounds } from "../../data/background";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import NetworkModal from "../../components/modal/NetworkModal";
import { LandingLogo } from "../../icons/landing/landing-logo";

const ProfilePage = ({
  navigation,
  guestPassData,
  // favoriteData,
  // downloadData,
  activityHistorydata,
}) => {
  const { locale } = useLocale();
  const { currentVersion } = useVersionUpdateHandler();

  const downloadData = useSelector(
    (state) => state?.playlistsReducer?.downloadAudioListData
  );
  const user = useSelector((state) => state?.userReducer?.userProfile);
  const recentlyPlayedAudios = useSelector(
    (state) => state?.recentlyPlayedAudiosReducer?.recentlyPlayedAudios
  );

  const [photo, setPhoto] = useState(user?.profilePictureUrl || null);
  const handleFavoriteSeasonsSelection = () => {
    navigation.navigate("GettingOverplaylist", { showFavouriteIcon: true });
  };
  const handleDownloadDataSelection = () => {
    navigation.navigate("GettingOverplaylist", {
      showDownloadIcon: true,
      isFreeAudio: true,
      isDownloadedAudio: true,
    });
  };
  const handleactivityHistorydataSelection = () => {
    navigation.navigate("ActivityHistory");
  };
  const handleGuestPassData = () => {
    navigation.navigate("GuestPass");
  };
  const handleSetting = () => {
    navigation.navigate("Settings");
  };
  // Fetch favorite data from the Redux store
  const favourites = useSelector(
    (state) => state?.favouritesAudioReducer?.favourites
  );

  // Check if there are any favorite items
  const favoriteData = favourites?.length > 0;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { top } = useSafeAreaInsets();
  const modal = useModal();

  const handleUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getUserProfile();
      if (res?.status == 200) {
        OneSignal.login(res?.data?.id);
        dispatch(setUserProfile(res?.data));
      }
    } catch (error) {
      console.error("error handleUserProfile =--->", error);
      modal.show(ErrorDialog, {
        messageTitle:
          error?.response?.data?.errorTitle ??
          ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
        message:
          error?.response?.data?.errorBody ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    handleUserProfile();
  }, []);

  const handlePlaylistSelection = (
    item,
    isRecentlyPlayed = false,
    title = ""
  ) => {
    if (isRecentlyPlayed) {
      navigation.navigate("GettingOverplaylist", { isRecentlyPlayed });
      return;
    }
    // if (isUserSubscribed) {
    navigation.navigate("GettingOverplaylist", {
      item,
      isDeepSleep: title == "deep sleep" ? true : false,
    });
    // } else {
    //   setOpenSubscriptionModal(true);
    // }
  };

  const handleImageResponse = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      multiple: false,
      compressImageQuality: 0.5,
      mediaType: "photo",
    })
      .then(async (response) => {
        const filePath = response?.path;
        const myHeaders = new Headers();
        const token = await getAuthToken();
        myHeaders.append("Authorization", `Bearer ${token}`);
        const file = {
          uri:
            Platform.OS === "ios" ? filePath.replace("file://", "") : filePath,
          type: response?.mime,
          name: response?.filename,
        };
        let data = new FormData();
        data.append("file", file);
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: data,
          redirect: "follow",
        };

        fetch(API.UPDATE_USER_PROFILE, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            const resultData = JSON.parse(result);

            if (resultData?.status === "success") {
              setPhoto(resultData?.response?.url);
            } else {
            }
          })
          .catch((error) =>
            console.log(API.UPDATE_USER_PROFILE, "===error===", error)
          );
      })
      .catch((err) => {
        if (err?.message === "User did not grant library permission.") {
          Alert.alert(
            "Enable Album Access",
            "Open settings to grant permission and continue.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
            ],
            { cancelable: false }
          );
        } else {
          console.log("selectImage error", err);
        }
      });
  };

  const handleCaptureImageResponse = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: "photo",
      multiple: false,
      compressImageQuality: 0.5,
    })
      .then(async (response) => {
        const filePath = response?.path;
        const myHeaders = new Headers();
        const token = await getAuthToken();
        myHeaders.append("Authorization", `Bearer ${token}`);
        const file = {
          uri:
            Platform.OS === "ios" ? filePath.replace("file://", "") : filePath,
          type: response?.mime,
          name: response?.filename,
        };
        let data = new FormData();
        data.append("file", file);
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: data,
          redirect: "follow",
        };

        fetch(API.UPDATE_USER_PROFILE, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            const resultData = JSON.parse(result);
            if (resultData?.code === 200) {
              setPhoto(resultData?.response?.url);
            } else {
            }
          })
          .catch((error) =>
            console.log(API.UPDATE_USER_PROFILE, "===error===", error)
          );
      })
      .catch((err) => {
        if (err?.message === "User did not grant camera permission.") {
          Alert.alert(
            "Enable Camera Access",
            "Open settings to grant permission and continue.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
            ],
            { cancelable: false }
          );
        } else if (err?.message === "Cannot run camera on simulator") {
          Alert.alert("Cannot run camera on simulator");
        } else {
          console.log("handleCaptureImageResponse error", err?.message);
        }
      });
  };

  const selectImage = () => {
    Alert.alert(
      "Upload Photo",
      "Choose an option",
      [
        {
          text: "Choose from Library",
          onPress: () => handleImageResponse(),
        },
        {
          text: "Take Photo",
          onPress: () => handleCaptureImageResponse(),
        },
        // {
        //   text: "Cancel",
        //   style: "cancel",
        // },
      ],
      { cancelable: true }
    );
  };

  const [NetworkModalVisible, setNetworkModalvisible] = useState(true);
  const {
    netInfo: { type, isConnected },
    refresh,
  } = useNetInfoInstance();

  useFocusEffect(
    useCallback(() => {
      setNetworkModalvisible(true);
    }, [])
  );
  return (
    // isConnected?
    <Block flex={1}>
      {isLoading ? (
        // <Loader />
        <Block flex={1} style={{ paddingTop: top }}>
          <ProfileSkeleton />
        </Block>
      ) : (
        <Block flex={1}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <ImageBackground
            source={require("../../assets/appImages/ProfileBg.png")}
            resizeMode="stretch"
            style={[styles.bgImage, { paddingTop: top }]}
          >
            <Block flex={1}>
              {/* header View */}
              <Block
                flex={false}
                row
                between
                style={{
                  paddingRight: perfectSize(20),
                  paddingLeft: perfectSize(14),
                  justtifyContent: "space-between",
                  alignItems: "center",
                }}
                center
              >
                <View
                  style={{ height: 32, width: 32 }}
                  // onPress={() => navigation.goBack()}
                ></View>

                <Block
                  flex={false}
                  style={{
                    marginLeft: 12,
                  }}
                >
                  <LandingLogo
                    // color={colors.logoColor}
                    height={perfectSize(60)}
                    width={perfectSize(100)}
                  />
                </Block>
                <View style={{ height: 32, width: 32 }}></View>
              </Block>
              <Block flex={false} style={styles.headerContainer}>
                {/* <Block
                  flex={false}
                  center
                  style={{
                    alignSelf: "flex-end",
                  }}
                >
                  <TouchableOpacity onPress={() => handleSetting()}>
                    <SettingIcon height={48} width={48} />
                  </TouchableOpacity>
                </Block> */}
                <Block flex={false} row between center>
                  <Block flex={false}>
                    <Text
                      medium
                      size={responsiveScale(31)}
                      color={colors.white}
                    >
                      {/* Profile */}
                      {i18n.t("Profile")}
                    </Text>
                  </Block>
                </Block>
              </Block>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: perfectSize(30) }}
              >
                <Block flex={1} style={{ marginTop: perfectSize(10) }} center>
                  <Block flex={false}>
                    {!photo && (
                      <TouchableOpacity onPress={() => selectImage()}>
                        <AddImageIcon />
                      </TouchableOpacity>
                    )}
                    {photo && (
                      <TouchableOpacity onPress={() => selectImage()}>
                        <Image
                          source={{ uri: photo }}
                          style={{ height: 100, width: 100, borderRadius: 50 }}
                        />
                      </TouchableOpacity>
                    )}
                  </Block>
                  <Block
                    flex={false}
                    style={{ marginVertical: perfectSize(10) }}
                  >
                    <Text
                      medium
                      size={responsiveScale(20)}
                      color={colors.white}
                    >
                      {/* Enya James */}
                      {user?.fullName}
                      {/* Fallback to Enya James if fullName is not available */}
                      {/* {fullName} */}
                    </Text>
                  </Block>
                </Block>

                <Block
                  flex={false}
                  style={{
                    paddingHorizontal: perfectSize(16),
                    paddingVertical: perfectSize(16),
                  }}
                >
                  <Block flex={false}>
                    <Block
                      flex={false}
                      style={[
                        styles.profileCategoryImage,
                        styles.containerBgColor,
                      ]}
                    >
                      <Block flex={false}>
                        <Block
                          row
                          gap={scaleSize(2)}
                          style={{ alignItems: "center" }}
                        >
                          <Whatsapp width={30} height={30} />
                          <Text
                            size={scaleSize(16)}
                            color={colors.white}
                            style={{ fontWeight: "600" }}
                            bold
                          >
                            Whatsapp
                          </Text>
                        </Block>
                        <Block gap={10} row marginTop={scaleSize(7)}>
                          <TouchableOpacity
                            onPress={() => {
                              Linking.openURL(
                                generateWhatsAppLink({
                                  appVersion: currentVersion,
                                  email: user?.email,
                                  name: user?.fullName,
                                })
                              );
                            }}
                          >
                            <Text
                              size={scaleSize(16)}
                              color={colors.white}
                              regular
                            >
                              +44 730 142 6350
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              Linking.openURL(
                                generateWhatsAppLink({
                                  appVersion: currentVersion,
                                  email: user?.email,
                                  name: user?.fullName,
                                })
                              );
                            }}
                          >
                            <Text
                              size={scaleSize(16)}
                              color={colors.white}
                              regular
                            >
                              +44 744 288 0810
                            </Text>
                          </TouchableOpacity>
                        </Block>

                        <Text
                          regular
                          size={scaleSize(14)}
                          color={colors.white}
                          // center
                          style={{ marginVertical: perfectSize(10) }}
                        >
                          {i18n.t(
                            "If you have any questions, please write to us"
                          )}
                        </Text>
                      </Block>
                      <TouchableOpacity
                        style={{
                          marginTop: perfectSize(5),
                          backgroundColor: colors.darkRedText,
                          paddingVertical: perfectSize(11),
                          borderRadius: perfectSize(30),
                          justifyContent: "center",
                          alignItems:'center'
                        }}
                        onPress={() => navigation.navigate("Support")}
                      >
                        <Block flex={false}>
                          <Text
                            regular
                            size={responsiveScale(16)}
                            color={colors.white}
                          >
                            {i18n.t("Support")}
                          </Text>
                        </Block>
                      </TouchableOpacity>
                      {/* <Block center marginTop={scaleSize(5)}>
                        <Text
                          color={colors.white}
                          regular
                          size={responsiveScale(10)}
                        >
                          {`${i18n.t("Version")}: ${currentVersion}`}
                        </Text>
                      </Block> */}
                    </Block>
                  </Block>
                </Block>

                {/* Send free access to friends */}
                <Block
                  flex={false}
                  style={[
                    {
                      paddingHorizontal: perfectSize(16),
                      // paddingVertical: perfectSize(16),
                      marginHorizontal: perfectSize(16),
                      borderRadius: perfectSize(8),
                    },
                    styles.containerBgColor,
                  ]}
                >
                  {/* <ImageBackground
                    source={require("../../assets/appImages/SendFreeAccess.png")}
                    style={styles.profileCategoryImage}
                  > */}
                  <Block
                    flex={false}
                    // center
                    style={{
                      marginTop: perfectSize(10),
                      // paddingHorizontal: perfectSize(16),
                    }}
                  >
                    <Text
                      bold
                      size={scaleSize(16)}
                      color={colors.white}
                      // center
                      style={{
                        lineHeight: responsiveScale(28),
                      }}
                    >
                      {i18n.t("Bring friends along the journey")}
                    </Text>
                  </Block>
                  <TouchableOpacity
                    center
                    style={{
                      marginTop: perfectSize(10),
                      marginBottom: perfectSize(12),
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: colors.darkRedText,
                      paddingHorizontal: perfectSize(10),
                      paddingVertical: perfectSize(12),
                      borderRadius: perfectSize(50),
                    }}
                    onPress={() => handleGuestPassData()}
                  >
                    {/* <InvitePeopleIcon width={24} height={24} /> */}
                    <TextView
                      numberOfLines={2}
                      adjustsFontSizeToFit
                      style={{
                        width: "95%",
                        textAlign: "center",
                        fontFamily: font.regular,
                        fontSize: scaleSize(18),
                        color: colors.white,
                      }}
                    >
                      {i18n.t("Send free access to friends")}
                    </TextView>
                    {/* </Block> */}
                  </TouchableOpacity>
                  {/* </ImageBackground> */}
                </Block>

                {/* Setting section */}
                <Block
                  flex={1}
                  style={{
                    backgroundColor: colors.background,
                    marginTop: perfectSize(15),
                  }}
                >
                  <Settings />
                </Block>

                {/* <Block
                  flex={false}
                  style={{
                    marginTop: perfectSize(30),
                    paddingHorizontal: perfectSize(16),
                  }}
                >
                  <Block flex={false}>
                    {guestPassData ? (
                      // Invite & Refer Friends
                      <Text
                        regular
                        size={responsiveScale(16)}
                        color={colors.white}
                      >
                        {i18n.t("Invite & Refer Friends")}
                      </Text>
                    ) : (
                      // Zoul 30-Day Guest Pass
                      <Text
                        regular
                        size={responsiveScale(16)}
                        color={colors.white}
                      >
                        {i18n.t("Zoul 30-Day Guest Pass")}
                      </Text>
                    )}
                  </Block>
                  <Block
                    flex={false}
                    style={{
                      marginTop: perfectSize(14),
                      marginBottom: perfectSize(20),
                    }}
                  >
                    {guestPassData ? (
                      <Block
                        flex={false}
                        color={"#06020366"}
                        style={styles.profileCategoryImage}
                      >
                        <Block
                          flex={false}
                          center
                          style={{
                            marginTop: perfectSize(14),
                          }}
                        >
                          <Text
                            regular
                            size={responsiveScale(16)}
                            color={colors.white}
                            center
                          >
                            {i18n.t("Bring friends along the journey")}
                          </Text>
                        </Block>
                        <TouchableOpacity
                          center
                          style={{
                            marginTop: perfectSize(14),
                            alignSelf: "center",
                            backgroundColor: colors.white,
                            paddingHorizontal: "20%",
                            paddingVertical: perfectSize(14),
                            borderRadius: perfectSize(30),
                            flexDirection: "row",
                          }}
                        >
                          <InvitePeopleIcon />

                          <Block flex={false} style={{ marginLeft: 10 }}>
                            <Text
                              regular
                              size={responsiveScale(16)}
                              color={colors.black}
                              center
                            >
                              {i18n.t("Send Invite")}
                            </Text>
                          </Block>
                        </TouchableOpacity>
                      </Block>
                    ) : (
                      <ImageBackground
                        source={require("../../assets/appImages/ProfileCategory.png")}
                        style={styles.profileCategoryImage}
                      >
                        <Block
                          flex={false}
                          center
                          style={{
                            marginTop: perfectSize(14),
                          }}
                        >
                          <Text
                            regular
                            size={responsiveScale(16)}
                            color={colors.white}
                            center
                          >
                            {i18n.t("Bring friends along the journey")}
                          </Text>
                        </Block>
                        <TouchableOpacity
                          center
                          style={{
                            marginTop: perfectSize(14),
                            alignSelf: "center",
                            backgroundColor: colors.white,
                            paddingHorizontal: perfectSize(10),
                            paddingVertical: perfectSize(14),
                            borderRadius: perfectSize(50),
                            flexDirection: "row",
                            width: "88%",
                          }}
                          onPress={() => handleGuestPassData()}
                        >
                          <InvitePeopleIcon />

                          <Block flex={false} style={{ marginLeft: 10 }}>
                            <Text
                              regular
                              size={responsiveScale(16)}
                              color={colors.black}
                              center
                            >
                              {i18n.t("Send free access to friends")}
                            </Text>
                          </Block>
                        </TouchableOpacity>
                      </ImageBackground>
                    )}
                  </Block>
                </Block> */}

                {/* <Block
                  flex={false}
                  style={{
                    paddingHorizontal: perfectSize(16),
                  }}
                >
                  {favoriteData ? (
                    <FreeAudios
                      title={"Favorite Seasons"}
                      image={favourites[0]?.bannerImage}
                      extraplaylistContainerStyle={{ width: "100%" }}
                      extraTitleStyle={{ fontSize: responsiveScale(20) }}
                      extraDescriptionTextStyle={{
                        fontSize: responsiveScale(14),
                      }}
                      onPress={() => handleFavoriteSeasonsSelection()}
                    />
                  ) : (
                    <Block flex={false}>
                      <Block
                        flex={false}
                        row
                        between
                        style={{
                          marginBottom: perfectSize(15),
                          marginTop: perfectSize(20),
                        }}
                      >
                        <Block flex={false} row center>
                          <FavouriteIcon />
                          <Text
                            regular
                            size={responsiveScale(16)}
                            color={colors.white}
                            style={{ marginLeft: perfectSize(5) }}
                          >
                            {i18n.t("My Favorite")}
                          </Text>
                        </Block>
                        <Block flex={false}>
                          <Text
                            regular
                            size={responsiveScale(16)}
                            color={colors.lightPinkBorderColor}
                          >
                            {i18n.t("View All")}
                          </Text>
                        </Block>
                      </Block>
                      <Block
                        flex={false}
                        color={"#06020366"}
                        style={styles.profileCategoryImage}
                      >
                        <Block
                          flex={false}
                          center
                          style={{
                            marginTop: perfectSize(14),
                          }}
                        >
                          <Text
                            regular
                            size={responsiveScale(16)}
                            color={colors.white}
                            center
                            // width={"86%"}
                          >
                            {i18n.t("When you find an audio that you")}{" "}
                            {i18n.t("like, add it to your favorites")}
                          </Text>
                        </Block>
                        <TouchableOpacity
                          center
                          style={{
                            marginTop: perfectSize(14),
                            alignSelf: "center",
                            backgroundColor: colors.white,
                            paddingHorizontal: perfectSize(10),
                            paddingVertical: perfectSize(14),
                            borderRadius: perfectSize(30),
                            flexDirection: "row",
                          }}
                        >
                          <ProfileStarsIcon />

                          <Block flex={false} style={{ marginLeft: 10 }}>
                            <Text
                              regular
                              size={responsiveScale(16)}
                              color={colors.black}
                              center
                            >
                              {i18n.t("Listen to your first session")}
                            </Text>
                          </Block>
                        </TouchableOpacity>
                      </Block>
                    </Block>
                  )}
                </Block> */}

                {/* <Block
                  flex={false}
                  style={{
                    paddingHorizontal: perfectSize(16),
                  }}
                >
                  {downloadData?.length > 0 ? (
                    <FreeAudios
                      title={"Download History"}
                      image={
                        Platform.OS == "android"
                          ? `file://${downloadData[0]?.bannerImage}`
                          : downloadData[0]?.bannerImage
                      }
                      extraplaylistContainerStyle={{ width: "100%" }}
                      extraTitleStyle={{ fontSize: responsiveScale(20) }}
                      extraDescriptionTextStyle={{
                        fontSize: responsiveScale(14),
                      }}
                      onPress={() => handleDownloadDataSelection()}
                    />
                  ) : (
                    <>
                      <Block
                        flex={false}
                        row
                        between
                        style={{
                          marginTop: perfectSize(25),
                          marginBottom: perfectSize(15),
                        }}
                      >
                        <Block flex={false} row center>
                          <DownloadIcon />
                          <Block flex={false} width={"65%"}>
                            <Text
                              regular
                              size={responsiveScale(16)}
                              color={colors.white}
                              style={{
                                marginLeft: perfectSize(5),
                              }}
                            >
                              {i18n.t("Download")}/{i18n.t("Play Offline")}
                            </Text>
                          </Block>
                        </Block>
                        <Block flex={false}>
                          <Text
                            regular
                            size={responsiveScale(16)}
                            color={colors.lightPinkBorderColor}
                            style={{
                              textAlign: "right",
                            }}
                          >
                            {i18n.t("View All")}
                          </Text>
                        </Block>
                      </Block>
                      <Block
                        flex={false}
                        color={"#06020366"}
                        style={styles.profileCategoryImage}
                      >
                        <Block
                          flex={false}
                          center
                          style={{
                            marginTop: perfectSize(14),
                          }}
                        >
                          <Text
                            regular
                            size={responsiveScale(16)}
                            color={colors.white}
                            center
                          >
                            {i18n.t(
                              "Listen to your first audio to see your history appear here"
                            )}
                          </Text>
                        </Block>
                        <TouchableOpacity
                          center
                          style={{
                            marginTop: perfectSize(14),
                            alignSelf: "center",
                            backgroundColor: colors.white,
                            paddingHorizontal: perfectSize(10),
                            paddingVertical: perfectSize(14),
                            borderRadius: perfectSize(30),
                            flexDirection: "row",
                          }}
                          onPress={() => {
                            navigation.navigate("Home");
                          }}
                        >
                          <ProfileStarsIcon />

                          <Block flex={false} style={{ marginLeft: 10 }}>
                            <Text
                              regular
                              size={responsiveScale(16)}
                              color={colors.black}
                              center
                            >
                              {i18n.t("Listen to your first session")}
                            </Text>
                          </Block>
                        </TouchableOpacity>
                      </Block>
                    </>
                  )}
                </Block> */}

                {/* <Block
                  flex={false}
                  style={{
                    // marginTop: perfectSize(10),
                    paddingHorizontal: perfectSize(16),
                  }}
                > */}
                {/* {recentlyPlayedAudios?.length > 0 ? (
                    <FreeAudios
                      title={"Activity History"}
                      image={require("../../assets/appImages/MasterPlaylistImage.png")}
                      extraplaylistContainerStyle={{ width: "100%" }}
                      extraTitleStyle={{ fontSize: responsiveScale(20) }}
                      extraDescriptionTextStyle={{
                        fontSize: responsiveScale(14),
                      }}
                      onPress={() => handleactivityHistorydataSelection()}
                    />
                  ) : (
                    <>
                      <Block flex={false}>
                        <Block
                          flex={false}
                          row
                          center
                          style={{ marginTop: perfectSize(25) }}
                        >
                          <Text
                            regular
                            size={responsiveScale(16)}
                            color={colors.white}
                            style={{
                              marginBottom: perfectSize(20),
                            }}
                          >
                            {i18n.t("Activity History")}
                          </Text>
                        </Block>
                      </Block>

                      <Block
                        flex={false}
                        color={"#06020366"}
                        style={styles.profileCategoryImage}
                      >
                        <Block
                          flex={false}
                          center
                          style={{
                            marginTop: perfectSize(14),
                          }}
                        >
                          <Text
                            regular
                            size={responsiveScale(16)}
                            color={colors.white}
                            center
                          >
                            {i18n.t("Listen to your first audio to see")}
                            {"\n"}
                            {i18n.t("Your history appear here")}
                          </Text>
                        </Block>
                        <TouchableOpacity
                          center
                          style={{
                            marginTop: perfectSize(14),
                            alignSelf: "center",
                            backgroundColor: colors.white,
                            paddingHorizontal: perfectSize(10),
                            paddingVertical: perfectSize(14),
                            borderRadius: perfectSize(30),
                            flexDirection: "row",
                          }}
                          onPress={() => {
                            navigation.navigate("Home");
                          }}
                        >
                          <ProfileStarsIcon />

                          <Block flex={false} style={{ marginLeft: 10 }}>
                            <Text
                              regular
                              size={responsiveScale(16)}
                              color={colors.black}
                              center
                            >
                              {i18n.t("Listen to your first session")}
                            </Text>
                          </Block>
                        </TouchableOpacity>
                      </Block>
                    </>
                  )} */}
                {/* {recentlyPlayedAudios?.audios?.length > 0 ? (
                    <Block style={styles.recentlyPlayedContainer}>
                      <FreeAudios
                        title={i18n.t("Activity History")}
                        image={recentlyPlayedAudios?.audios[0]?.bannerImage}
                        description={""}
                        extraplaylistContainerStyle={{ width: "100%" }}
                        extraTitleStyle={{ fontSize: responsiveScale(24) }}
                        onPress={() =>
                          handlePlaylistSelection(
                            recentlyPlayedAudios?.audios[0],
                            true
                          )
                        }
                        numberOfLines={3}
                      />
                    </Block>
                  ) : (
                    <>
                      <Block flex={false}>
                        <Block
                          flex={false}
                          row
                          center
                          style={{ marginTop: perfectSize(25) }}
                        >
                          <Text
                            regular
                            size={responsiveScale(16)}
                            color={colors.white}
                            style={{
                              marginBottom: perfectSize(20),
                            }}
                          >
                            {i18n.t("Activity History")}
                          </Text>
                        </Block>
                      </Block>

                      <Block
                        flex={false}
                        color={"#06020366"}
                        style={styles.profileCategoryImage}
                      >
                        <Block
                          flex={false}
                          center
                          style={{
                            marginTop: perfectSize(14),
                          }}
                        >
                          <Text
                            regular
                            size={responsiveScale(16)}
                            color={colors.white}
                            center
                          >
                            {i18n.t("Listen to your first audio to see")}
                            {"\n"}
                            {i18n.t("Your history appear here")}
                          </Text>
                        </Block>
                        <TouchableOpacity
                          center
                          style={{
                            marginTop: perfectSize(14),
                            alignSelf: "center",
                            backgroundColor: colors.white,
                            paddingHorizontal: perfectSize(10),
                            paddingVertical: perfectSize(14),
                            borderRadius: perfectSize(30),
                            flexDirection: "row",
                          }}
                          onPress={() => {
                            navigation.navigate("Home");
                          }}
                        >
                          <ProfileStarsIcon />

                          <Block flex={false} style={{ marginLeft: 10 }}>
                            <Text
                              regular
                              size={responsiveScale(16)}
                              color={colors.black}
                              center
                            >
                              {i18n.t("Listen to your first session")}
                            </Text>
                          </Block>
                        </TouchableOpacity>
                      </Block>
                    </>
                  )} */}
                {/* </Block> */}
                <Block flex={false} height={perfectSize(80)} />
              </ScrollView>
            </Block>
          </ImageBackground>
        </Block>
      )}
      {/* <NetworkModal
        // isVisible={isConnected&&(!NetworkModalVisible)}
        isVisible={isConnected == false && NetworkModalVisible}
        refresh={refresh}
        onPress={() => {
          navigation.navigate("GettingOverplaylist", {
            showDownloadIcon: true,
          });
          setNetworkModalvisible(false);
        }}
      /> */}
    </Block>
    // :
    // (
    //       <View style={{ flex: 1 }}>
    //         <StatusBar
    //           translucent
    //           backgroundColor="#00000099"
    //           barStyle="light-content"
    //         />
    //         <ImageBackground
    //           source={require("../../assets/appImages/ExploreBackgroundImageWithIcon.png")}
    //           resizeMode="stretch"
    //           style={[styles.bgImage, { paddingTop: top }]}
    //         >
    //           <SafeAreaView style={{ flex: 1 }}>
    //             <ImageBackground
    //               style={{ height: "100%", width: "100%" }}
    //               source={Backgrounds.NoNetworkBg3}
    //             >
    //               <View
    //                 style={{
    //                   height: "100%",
    //                   width: "100%",
    //                   alignItems: "center",
    //                   justifyContent: "flex-end",
    //                   backgroundColor: "#00000099",
    //                 }}
    //               >
    //                 <View
    //                   style={{
    //                     height: 200,
    //                     width: "100%",
    //                     backgroundColor: "black",
    //                     alignItems: "flex-start",
    //                     justifyContent: "space-evenly",
    //                     borderTopLeftRadius: scaleSize(30),
    //                     borderTopRightRadius: scaleSize(30),
    //                     paddingHorizontal: scaleSize(20),
    //                     //  marginBottom:scaleSize(50),
    //                   }}
    //                 >
    //                   <Text color={"white"} bold size={scaleSize(20)}>
    //                     Connect to the internet{" "}
    //                   </Text>
    //                   <Text color={"white"} regular size={scaleSize(14)}>
    //                     You're offline. Check your connection{" "}
    //                   </Text>
    //                   <TouchableOpacity
    //                   onPress={()=>{refresh()}}
    //                     style={{
    //                       width: SCREEN_WIDTH * 0.8,
    //                       alignSelf: "center",
    //                       alignItems: "center",
    //                       justifyContent: "center",
    //                       borderRadius: scaleSize(25),
    //                       height: scaleSize(50),
    //                       backgroundColor: "white",
    //                     }}
    //                   >
    //                     <Text color={"black"} semibold size={scaleSize(16)}>
    //                       Retry
    //                     </Text>
    //                   </TouchableOpacity>
    //                 </View>
    //               </View>
    //             </ImageBackground>
    //           </SafeAreaView>
    //         </ImageBackground>
    //       </View>
    //     )
  );
};
export default ProfilePage;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    // height: deviceHeight * 1,
    // width: deviceWidth,
  },
  profileCategoryImage: {
    // flex: 1,
    // height: perfectSize(144),

    borderRadius: perfectSize(8),
    paddingVertical: perfectSize(15),
    paddingHorizontal: perfectSize(15),
    overflow: "hidden",
    // width: deviceWidth,
  },
  headerContainer: {
    paddingHorizontal: perfectSize(16),
    paddingBottom: perfectSize(10),
    paddingTop: perfectSize(10),
  },

  image: {
    height: perfectSize(140),
    width: perfectSize(231),
    borderRadius: 10,
  },

  absolute: {
    position: "absolute",
    top: perfectSize(0),
    left: perfectSize(0),
    bottom: perfectSize(0),
    right: perfectSize(0),
  },
  containerBgColor: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
});
