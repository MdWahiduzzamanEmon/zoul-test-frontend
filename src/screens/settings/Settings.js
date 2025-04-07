import React, { useCallback, useState } from "react";
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors, font } from "../../styles/theme";
import BackIcon from "../../assets/appImages/svgImages/BackIcon";
import GuestPassIcon from "../../assets/appImages/svgImages/GuestPassIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import { removeAuthTokenAction, setLogoutFlag } from "../../store/auth";
import { clearAsyncStorage } from "../../helpers/auth";
import { setIntroVideoVisibility } from "../../store/introvideo";
import { getUserProfile } from "../../resources/baseServices/auth";
import { setUserProfile } from "../../store/user/user";
import { useModal } from "../../context/ModalContext";
import { ErrorDialog } from "../../components/modal/Modal";
import { useFocusEffect } from "@react-navigation/native";
import {
  fetchReminders,
  getLiveStreams,
} from "../../resources/baseServices/app";
import { fetchUserReminders } from "../../store/settings/setting";
import { envConfig } from "../../config/config";
import { useInAppBrowser } from "../../helpers/in-app-browser";
import { useNavigation } from "@react-navigation/native";
const PRIVACY_POLICY_URL = envConfig.PRIVACY_POLICY_URL;
const AFFILIATE_PROGRAM_URL = envConfig.AFFILIATE_PROGRAM_URL;
import i18n from "../../translations/i18n";
import SubscriptionModal from "../../components/subscriptionModal/SubscriptionModal";
import {
  setIsUserSubscribed,
  setSubscribedUser,
} from "../../store/storeAppData/actions/subscriptionAction";
import {
  ERROR_CONTACT_SUPPORT_MESSAGE,
  ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
} from "../../constants/errors";
import { deleteLocalDataFile } from "../../helpers/app";
import { usePlayer } from "../../modules/player";
import { useSmallPlayer } from "../../modules/player/SmallPlayerProvider";
import CongratulationsIcon from "../../assets/appImages/svgImages/CongratulationsIcon.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  SCREEN_NAMES,
  testimonialSlides,
  whoWeAreSlides,
  zoulIntroSlides,
} from "../../utils/utils";
import { setLiveStreams } from "../../store/liveStream";
import { YEARLY, YEARLY_PROMO } from "../../constants/InAppPurchase";
import CongratsModal from "../../components/subscriptionModal/CongratulationsModal";
import { Backgrounds } from "../../data/background";

