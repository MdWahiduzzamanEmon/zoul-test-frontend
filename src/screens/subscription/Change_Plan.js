import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  Platform,
  TextInput,
  ScrollView,
} from "react-native";
import Block from "../../components/utilities/Block";
import BackIcon from "../../assets/appImages/svgImages/BackIcon";
import { perfectSize, responsiveScale } from "../../styles/mixins";
import Text from "../../components/utilities/Text";
import { colors } from "../../styles/theme";
import ZoulAppIcon from "../../assets/appImages/svgImages/ZoulAppIcon";
import CheckIcon from "../../assets/appImages/svgImages/CheckIcon";
import { SKUs, YEARLY, YEARLY_PROMO } from "../../constants/InAppPurchase";
import { useDispatch } from "react-redux";
import {
  setIsUserSubscribed,
  setSubscribedUser,
} from "../../store/storeAppData/actions/subscriptionAction";
import Gem from "../../assets/appImages/svgImages/Gem";
import { padding } from "../../components/layout/Padding";
import {
  applyPromoCode,
  getmysubscriptionplanDetails,
} from "../../resources/baseServices/app";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useModal } from "../../context/ModalContext";
import CongratsModal from "../../components/subscriptionModal/CongratulationsModal";
import moment from "moment";
import i18n from "../../translations/i18n";
import * as RNIap from "react-native-iap";

