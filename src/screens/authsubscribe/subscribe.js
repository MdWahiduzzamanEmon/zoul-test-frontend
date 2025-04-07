import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  Linking,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text as TextView,
  Alert,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors, font } from "../../styles/theme";
import Gem from "../../assets/appImages/svgImages/Gem";
import { useDispatch, useSelector } from "react-redux";
import {
  YEARLY_PROMO,
  YEARLY,
  MONTHLY,
  MONTHLY_PROMO,
  SKUs,
} from "../../constants/InAppPurchase";
import Tick from "../../assets/appImages/svgImages/tick.svg";
import UnTick from "../../assets/appImages/svgImages/untick.svg";
import {
  applyPromoCode,
  getSubscriptionImages,
  setSubscriptionData,
  trackpromocode,
} from "../../resources/baseServices/app";
import { useModal } from "../../context/ModalContext";
import { envConfig } from "../../config/config";
import { useInAppBrowser } from "../../helpers/in-app-browser";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import {
  removeUUID,
  setRefreshToken,
  storeSignupAuthToken,
} from "../../helpers/auth";
import "react-native-get-random-values";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Whatsapp from "../../assets/appImages/svgImages/Whatsapp.svg";
import ZoulAppIcon from "../../assets/appImages/svgImages/ZoulAppIcon";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Backgrounds } from "../../data/background";
import i18n from "../../translations/i18n";
import CloseIcon from "../../components/common/SvgIcons/CloseIcon";
import useVersionUpdateHandler from "../../hooks/useVersionUpdateHandler";
import { supportWhatsAppNumber } from "../../utils/utils";
import { setLogoutFlag } from "../../store/auth";
import LinearGradient from "react-native-linear-gradient";
import * as RNIap from "react-native-iap";
import { setIsUserSubscribed } from "../../store/storeAppData/actions/subscriptionAction";
import MasterEventLogger from "../../utils/MasterEventLogger";

const backgroundImages = Object.values(Backgrounds.subscriptionModalImages);