const Settings = () => {
  const navigation = useNavigation();
  const modal = useModal();
  const dispatch = useDispatch();
  const { handleInAppBrowser } = useInAppBrowser();
  const { top } = useSafeAreaInsets();
  const player = usePlayer();
  const smallPlayer = useSmallPlayer();

  const [isModalVisible, setModalVisible] = useState(false);
  const [openSubscriptionModal, setOpenSubscriptionModal] = useState(false);

  const settingsOptions = [
    i18n.t("Reminders"),
    i18n.t("Personal Info"),
    i18n.t("Language"),
    // "Testimonial",
    i18n.t("What Users Say"),
    i18n.t("30-Day Guest Pass"),
    i18n.t("About Us"),
    i18n.t("Zoul Affiliate Program"),
    i18n.t("Join Live Streaming"),
    i18n.t("Who we are"),
    i18n.t("Downloads"),
    i18n.t("Subscription Details"),
    // i18n.t("Password & Security"),
    i18n.t("Support"),
    i18n.t("Terms & Conditions"),
    i18n.t("Privacy Policy"),
    i18n.t("Sign Up"),
    i18n.t("Logout"),
  ];

  const user = useSelector((state) => state?.userReducer?.userProfile);

  const reminders = useSelector(
    (state) => state?.settingReducer?.userReminders
  );

  const selectedDropdownLanguage = useSelector(
    (state) => state.language.selectedLanguage
  );
  const isUserSubscribed = useSelector(
    (state) => state?.subscription?.isUserSubscribed
  );

  const handleUserProfile = useCallback(async () => {
    try {
      const res = await getUserProfile();
      if (res?.status == 200) {
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
    }
  }, []);

  const fetchAllReminders = useCallback(async () => {
    try {
      const res = await fetchReminders();
      if (res?.data) {
        const { reminders } = res?.data;
        const reminderList = Object.keys(reminders).map((key) => ({
          payloadTitle: key,
          time: reminders[key].time,
          toggle: reminders[key].enabled,
        }));
        dispatch(fetchUserReminders(reminderList));
      }
    } catch (error) {
      console.error("error fetching reminders =--->", error);
      modal.show(ErrorDialog, {
        message:
          error?.response?.data?.message ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      handleUserProfile();
    }, [handleUserProfile])
  );

  useFocusEffect(
    useCallback(() => {
      fetchAllReminders();
    }, [fetchAllReminders])
  );

  const liveStreams = useSelector(
    (state) => state.liveStreamReducer.liveStreams
  );

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

  const handleLiveStream = async () => {
    const isHost = user?.isLivestreamHost;
    const isSpeaker = liveStreams?.isSpeaker;
    const streamData = await getStreams();
    if (!isHost && !streamData?.id) {
      alert("Livestream isn't available right now.");
    } else if ((isHost && !streamData?.id) || streamData?.status === "ended") {
      return navigation.navigate(SCREEN_NAMES.VS_Home);
    } else if (isSpeaker || isHost) {
      return navigation.navigate(SCREEN_NAMES.VS_Speaker_Home);
    } else {
      return navigation.navigate(SCREEN_NAMES.VS_Viewer_Home, {});
    }
  };

  const handlePress = (item) => {
    switch (item) {
      case i18n.t("Zoul Affiliate Program"):
        return handleInAppBrowser(AFFILIATE_PROGRAM_URL);
      case i18n.t("Join Live Streaming"):
        return handleLiveStream();
      case i18n.t("30-Day Guest Pass"):
        return navigation.navigate("GuestPass");
      case i18n.t("Personal Info"):
        const firstName = user?.fullName?.split?.(" ")[0] ?? "";
        const lastName = user?.fullName?.split?.(" ")[1] ?? "";
        return navigation.navigate("Personalinfo", {
          firstName,
          lastName,
          updatedEmail: user?.email,
          gender: user?.gender,
          birthDate: user?.birthDate,
        });
      case i18n.t("Password & Security"):
        return navigation.navigate("PersonalInfoeditScreen", {
          title: i18n.t("Password & Security"),
          data: "User-Password",
          label: "Link your social accounts",
          fromPasswordSecurity: true,
        });
      case i18n.t("Language"):
        return navigation.navigate("ChooseLanguage", {
          isSetting: true,
          language: selectedDropdownLanguage?.toUpperCase(),
        });
      case i18n.t("Reminders"):
        return navigation.navigate("Reminder", {
          isSetting: true,
          reminders: reminders,
        });
      case i18n.t("Downloads"):
        if (!isUserSubscribed) {
          return setOpenSubscriptionModal(true);
        }
        return navigation.navigate("GettingOverplaylist", {
          showDownloadIcon: true,
        });
      case i18n.t("About Us"):
        return navigation.navigate("Testimonial", {
          separatedSlides: zoulIntroSlides,
        });
      case i18n.t("Support"):
        return navigation.navigate("Support");
      case i18n.t("Terms & Conditions"):
        return navigation.navigate("TermsAndConditions");
      case i18n.t("Privacy Policy"):
        return handleInAppBrowser(PRIVACY_POLICY_URL);
      case i18n.t("Logout"):
        return setModalVisible(true);
      case i18n.t("Subscription Details"):
        if (!isUserSubscribed) {
          return setOpenSubscriptionModal(true);
        }
        return navigation.navigate("Subscription_details");
      case i18n.t("What Users Say"):
        return navigation.navigate("Testimonial", {
          separatedSlides: testimonialSlides,
        });
      case i18n.t("Who we are"):
        return navigation.navigate("Testimonial", {
          separatedSlides: whoWeAreSlides,
        });
      //sign up
      case i18n.t("Sign Up"):
        return navigation.navigate("Register");
    }
  };

  const renderItem = ({ item, index }) => (
    <>
      <TouchableOpacity onPress={() => handlePress(item)}>
        <Block flex={false}>
          <Text
            style={{
              fontFamily: font.light,
            }}
            // size={responsiveScale(18)}
            size={responsiveScale(16)}
            color={colors.white}
          >
            {item}
          </Text>
        </Block>
      </TouchableOpacity>
      {index !== settingsOptions.length - 1 && (
        <Block flex={false} style={styles.divider} />
      )}
    </>
  );

  const cancelDelete = () => {
    setModalVisible(false);
  };

  const handleCancle = () => {
    setModalVisible(false);
  };

  const confirmDelete = async () => {
    console.log("Logged Out");
    player?.reset();
    smallPlayer?.hideSmallPlayer();
    await deleteLocalDataFile();
    dispatch(setIntroVideoVisibility(false));
    dispatch(setLogoutFlag(true));
    setModalVisible(false);
    await clearAsyncStorage();
    dispatch(setUserProfile(null));
    dispatch(removeAuthTokenAction());
    dispatch(setIsUserSubscribed(false));
    dispatch(setSubscribedUser(null));
    AsyncStorage.removeItem("launchCount");
    AsyncStorage.removeItem("hasSubmittedReview");
    navigation.goBack();
  };

  const generateSettingOptions = (options) => {
    if (user?.providers?.length > 0) {
      const filteredOptions = options.filter(
        (option) => option !== i18n.t("Password & Security")
      );
      return filteredOptions;
    }
    return options;
  };

  return (
    <Block flex={1}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      {/* <ImageBackground
        source={require("../../assets/appImages/SettingScreenBg.png")}
        resizeMode="stretch"
        style={styles.bgImage}
      > */}
      <Block
        flex={1}
        style={{ paddingTop: top / 3, paddingHorizontal: perfectSize(20) }}
      >
        {/* <Block flex={false} style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <BackIcon height={32} width={32} />
            </TouchableOpacity>
            <Block flex={false}>
              <GuestPassIcon height={52} width={39} />
            </Block>
          </Block> */}
        <Block flex={1}>
          {/* <Text medium size={responsiveScale(24)} color={colors.white}>
            {i18n.t("Settings")}
          </Text> */}
          <FlatList
            data={generateSettingOptions(settingsOptions)}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            // contentContainerStyle={{
            //   marginTop: perfectSize(13),
            // }}
          />
        </Block>
      </Block>
      {/* </ImageBackground> */}

      <Modal transparent visible={isModalVisible} onRequestClose={cancelDelete}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={handleCancle}
        >
          <Block flex={false} style={styles.modalContent}>
            <ImageBackground
              source={Backgrounds.resetPasswordModalV2}
              resizeMode="stretch"
              style={{
                padding: perfectSize(20),
                paddingVertical: perfectSize(10),
              }}
            >
              <Text
                size={responsiveScale(18)}
                color={colors.logoColor}
                style={styles.modalText}
                regular
                center
              >
                {/* Are you sure you want to logout? */}
                {i18n.t("Are you sure you want to logout?")}
              </Text>
              <TouchableOpacity
                onPress={confirmDelete}
                style={styles.deleteButton}
              >
                <Text size={responsiveScale(16)} color={colors.black}>
                  {/* Yes */}
                  {i18n.t("Yes")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancle}
                style={[
                  styles.deleteButton,
                  {
                    backgroundColor: colors.darkRedText,
                    marginVertical: perfectSize(1),
                    marginBottom: perfectSize(10),
                  },
                ]}
              >
                <Text size={responsiveScale(16)} color={colors.white}>
                  {/* No */}
                  {i18n.t("No")}
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          </Block>
        </TouchableOpacity>
      </Modal>
      {openSubscriptionModal && (
        <SubscriptionModal
          isVisible={openSubscriptionModal}
          hideModal={() => setOpenSubscriptionModal(false)}
          onSubscribedUser={(plan) => {
            setOpenSubscriptionModal(false);
            setTimeout(() => {
              modal.show(CongratsModal, {
                message:
                  plan == YEARLY || plan == YEARLY_PROMO
                    ? i18n.t("Year Plan Update")
                    : i18n.t("Month Plan Update"),
                btnTitle: "Ok",
              });
            }, 1000);
          }}
        />
      )}
    </Block>
  );
};

export default Settings;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  headerContainer: {
    marginTop: scaleSize(16),
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: "100%",
    marginVertical: scaleSize(6),
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
    // paddingVertical: perfectSize(10),
    borderWidth: perfectSize(1),
    borderColor: "#FFFFFF33",
    // padding: perfectSize(20),
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
  modalBackground: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: perfectSize(20),
  },
  bgImagemodel: { height: perfectSize(290), width: "100%" },
  modalView: {
    padding: perfectSize(20),
  },
  confettiContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: perfectSize(20),
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
