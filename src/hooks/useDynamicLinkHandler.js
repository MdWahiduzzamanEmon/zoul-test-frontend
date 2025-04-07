// useDynamicLinkHandler.ts
import { useCallback, useEffect, useState } from "react";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import {
  getHoroscopeToday,
  getSingleAudio,
  applyPromoCode,
  applyRedeemableCode,
  fetchReminders, // Import the function to handle promo codes
} from "../resources/baseServices/app";
import { getLocalizedContent } from "../helpers/audioGoalLocalization";
import { useDispatch, useSelector } from "react-redux";
import { formatDateISO } from "../constants/languages";
import { persistHoroscopeData } from "../store/storeAppData/dailyWisdom";
import { useModal } from "../context/ModalContext";
import { ErrorDialog } from "../components/modal/Modal";
import CongratsModal from "../components/subscriptionModal/CongratulationsModal";
import { ERROR_CONTACT_SUPPORT_MESSAGE } from "../constants/errors";
import {
  audioDeepLink,
  horoscopeDeepLink,
  promoCodeDetails as setPromoCodeDetails,
  setAudioLinkDetail,
  setIsDailyWisdom,
} from "../store/audio-category/audioLink";
import { setIsUserSubscribed } from "../store/storeAppData/actions/subscriptionAction";
import { setDeeplinkUsed, setIntroVideoVisibility } from "../store/introvideo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuthToken, setAuthToken, setRefreshToken } from "../helpers/auth";
import {
  getUserProfile,
  loginRequestByZoulCheckOutToken,
} from "../resources/baseServices/auth";
import { setAuthTokenAction, setLanguage, setLogoutFlag } from "../store/auth";