const Subscribe = ({ navigation, promoCodeData, isVerifiedPromo, route }) => {
  const userData = route?.params?.userData;
  const selectedLanguage = route?.params?.selectedLanguage;
  const registerResponse = route?.params?.registerResponse;
  const isVisible = true;
  const code = "";

  const dispatch = useDispatch();
  const modal = useModal();
  const { top, bottom } = useSafeAreaInsets();
  const { currentVersion } = useVersionUpdateHandler();

  const isAppliedPromo = useSelector(
    (state) => state.subscription.promoCodeApplied
  );

  const language = useSelector((state) => state.language.selectedLanguage);

  const [backgroundImage, setBackgroundImage] = useState({});
  const [backgroundImgs, setBackgroundImgs] = useState([]);
  const [selectSubscriptionPlan, setSelectSubscriptionPlan] = useState(YEARLY);
  const [promoCode, setPromoCode] = useState("");
  const [isApplied, setIsCodeApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [offerings, setOfferings] = useState({});
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [allOfferings, setAllOfferings] = useState([]);
  const [promoCodeError, setPromoCodeError] = useState(null);

  const TERMS_AND_CONDITIONS_URL = envConfig.TERMS_AND_CONDITIONS_URL;
  const PRIVACY_POLICY_URL = envConfig.PRIVACY_POLICY_URL;

  const { handleInAppBrowser } = useInAppBrowser(); // Get the in-app browser handler

  useEffect(() => {
    const fetchSubscriptionImages = async () => {
      setIsPageLoading(true);
      try {
        const subscriptionImages = await getSubscriptionImages();
        if (subscriptionImages?.status == 200) {
          setBackgroundImgs(subscriptionImages?.data);
          const randomImage =
            subscriptionImages?.data[
              Math.floor(Math.random() * subscriptionImages?.data?.length)
            ];
          setBackgroundImage(randomImage);
        }
      } catch (error) {}
    };
    fetchSubscriptionImages();
  }, []);

  useEffect(() => {
    const randomImage =
      backgroundImgs[Math.floor(Math.random() * backgroundImgs.length)];
    setBackgroundImage(randomImage);
  }, [isVisible]);

  const onPressTerms = () => {
    handleInAppBrowser(TERMS_AND_CONDITIONS_URL); // Open Terms & Conditions URL
  };

  const onPressPrivacy = () => {
    handleInAppBrowser(PRIVACY_POLICY_URL); // Open Privacy Policy URL
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsPageLoading(true);
      try {
        // Initialize IAP connection
        await RNIap.initConnection();

        // Fetch available subscriptions
        const plans = await RNIap.getSubscriptions({ skus: SKUs });

        // setSubscriptions(plans);
        if (Platform.OS == "ios") {
          setAllOfferings(plans);
        } else {
          const extractedPlans = plans.flatMap((plan) =>
            plan.subscriptionOfferDetails.map(
              (offer) =>
                offer?.pricingPhases?.pricingPhaseList[0].formattedPrice !=
                  "Free" && {
                  productId: plan.productId,
                  offerToken: offer.offerToken,
                  formattedPrice:
                    offer.pricingPhases.pricingPhaseList[0].formattedPrice,
                }
            )
          );
          setAllOfferings(extractedPlans);
        }
        setIsPageLoading(false);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
        setIsPageLoading(false);
      }
    };

    fetchSubscriptions();

    return () => {
      RNIap.endConnection(); // Cleanup
    };
  }, []);

  const formatPrice = (price) => {
    const currencySymbol = price?.match(/[^\d.,]/g)?.join("") || "";
    let num = parseFloat(price?.replace(/[^0-9.]/g, ""));

    if (Number.isInteger(num)) return currencySymbol + num.toString();
    return currencySymbol + (num % 1 === 0 ? num.toFixed(0) : num.toFixed(2));
  };

  const getLocalizePrice = (productId, perMonth = false) => {
    let plans = "";

    const plan = allOfferings.find((plan) => plan.productId === productId);
    const isAndroid = Platform.OS == "android";
    if (perMonth) {
      return perMonthPrice(
        isAndroid ? plan?.formattedPrice : plan?.localizedPrice
      );
    }
    plans = formatPrice(
      isAndroid ? plan?.formattedPrice : plan?.localizedPrice
    );

    return plans;
  };

  const perMonthPrice = (formattedPrice) => {
    const currencySymbol = formattedPrice?.match(/[^\d.,]/g)?.join("") || "";
    const numericPrice = parseFloat(formattedPrice?.replace(/[^0-9.]/g, ""));
    const monthlyPrice = (numericPrice / 12).toFixed(1); // Keep one decimal place
    return `${currencySymbol}${
      currencySymbol == "$" ? Math.round(monthlyPrice) : monthlyPrice
    }`;
  };

  const trackPromoCodeUsage = async (code) => {
    try {
      // Track the promo code entered by the user
      const response = await trackpromocode({ code });
      console.log("Promo code tracked successfully:", response?.data);
    } catch (error) {
      console.error("Error tracking promo code:", error);
    }
  };

  const onApplyPromoCode = () => {
    try {
      Keyboard.dismiss();
      if (promoCode.trim().length > 0) {
        setIsPageLoading(true);
        // Linking.openURL(PROMO_CODE_LINKs[Platform.OS] + promoCode);
        applyPromoCode({ code: promoCode.trim() })
          .then((res) => {
            if (res?.data?.valid) {
              setIsCodeApplied(true);
              setPromoCodeError(null);
              if (selectSubscriptionPlan == MONTHLY) {
                setSelectSubscriptionPlan(MONTHLY_PROMO);
              } else if (selectSubscriptionPlan == YEARLY) {
                setSelectSubscriptionPlan(YEARLY_PROMO);
              }
            } else {
              setIsCodeApplied(false);
              setPromoCodeError("Invalid Promo Code");
            }
          })
          .catch((err) => {
            console.error("err applyPromoCode =--->", err);
          })
          .finally(() => {
            setIsPageLoading(false);
          });
      } else {
        setIsCodeApplied(false);
      }
    } catch (error) {
      console.error("error onApplyPromoCode =--->", error);
    }
  };

  const checkActivePlan = async () => {
    setIsPageLoading(true);
    try {
      await RNIap.initConnection();
      const purchases = await RNIap.getAvailablePurchases();
      // Finish each purchase to remove it from the queue
      for (const purchase of purchases) {
        await RNIap.finishTransaction({ purchase });
      }

      // Clear transaction history based on platform
      if (Platform.OS === "ios") {
        await RNIap.clearTransactionIOS();
      } else if (Platform.OS === "android") {
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      }
      const activePurchase = purchases.find(
        (purchase) =>
          SKUs.includes(purchase.productId) &&
          (purchase?.transactionReceipt || purchase?.purchaseToken)
      );
      if (activePurchase) {
        Alert.alert(
          "",
          "You already have an active subscription on this device account. To subscribe with a different account, go to your phone's Settings and switch accounts."
        );
        console.error("You already have an active plan.");
      } else {
        startPurchase();
      }
      setIsPageLoading(false);
    } catch (error) {
      setIsPageLoading(false);
      console.error("Error checking active purchases:", error);
    }
  };

  const LogPurchaseEvent = async () => {
    const eventName = "purchase";
    const data = {
      revenue_value: getLocalizePrice(selectSubscriptionPlan),
      subscription_plan_purchased:
        selectSubscriptionPlan === YEARLY ||
        selectSubscriptionPlan === YEARLY_PROMO
          ? "yearly"
          : "monthly",
      payment_methord: "",
    };
    await MasterEventLogger({ name: eventName, data: data, userId: user?.id });
  };

  const savePurchaseData = async (purchase) => {
    let obj;
    if (Platform.OS == "ios") {
      obj = {
        transactionId: purchase?.transactionId,
        userId: user?.id,
        planId: purchase?.productId,
        planDuration:
          selectSubscriptionPlan === YEARLY ||
          selectSubscriptionPlan === YEARLY_PROMO
            ? "yearly"
            : "monthly",
        purchaseToken: purchase?.transactionReceipt,
        platform: Platform.OS,
        price: getLocalizePrice(selectSubscriptionPlan),
        inappPurchaseObject: purchase,
      };
    } else {
      obj = {
        transactionId: purchase[0]?.transactionId,
        userId: user?.id,
        planId: purchase[0]?.productIds[0],
        planDuration:
          selectSubscriptionPlan === YEARLY ||
          selectSubscriptionPlan === YEARLY_PROMO
            ? "yearly"
            : "monthly",
        purchaseToken: purchase[0]?.purchaseToken,
        platform: Platform.OS,
        price: getLocalizePrice(selectSubscriptionPlan),
        packageNameAndroid: purchase[0]?.packageNameAndroid,
        inappPurchaseObject: purchase,
      };
    }

    // Wait for API call after confirming purchase
    try {
      const res = await setSubscriptionData(obj);
      if (res?.status == 201) {
        dispatch(setIsUserSubscribed(true));

        if (isApplied && promoCode.trim().length > 0) {
          trackPromoCodeUsage(promoCode.trim());
        }
        LogPurchaseEvent();
        setIsPageLoading(false);
        onClose();
      } else {
        Alert.alert(
          "Zoul",
          "purchaser Error",
          [
            {
              text: "OK",
              onPress: () => {},
            },
          ],
          { cancelable: true }
        );
      }
    } catch (error) {
      console.error("error Subscription Api =--->", error);
      Alert.alert(
        "Zoul",
        "purchaser Error",
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ],
        { cancelable: true }
      );
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

  const startPurchase = async () => {
    setIsPageLoading(true);
    setIsLoading(true);
    try {
      let offerings = "";
      let purchase;
      allOfferings.map((plan) => {
        if (plan?.productId == selectSubscriptionPlan) {
          offerings = plan?.offerToken;
        }
      });
      if (Platform.OS == "android") {
        purchase = await RNIap.requestSubscription({
          sku: selectSubscriptionPlan,
          ...(offerings && {
            subscriptionOffers: [
              { sku: selectSubscriptionPlan, offerToken: offerings },
            ],
          }),
        });
      } else {
        purchase = await RNIap.requestSubscription({
          sku: selectSubscriptionPlan,
        });
      }
      if (purchase?.transactionReceipt || purchase[0].purchaseToken) {
        savePurchaseData(purchase);
      }
    } catch (error) {
      setIsPageLoading(false);
      setIsLoading(true);
      if (Platform.OS === "android") {
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      }
      console.warn("Purchase failed:", error, selectSubscriptionPlan);
    } finally {
      setIsLoading(true);
      setIsPageLoading(false);
    }
  };

  const onChangeText = (text) => {
    if (text == "") {
      setIsCodeApplied(false);
      setSelectSubscriptionPlan(YEARLY);
    }
    setPromoCodeError(null);
    setPromoCode(text);
  };

  const onClose = async () => {
    setSelectSubscriptionPlan(YEARLY);
    setIsCodeApplied(false);
    setPromoCode("");
    setIsLoading(false);

    if (registerResponse) {
      await storeSignupAuthToken(
        registerResponse?.data?.response?.accessToken,
        true
      );
      await setRefreshToken(registerResponse?.data?.response?.refreshToken);
      dispatch(setLogoutFlag(false));
      await removeUUID();
      navigation.navigate("BirthDayDetail");
    }
  };

  return (
    <Block flex={1}>
      <Block flex={1}>
        {(isPageLoading || allOfferings.length == 0) && (
          <Block flex={1} style={styles.loaderView1}>
            <ActivityIndicator size={"large"} color={colors.goldenOlive} />
          </Block>
        )}
        <ImageBackground
          defaultSource={backgroundImages[0]}
          source={
            backgroundImgs?.length != 0 && backgroundImage?.image_url
              ? { uri: backgroundImage?.image_url }
              : backgroundImages[0]
          }
          resizeMode="cover"
          style={{
            flexGrow: 1,
            paddingTop: top + 5,
            paddingBottom: bottom + 30,
          }}
        >
          <KeyboardAwareScrollView
            behavior="height"
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <Block flex={1} style={styles.subscriptionModalContainer}>
              <Block
                flex={0.2}
                row
                between
                style={{
                  paddingLeft: 24,
                  paddingRight: 11,
                }}
              >
                <Block flex={false} style={{ alignItems: "flex-end" }}>
                  <Block flex={false}>
                    <ZoulAppIcon height={46.61} width={59} />
                  </Block>
                </Block>
                <Block flex={false} row between>
                  <Block flex={false} />
                  <TouchableOpacity
                    style={styles.skipTextView}
                    onPress={() => onClose(false)}
                  >
                    <Block
                      flex={false}
                      // style={styles.skipTextView}
                      row
                      center
                      gap={4}
                    >
                      <Text
                        size={responsiveScale(18)}
                        medium
                        weight={400}
                        color={colors.white}
                      >
                        {i18n.t("Skip")}
                      </Text>
                      <CloseIcon style={{ marginTop: scaleSize(2) }} />
                    </Block>
                  </TouchableOpacity>
                </Block>
              </Block>
              <Block
                flex={1}
                style={{
                  paddingLeft: 24,
                  alignItems: "flex-start",
                  marginTop: perfectSize(20),
                }}
              >
                {language == "en" ? (
                  <>
                    <Text
                      style={[
                        styles.headerText,
                        {
                          lineHeight: 38,
                        },
                      ]}
                      size={responsiveScale(30)}
                    >
                      Get <Text size={responsiveScale(22)}>the</Text>
                    </Text>
                    <Text
                      style={[
                        styles.headerText,
                        {
                          lineHeight: 15,
                          bottom: perfectSize(5),
                        },
                      ]}
                      size={responsiveScale(22)}
                    >
                      {"\n"}most out of
                    </Text>
                    <Text
                      style={[
                        styles.headerText,
                        {
                          lineHeight: 38,
                        },
                      ]}
                      size={responsiveScale(30)}
                    >
                      Zoul!
                    </Text>
                  </>
                ) : (
                  <Text
                    style={[
                      styles.headerText,
                      {
                        // lineHeight: 15,
                        bottom: perfectSize(5),
                      },
                    ]}
                    size={responsiveScale(22)}
                  >
                    {i18n.t("GetZoul")}
                  </Text>
                )}

                <Text
                  style={[
                    styles.subText,
                    {
                      fontFamily: font.bold,
                    },
                  ]}
                  size={responsiveScale(28)}
                >
                  {i18n.t("PREMIUM")}
                </Text>
                <Text
                  style={[
                    styles.subText,
                    {
                      fontFamily: font.italic,
                      width: "60%",
                    },
                  ]}
                  size={responsiveScale(17)}
                >
                  {i18n.t("CustomAudios")}
                  {/* Custom playlists, {"\n"}offline access and {"\n"}exclusive
                  audios. */}
                </Text>
                <Text
                  style={[
                    styles.subText,
                    {
                      fontFamily: font.bold,
                      color: colors.white,
                    },
                  ]}
                  size={responsiveScale(22)}
                >
                  {i18n.t("7 days free trial")}
                </Text>
              </Block>
              <Block flex={1.2}>
                <Block flex={1} style={styles.featureContainer} bottom>
                  <Block flex={false} middle margin={[scaleSize(14), 0, 0, 0]}>
                    {/* {Platform.OS == "android" && (
                      <Block flex={false}>
                        <Block
                          flex={false}
                          style={{ marginVertical: perfectSize(10) }}
                        >
                          <Block flex={false} style={styles.promoCodeContainer}>
                            <Block
                              flex={false}
                              row
                              center
                              width={"80%"}
                              height={28}
                            >
                              <Block flex={false} width={"10%"}>
                                <Gem
                                  height={20}
                                  width={25}
                                  style={styles.gemImage}
                                />
                              </Block>
                              <TextInput
                                placeholder={i18n.t("Promo Code")}
                                placeholderTextColor={colors.white}
                                style={{
                                  fontSize: responsiveScale(16),
                                  fontFamily: font.SemiBold,
                                  width: "90%",
                                  color: colors.white,
                                  paddingVertical: 0,
                                  fontWeight: "600",
                                }}
                                onSubmitEditing={() => onApplyPromoCode()}
                                onChangeText={(text) => onChangeText(text)}
                                value={promoCode}
                              />
                            </Block>
                            <TouchableOpacity
                              hitSlop={{
                                top: 10,
                                bottom: 10,
                                right: 10,
                                left: 10,
                              }}
                              onPress={() => onApplyPromoCode()}
                            >
                              <Text
                                style={{ fontFamily: font.SemiBold }}
                                bold
                                color={colors.white}
                                size={responsiveScale(14)}
                                weight={"600"}
                              >
                                {i18n.t("Apply")}
                              </Text>
                            </TouchableOpacity>
                          </Block>
                          {promoCodeError !== null && (
                            <Block flex={false} right row>
                              <Text color={"red"} size={responsiveScale(10)}>
                                {promoCodeError}
                              </Text>
                            </Block>
                          )}
                        </Block>
                      </Block>
                    )} */}
                    <LinearGradient
                      colors={["rgba(86, 1, 17, 0.9)", "rgba(36, 5, 10, 1)"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      locations={[0.3626, 0.9806]}
                      style={styles.gradient}
                    >
                      <Block flex={false} style={{ width: "100%" }}>
                        <TouchableOpacity
                          style={[
                            styles.priceContainer,
                            {
                              alignItems: "center",
                              // paddingVertical: perfectSize(10),
                              paddingHorizontal: perfectSize(10),
                            },
                          ]}
                          onPress={() => setSelectSubscriptionPlan(YEARLY)}
                        >
                          <Block>
                            <Block
                              row
                              style={{
                                width: "95%",
                                alignItems: "center",
                              }}
                            >
                              <Block
                                flex={1}
                                row
                                gap={10}
                                style={{ alignItems: "center" }}
                              >
                                {selectSubscriptionPlan == YEARLY ||
                                selectSubscriptionPlan == YEARLY_PROMO ? (
                                  <Tick height={26} width={26} />
                                ) : (
                                  <UnTick height={26} width={26} />
                                )}
                                <Text
                                  regular
                                  color={colors.white}
                                  size={responsiveScale(20)}
                                  style={{
                                    fontFamily: font.SemiBold,
                                  }}
                                >
                                  {i18n.t("Yearly")}
                                </Text>
                              </Block>
                              <Block
                                flex={1}
                                style={{
                                  alignItems: "flex-end",
                                }}
                              >
                                <TextView
                                  adjustsFontSizeToFit
                                  numberOfLines={1}
                                  style={{
                                    fontFamily: font.SemiBold,
                                    color: colors.white,
                                    fontSize: responsiveScale(38),
                                  }}
                                >
                                  {getLocalizePrice(
                                    isApplied ? YEARLY_PROMO : YEARLY
                                  )}
                                </TextView>
                                <Text
                                  style={{ color: colors.white }}
                                  bold
                                  size={responsiveScale(11)}
                                >
                                  {/* {i18n.t("PER MONTH")} */}
                                  PER YEAR
                                </Text>
                              </Block>
                            </Block>
                            <Block
                              style={{
                                backgroundColor: colors.white,
                                height: perfectSize(1),
                                marginTop: perfectSize(10),
                              }}
                            />
                            <Block
                              flex={1}
                              row
                              style={{
                                paddingVertical: perfectSize(5),
                                width: "95%",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text
                                regular
                                style={{ color: colors.white, width: "60%" }}
                                size={responsiveScale(13)}
                              >
                                {/* {i18n.t("Collectible once a year")} */}
                              </Text>
                              <TextView
                                adjustsFontSizeToFit
                                numberOfLines={1}
                                style={{
                                  color: colors.white,
                                  fontSize: responsiveScale(13),
                                  fontFamily: font.regular,
                                }}
                              >
                                {getLocalizePrice(
                                  isApplied ? YEARLY_PROMO : YEARLY,
                                  true
                                )}
                                /{i18n.t("month")}
                              </TextView>
                            </Block>
                          </Block>
                        </TouchableOpacity>
                      </Block>
                    </LinearGradient>
                    <LinearGradient
                      colors={["rgba(86, 1, 17, 0.9)", "rgba(36, 5, 10, 1)"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      locations={[0.3626, 0.9806]}
                      style={styles.gradient}
                    >
                      <Block flex={false} style={{ width: "100%" }}>
                        <TouchableOpacity
                          style={[
                            styles.priceContainer,
                            {
                              alignItems: "center",
                              paddingVertical: perfectSize(8),
                              paddingHorizontal: perfectSize(10),
                            },
                          ]}
                          onPress={() => setSelectSubscriptionPlan(MONTHLY)}
                        >
                          <Block>
                            <Block
                              row
                              style={{
                                width: "95%",
                                alignItems: "center",
                              }}
                            >
                              <Block
                                flex={1}
                                row
                                gap={10}
                                style={{ alignItems: "center" }}
                              >
                                {selectSubscriptionPlan == MONTHLY ||
                                selectSubscriptionPlan == MONTHLY_PROMO ? (
                                  <Tick height={26} width={26} />
                                ) : (
                                  <UnTick height={26} width={26} />
                                )}
                                <Text
                                  regular
                                  color={colors.white}
                                  size={responsiveScale(20)}
                                  style={{
                                    fontFamily: font.SemiBold,
                                  }}
                                >
                                  {i18n.t("Monthly")}
                                </Text>
                              </Block>
                              <Block
                                flex={1}
                                style={{
                                  alignItems: "flex-end",
                                }}
                              >
                                <TextView
                                  adjustsFontSizeToFit
                                  numberOfLines={1}
                                  style={{
                                    fontFamily: font.SemiBold,
                                    color: colors.white,
                                    fontSize: responsiveScale(38),
                                  }}
                                >
                                  {getLocalizePrice(
                                    isApplied ? MONTHLY_PROMO : MONTHLY
                                  )}
                                </TextView>
                                <Text
                                  style={{ color: colors.white }}
                                  bold
                                  size={responsiveScale(11)}
                                >
                                  {i18n.t("PER MONTH")}
                                </Text>
                              </Block>
                            </Block>
                          </Block>
                        </TouchableOpacity>
                      </Block>
                    </LinearGradient>
                    <LinearGradient
                      colors={["rgba(86, 1, 17, 0.9)", "rgba(36, 5, 10, 1)"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      locations={[0.3626, 0.9806]}
                      // style={styles.subscribeButton}
                      style={[
                        styles.gradient,
                        { padding: perfectSize(0), borderRadius: 30 },
                      ]}
                    >
                      <Block flex={false}>
                        <TouchableOpacity
                          onPress={() => checkActivePlan()}
                          style={[styles.subscribeButton, {}]}
                          disabled={isLoading}
                        >
                          {isLoading && (
                            <View style={styles.loaderView}>
                              <ActivityIndicator
                                size={"large"}
                                color={colors.goldenOlive}
                              />
                            </View>
                          )}
                          <Text
                            style={{ fontFamily: font.SemiBold }}
                            color={colors.white}
                            size={responsiveScale(20)}
                          >
                            {i18n.t("Subscribe")}
                          </Text>
                        </TouchableOpacity>
                      </Block>
                    </LinearGradient>
                  </Block>
                </Block>
                <Block>
                  <Text
                    style={{ color: colors.black, marginTop: perfectSize(10) }}
                    semibold
                    size={responsiveScale(14)}
                    center
                  >
                    {i18n.t("Cancel anytime")}
                  </Text>
                </Block>
                <Block
                  flex={false}
                  row
                  center
                  middle
                  margin={[scaleSize(14), 0, 0, 0]}
                >
                  <Whatsapp height={24} width={24} />
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      Linking.openURL(`https://wa.me/${supportWhatsAppNumber}`);
                    }}
                  >
                    <Text
                      size={responsiveScale(12)}
                      color={colors.black}
                      regular
                    >
                      {`  WhatsApp: `}
                    </Text>
                    <Text
                      regular
                      size={responsiveScale(12)}
                      style={{ letterSpacing: -0.5 }}
                      color={colors.black}
                    >
                      +44 730 142 6350
                    </Text>
                  </TouchableOpacity>
                  <Text
                    center
                    color={colors.black}
                    regular
                    size={responsiveScale(12)}
                    style={{ letterSpacing: -0.5 }}
                  >
                    {` | `}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL("mailto:Support@zoul.app");
                    }}
                  >
                    <Text
                      regular
                      center
                      color={colors.black}
                      size={responsiveScale(12)}
                      style={{
                        textDecorationLine: "underline",
                        letterSpacing: -0.5,
                      }}
                    >
                      {i18n.t("Contact US")}
                    </Text>
                  </TouchableOpacity>
                </Block>
                <Block
                  flex={false}
                  marginTop={scaleSize(10)}
                  paddingHorizontal={perfectSize(22)}
                >
                  <Text
                    size={responsiveScale(10)}
                    color={colors.black}
                    center
                    regular
                    adjustsFontSizeToFit={Platform.OS === "ios"}
                  >
                    {/* {i18n.t("By clicking the Subscribe")} */}
                    By subscribing, you agree to the Terms & Conditions and the
                    applicable End User License Agreement. This subscription
                    renews automatically on the same date each billing cycle
                    unless canceled at least 24 hours before renewal. Manage or
                    cancel anytime in your device’s subscription settings.
                  </Text>
                </Block>
                <Block
                  flex={false}
                  row
                  center
                  middle
                  style={{
                    flexWrap: "wrap",
                    marginTop: scaleSize(10),
                    // paddingBottom: perfectSize(8),
                  }}
                >
                  <TouchableOpacity onPress={onPressTerms}>
                    <Text
                      center
                      color={colors.black}
                      size={responsiveScale(10)}
                      style={{
                        textDecorationLine: "underline",
                        fontFamily: font.light,
                      }}
                      weight={"500"}
                    >
                      {i18n.t("Terms & Conditions")}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    center
                    color={colors.black}
                    style={{ fontFamily: font.light }}
                    size={responsiveScale(10)}
                    weight={"500"}
                  >
                    {` | `}
                  </Text>
                  <TouchableOpacity onPress={onPressPrivacy}>
                    <Text
                      center
                      color={colors.black}
                      size={responsiveScale(10)}
                      style={{
                        textDecorationLine: "underline",
                        fontFamily: font.light,
                      }}
                      weight={"500"}
                    >
                      {i18n.t("Privacy Policy")}
                    </Text>
                  </TouchableOpacity>
                </Block>
              </Block>
            </Block>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </Block>
    </Block>
  );
};

export default Subscribe;

const styles = StyleSheet.create({
  subscriptionModalContainer: {
    width: "100%",
  },
  skipTextView: {
    marginTop: perfectSize(2),
    borderColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    height: perfectSize(35),
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    paddingHorizontal: perfectSize(13),
  },
  promoCodeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: perfectSize(15),
    paddingVertical: perfectSize(4),
    borderRadius: 4,
  },
  gemImage: { marginRight: perfectSize(10) },
  featureContainer: {
    paddingHorizontal: 30,
  },
  priceContainer: {
    borderRadius: 4,
    width: "100%",
    flexDirection: "row",
  },
  priceText: {
    marginLeft: perfectSize(5),
    fontWeight: "bold",
  },
  subscribeButton: {
    paddingVertical: perfectSize(14),
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  termView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: perfectSize(5),
  },
  mostPopularView: {
    alignSelf: "flex-end",
    paddingHorizontal: perfectSize(10),
    paddingVertical: perfectSize(3),
    borderRadius: perfectSize(4),
    zIndex: 99,
    top: perfectSize(-9),
    right: perfectSize(15),
    position: "absolute",
    justifyContent: "center",
  },
  loaderView: {
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
  },
  loaderView1: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 999,
    justifyContent: "center",
  },
  gradient: {
    padding: perfectSize(8),
    borderRadius: 15,
    marginTop: perfectSize(7),
  },
  headerText: {
    fontFamily: font.SemiBold,
    color: colors.white,
  },
  subText: {
    color: colors.yellow,
    marginTop: perfectSize(8),
  },
});