const ChangePlanScreen = ({ navigation, route }) => {
  const { top } = useSafeAreaInsets();
  const modal = useModal();
  const [currentPlan, setCurrentPlan] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [offerings, setOfferings] = useState({});
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeError, setPromoCodeError] = useState(null);
  const [allOfferings, setAllOfferings] = useState([]);
  const [isApplied, setIsCodeApplied] = useState(false);
  const dispatch = useDispatch();
  const [currentPlanPrice, setCurrentPlanPrice] = useState(null);

  // Fetch the current plan from the user's subscription details
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsPageLoading(true);
      try {
        // Initialize IAP connection
        await RNIap.initConnection();

        // Fetch available subscriptions
        const plans = await RNIap.getSubscriptions({ skus: SKUs });

        setAllOfferings(plans);
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

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
  };

  // Function to handle subscription process
  const handleSubscribeNow = async () => {};

  const getLocalizePrice = (productId) => {
    const plan = allOfferings.find((plan) => plan.productId === productId);
    return plan ? plan.price : "";
  };

  const YearlyPlan = () => {
    return (
      <TouchableOpacity
        style={[
          styles.planOption,
          (selectedPlan == YEARLY || selectedPlan == YEARLY_PROMO) &&
            styles.selectedPlan,
        ]}
        onPress={() => handlePlanSelection(isApplied ? YEARLY_PROMO : YEARLY)}
      >
        <Block flex={false} row style={{ alignItems: "flex-end" }}>
          <Text color={colors.white} size={responsiveScale(16)} regular>
            {i18n.t("Annual plan")}
          </Text>
        </Block>
        <Text
          medium
          color={colors.white}
          size={responsiveScale(18)}
          style={styles.planDetails}
        >
          ${getLocalizePrice(isApplied ? YEARLY_PROMO : YEARLY)} Annual
          {` ($ ${
            isApplied
              ? parseFloat(
                  getLocalizePrice(isApplied ? YEARLY_PROMO : YEARLY) / 12
                ).toFixed(1)
              : Math.round(
                  getLocalizePrice(isApplied ? YEARLY_PROMO : YEARLY) / 12
                )
          }/${i18n.t("month")})`}
        </Text>
        {(selectedPlan == YEARLY || selectedPlan == YEARLY_PROMO) && (
          <CheckIcon style={styles.checkIcon} />
        )}
      </TouchableOpacity>
    );
  };

  const onApplyPromoCode = () => {
    try {
      if (promoCode.trim().length > 0) {
        applyPromoCode({ code: promoCode.trim() })
          .then((res) => {

            if (res?.data?.valid) {
              setIsCodeApplied(true);
              if (selectedPlan == YEARLY) {
                selectedPlan(YEARLY_PROMO);
              }
              setPromoCodeError(null);
            } else {
              setIsCodeApplied(false);
              setPromoCodeError("Invalid Promo Code");
            }
          })
          .catch((err) => {
            console.error("err applyPromoCode =--->", err);
          });
      }
    } catch (error) {
      console.error("error onApplyPromoCode =--->", error);
    }
  };

  const onChangeText = (text) => {
    if (text == "") {
      setIsCodeApplied(false);
      setSelectedPlan(null);
    }
    setPromoCodeError(null);
    setPromoCode(text);
  };

  return (
    <Block flex={1}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={require("../../assets/appImages/ExploreBackgroundImage.png")}
        resizeMode="stretch"
        style={[styles.bgImage, { paddingTop: top }]}
      >
        {isPageLoading && (
          <Block flex={1} style={styles.loaderView1}>
            <ActivityIndicator size={"large"} color={colors.goldenOlive} />
          </Block>
        )}
        <Block flex={1}>
          <Block flex={false} style={styles.headerContainer}>
            <TouchableOpacity onPress={navigation.goBack}>
              <BackIcon height={32} width={32} />
            </TouchableOpacity>
          </Block>
          <Block flex={false} style={styles.pageTitle}>
            <Text medium size={responsiveScale(28)} color={colors.white}>
              {i18n.t("Change Plan")}
            </Text>
          </Block>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: perfectSize(20) }}
          >
            <Block flex={false} style={{ paddingHorizontal: perfectSize(16) }}>
              <Block flex={false} style={styles.infoContainer}>
                <Text
                  color={colors.white}
                  size={responsiveScale(16)}
                  style={styles.planText}
                  regular
                >
                  {i18n.t("Your current plan")}
                </Text>
                <Text color={colors.white} size={responsiveScale(18)} medium>
                  ${route?.params?.price} {i18n.t("Monthly")}
                </Text>
              </Block>

              <Text
                color={colors.white}
                size={responsiveScale(22)}
                style={styles.selectText}
              >
                {i18n.t("Select new plan")}
              </Text>

              <Block flex={false} style={styles.promoCodeContainer}>
                <Block flex={false} row center width={"80%"}>
                  <Block flex={false} width={"10%"}>
                    <Gem height={20} width={20} style={styles.gemImage} />
                  </Block>
                  <TextInput
                    placeholder={i18n.t("Promo Code")}
                    placeholderTextColor={colors.white}
                    style={{
                      fontSize: responsiveScale(14),
                      width: "90%",
                      color: colors.white,
                      paddingVertical: 0,
                    }}
                    keyboardType="default"
                    onSubmitEditing={() => onApplyPromoCode()}
                    onChangeText={(text) => onChangeText(text)}
                    value={promoCode}
                  />
                </Block>
                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
                  onPress={() => onApplyPromoCode()}
                >
                  <Text bold color={colors.white} size={responsiveScale(13)}>
                    {i18n.t("Apply")}
                  </Text>
                </TouchableOpacity>
              </Block>

              <YearlyPlan />
            </Block>

            <Block
              flex={false}
              center
              style={{
                marginTop: "40%",
                marginBottom: "10%",
              }}
            >
              <ZoulAppIcon />
            </Block>

            {/* Subscribe/Change Plan Button */}
            <TouchableOpacity
              style={[
                styles.changePlanButton,
                {
                  backgroundColor: selectedPlan
                    ? colors.darkRedText
                    : "#FFFFFF",
                  opacity: selectedPlan ? 1 : 0.4,
                },
              ]}
              // onPress={handleSubscribeNow}
              disabled={!selectedPlan || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text
                  color={selectedPlan ? colors.white : colors.black}
                  size={responsiveScale(16)}
                >
                  {i18n.t("Change plan")}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </Block>
      </ImageBackground>
    </Block>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: perfectSize(16),
  },
  pageTitle: {
    paddingHorizontal: perfectSize(16),
    marginTop: perfectSize(20),
  },
  infoContainer: {
    marginTop: perfectSize(20),
    paddingHorizontal: perfectSize(16),
    backgroundColor: colors.transparent,
    paddingVertical: perfectSize(15),
    borderRadius: perfectSize(8),
    marginBottom: perfectSize(30),
  },
  noPlanText: {
    marginTop: perfectSize(20),
    marginBottom: perfectSize(30),
    textAlign: "center",
  },
  planText: {
    marginBottom: perfectSize(10),
  },
  selectText: {
    marginBottom: perfectSize(10),
  },
  planOption: {
    backgroundColor: colors.transparent,
    padding: perfectSize(20),
    borderRadius: perfectSize(10),
    marginBottom: perfectSize(15),
    paddingHorizontal: perfectSize(16),
    position: "relative",
  },
  selectedPlan: {
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.blackDivider,
  },
  planDetails: {
    marginTop: perfectSize(5),
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: perfectSize(30),
  },
  changePlanButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: perfectSize(8),
    paddingVertical: perfectSize(15),
    alignItems: "center",
    marginHorizontal: perfectSize(16),
    marginBottom: perfectSize(16),
    height: perfectSize(56),
  },
  checkIcon: {
    position: "absolute",
    top: perfectSize(10),
    right: perfectSize(10),
  },
  gemImage: { marginRight: perfectSize(10) },
  promoCodeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF66",
    padding: perfectSize(10),
    borderRadius: perfectSize(5),
    marginBottom: perfectSize(18),
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
});

export default ChangePlanScreen;