const useDynamicLinkHandler = ({ isFromHome = false, navigationRef }) => {
  const [isZoulCheckOutTokenInvalid, setIsZoulCheckOutTokenInvalid] =
    useState(false);

  const selectedLanguage = useSelector(
    (state) => state?.language.selectedLanguage
  );
  const user = useSelector((state) => state?.userReducer?.userProfile);
  const isUserDetails = useSelector((state) => state?.userReducer?.userProfile);
  const isUserSubscribed = useSelector(
    (state) => state?.subscription?.isUserSubscribed
  );

  const audioDeeplink = useSelector(
    (state) => state?.audioLinkReducer?.audioDeeplink
  );
  const isHoroscopeDeeplink = useSelector(
    (state) => state?.audioLinkReducer?.isHoroscopeDeeplink
  );

  const isDeeplinkUsed = useSelector(
    (state) => state.introvideo.isDeeplinkUsed
  );
  const modal = useModal();
  const dispatch = useDispatch();

  const [audioData, setAudioData] = useState(null);
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [promoCodeData, setPromoCodeData] = useState(null); // Add state for promo code data
  const [isVerifiedPromo, setIsVerifiedPromo] = useState(null);
  const [isPromoRedeemable, setIsPromoRedeemable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navigator, setNavigator] = useState(null);

  // fetch audio data
  const fetchAudioData = async (audioID, language) => {
    try {
      getSingleAudio(audioID)
        .then((res) => {
          const updateData = getLocalizedContent(
            res?.data,
            language?.toUpperCase() || "EN"
          );
          dispatch(setAudioLinkDetail(updateData));
          setAudioData(updateData);
          dispatch(audioDeepLink(null));
        })
        .catch((error) => {
          console.error("error getSingleAudio =--->", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching audio data:", error);
      setLoading(false);
    }
  };

  // fetch horoscope data
  const fetchHoroscopeData = async () => {
    try {
      setLoading(true);
      const horoscopeRes = await getHoroscopeToday(formatDateISO(new Date()));
      dispatch(persistHoroscopeData(horoscopeRes.data[0][user?.zodiacSign]));
      setHoroscopeData(horoscopeRes.data[0][user?.zodiacSign]);
      dispatch(horoscopeDeepLink(false));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching horoscope data:", error);
      setLoading(false);
    }
  };

  const isHoroscopeData = async (isHoroscope) => {
    try {
      const currentRoute =
        navigationRef?.current?.getState()?.routes[
          navigationRef?.current?.getState()?.index
        ].name;
      if (currentRoute !== "Explore") {
        navigationRef?.current?.navigate("TabNavigator", {
          screen: "Explore",
        });
      }
    } catch (error) {
      console.error("error isHoroscopeData =--->", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIsDailyWisdom = async (isDailyWisdom) => {
    try {
      const currentRoute =
        navigationRef?.current?.getState()?.routes[
          navigationRef?.current?.getState()?.index
        ].name;
      if (currentRoute !== "Explore") {
        navigationRef?.current?.navigate("TabNavigator", {
          screen: "Explore",
        });
      }
      dispatch(setIsDailyWisdom(isDailyWisdom));
    } catch (error) {
      console.error("error fetchIsDailyWisdom =--->", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserProfile = useCallback(async () => {
    try {
      const res = await getUserProfile(true);
      if (res?.status == 200) {
        return res?.data;
      }
    } catch (error) {
      modal.show(ErrorDialog, {
        message:
          error?.response?.data?.message ?? ERROR_CONTACT_SUPPORT_MESSAGE,
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
        return reminderList;
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

  const handleZoulCheckOutToken = async (token) => {
    // CHECK IF USER IS ALREADY LOGGED IN
    const authToken = await getAuthToken();

    // IF USER IS NOT LOGGED IN
    if (!authToken) {
      try {
        const response = await loginRequestByZoulCheckOutToken({ token });
        const data = response?.data;

        if (data?.status === "success") {
          dispatch(setIntroVideoVisibility(false));
          await setAuthToken(data?.response?.accessToken);
          await setRefreshToken(data?.response?.refreshToken);
          dispatch(setLogoutFlag(false));
          const user = await handleUserProfile();

          dispatch(setLanguage(user?.preferred_language?.toLowerCase()));
          const reminderList = await fetchAllReminders();
          const reminders = reminderList.filter((reminder) => reminder.toggle);

          switch (true) {
            case !user?.birthDate:
              return setNavigator({
                routeName: "BirthDayDetail",
                params: {
                  isBirthDayPageViaLogin: true,
                  isReminderListLength: reminders?.length === 0,
                  authToken: data?.response?.accessToken,
                },
              });
            case reminders?.length === 0:
              return setNavigator({
                routeName: "Reminder",
                params: {
                  isBirthDayPageViaLogin: true,
                  isReminderListLength: reminders?.length === 0,
                },
              });
            default:
              dispatch(setAuthTokenAction(data?.response?.accessToken));
              dispatch(setLogoutFlag(false));
              setNavigator(null);
              break;
          }
        }
      } catch (error) {
        setIsZoulCheckOutTokenInvalid(true);
        // modal.show(ErrorDialog, {
        //   message:
        //     error?.response?.data?.message ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        //   onConfirm: () => modal.close(),
        // });

        console.error("Error while login by zoul checkout token:", error);
      }
    }
  };

  // handle promo code
  const handlePromoCode = async (promocode) => {
    try {
      if (
        (isUserDetails &&
          Object.keys(isUserDetails).length > 0 &&
          isUserSubscribed) ||
        isDeeplinkUsed
      ) {
        setLoading(false);
        return;
      }
      const promoCodeRes = await applyPromoCode({ code: promocode.trim() });

      if (!promoCodeRes?.data?.redeemable && promoCodeRes?.data?.valid) {
        setPromoCodeData(promocode);
        setIsVerifiedPromo(promoCodeRes?.data?.valid);
      } else if (promoCodeRes?.data?.redeemable && promoCodeRes?.data?.valid) {
        if (isUserDetails && Object.keys(isUserDetails).length > 0) {
          if (isUserDetails?.subscription?.planId !== "free") {
            setTimeout(() => {
              modal.show(CongratsModal, {
                message: "You already have an active plan.",
                btnTitle: "Ok",
              });
            }, 3500);
            return;
          } else {
            applyRedeemableCode({ code: promocode.trim() })
              .then((res) => {
                setTimeout(() => {
                  modal.show(CongratsModal, {
                    message: "Your code is successfully verified. ",
                    btnTitle: "Ok",
                  });
                  dispatch(setDeeplinkUsed(true));
                  dispatch(setIsUserSubscribed(true));
                }, 3500);
              })
              .catch((error) => {
                console.log(
                  "error applyRedeemableCode =--->",
                  error?.response?.data
                );

                modal.show(ErrorDialog, {
                  message:
                    error?.response?.data?.message ??
                    ERROR_CONTACT_SUPPORT_MESSAGE,
                  onConfirm: () => modal.close(),
                });
              });
            return;
          }
        }

        modal.show(CongratsModal, {
          message:
            "Your code is successfully verified. Please continue to create your account.",
          btnTitle:"Ok",
        });
        dispatch(setDeeplinkUsed(true));
        dispatch(setIsUserSubscribed(true));
        setPromoCodeData(promocode);
        setIsVerifiedPromo(promoCodeRes?.data?.valid);
        dispatch(
          setPromoCodeDetails({
            promoCode: promocode,
            isVerifiedPromo: promoCodeRes?.data?.valid,
            isPromoRedeemable: promoCodeRes?.data?.redeemable,
          })
        );
        setIsPromoRedeemable(true);
      }
      if (!promoCodeRes?.data?.valid) {
        const token = await getAuthToken();
        modal.show(ErrorDialog, {
          isShowButton: true,
          isNotLoggedIn: token ? false : true,
          navigation: navigationRef?.current,
          buttonName: "contact support",
          message: `The promo code or redeemable code (${promocode}) is invalid. Please contact support`,
          onConfirm: () => modal.close(),
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error applying promo code:", error);
      setLoading(false);
    }
  };

  const handleDynamicLink = async (link) => {
    if (link && link.url) {
      setLoading(true);
      const url = link.url;
      const queryString = url.split("?")[1];
      const queryParams = queryString.split("&");
      let audioID = null;
      let language = null;
      let isHoroscope = false;
      let promocode = null;
      let isDailyWisdom = null;
      let token = null;

      queryParams.forEach((param) => {
        const [key, value] = param.split("=");
        if (key === "audioID") {
          audioID = decodeURIComponent(value).replace(/[^\w-]/g, ""); // Decode and remove any trailing characters
        }
        if (key === "language") {
          language = decodeURIComponent(value);
        }
        if (key === "isHoroscope" && value === "true") {
          isHoroscope = true;
        }
        if (key === "isDailyWisdom" && value === "true") {
          isDailyWisdom = true;
        }
        if (key === "promocode") {
          promocode = decodeURIComponent(value);
        }
        if (key === "token") {
          token = value;
        }
      });
      if (isHoroscope && !isHoroscopeDeeplink) {
        dispatch(horoscopeDeepLink(true));
        await isHoroscopeData();
        setLoading(false);
      } else if (audioID) {
        if (!audioDeeplink) {
          dispatch(audioDeepLink({ audioID, language }));
          setLoading(false);
        }
      } else if (isDailyWisdom) {
        await fetchIsDailyWisdom(isDailyWisdom);
      } else if (promocode) {
        if (!isFromHome) {
          await handlePromoCode(promocode);
        }
      } else if (token) {
        await handleZoulCheckOutToken(token);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        console.log("Link", link)
        if (link) {
          handleDynamicLink(link);
        } else {
          setLoading(false);
        }
      });
  }, []);

  return {
    audioData,
    horoscopeData,
    promoCodeData,
    isVerifiedPromo,
    isPromoRedeemable,
    loading,
    fetchAudioData,
    fetchHoroscopeData,
    navigator,
    isZoulCheckOutTokenInvalid,
  };
};

export default useDynamicLinkHandler;
