import React, { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import BackIcon from "../../assets/appImages/svgImages/BackIcon";
import ZoulAppIcon from "../../assets/appImages/svgImages/ZoulAppIcon";
import { getmysubscriptionplanDetails } from "../../resources/baseServices/app";
import { planIdMapping, SKUs } from "../../constants/revenueCatSKUs";
import { useFocusEffect } from "@react-navigation/native";
import i18n from "../../translations/i18n";
import { useSelector } from "react-redux";
import { YEARLY, YEARLY_PROMO } from "../../constants/InAppPurchase";
import { useInAppBrowser } from "../../helpers/in-app-browser";
import { envConfig } from "../../config/config";
import { LandingLogo } from "../../icons/landing/landing-logo";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const formatDate = (isoDate, language) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString(language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const SubscriptionDetails = ({ navigation }) => {
  const [memberSince, setMemberSince] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [type, setType] = useState("");
  const [subscriptionVia, setSubscriptionVia] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [currency, setCurrency] = useState("");

  const { top } = useSafeAreaInsets();

  const CHECKOUT = envConfig.CHECKOUT;

  const { handleInAppBrowser } = useInAppBrowser(); // Get the in-app browser handler

  const onPressChange = () => {
    handleInAppBrowser(CHECKOUT); // Open Terms & Conditions URL
  };

  const selectedLanguage = useSelector(
    (state) => state?.language.selectedLanguage
  );

  const fetchSubscriptionDetails = useCallback(async () => {
    try {
      const res = await getmysubscriptionplanDetails();
      if (res?.data?.store === "stripe-checkout") {
        const stripePlanName = res?.data?.planName;
        setSubscriptionVia("Stripe");
        setType(stripePlanName);
        setMemberSince(
          res?.data?.startDate
            ? formatDate(res?.data?.startDate, selectedLanguage)
            : "Not applicable"
        );
        setRenewalDate(
          res?.data?.renewalDate
            ? formatDate(res?.data?.renewalDate, selectedLanguage)
            : "Not applicable"
        );
        return;
      }
      if (res?.data?.message != "No subscription plan found") {
        const { subscriptionStartDate, planId, store, expirationDate } =
          res.data;

        // Set the member since date
        setMemberSince(
          subscriptionStartDate
            ? formatDate(subscriptionStartDate)
            : res?.data?.createdAt
            ? formatDate(res?.data?.createdAt)
            : ""
        );

        // Set the renewal date - ensure updatedAt is a valid date
        const renewal =
          expirationDate && !isNaN(new Date(expirationDate))
            ? formatDate(expirationDate)
            : "";
        setRenewalDate(renewal);

        setDuration(res?.data?.planDuration);
        if (res?.data?.price) {
          setPrice(res?.data?.price);
        }

        if (res?.data?.currency) {
          setCurrency(res?.data?.currency);
        }

        // Handle the case where planTypeInfo is null or undefined

        // Set the subscription via
        setSubscriptionVia(
          store === "PLAY_STORE"
            ? "Google Play Store"
            : store === "APP_STORE"
            ? i18n.t("App Store")
            : ""
        );
      } else {
        // Handle the case when there's no subscription data
        setMemberSince("Not subscribed");
        setRenewalDate("No renewal date");
        setType("Free plan");
        setSubscriptionVia("N/A");
      }
    } catch (error) {
      // Handle error fetching subscription details
      console.error("Error fetching subscription details:", error);
      setMemberSince("");
      setRenewalDate("");
      setType("");
      setSubscriptionVia("");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSubscriptionDetails();
    }, [])
  );

  return (
    <Block flex={1}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={require("../../assets/appImages/ExploreBackgroundImageNew.png")}
        resizeMode="stretch"
        style={[styles.bgImage, { paddingTop: top }]}
      >
        <Block flex={1}>
          <Block
            flex={false}
            row
            between
            center
            style={{
              alignItems: "flex-end",
              paddingHorizontal: perfectSize(16),
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <BackIcon height={32} width={32} />
            </TouchableOpacity>
            <LandingLogo
              color={colors.logoColor}
              height={perfectSize(60)}
              width={perfectSize(100)}
            />
            <TouchableOpacity
              style={{ width: 32, height: 32 }}
              disabled={true}
              onPress={() => {}}
            >
              {/* <DeleteIcon height={24} width={24} /> */}
            </TouchableOpacity>
          </Block>

          {/* Page title */}
          <Block flex={false} style={styles.pageTitle}>
            <Text medium size={scaleSize(32)} color={colors.logoColor}>
              {i18n.t("Subscription Details")}
            </Text>
          </Block>
          <ScrollView
            contentContainerStyle={{ paddingBottom: perfectSize(50) }}
          >
            <Block flex={1} style={styles.infoContainer}>
              {/* Member Since */}
              <Block flex={false} style={styles.infoRow}>
                <Text regular size={responsiveScale(11)} color={colors.logoColor}>
                  {i18n.t("Member since")}
                </Text>
                <Text style={styles.infoText}>{memberSince}</Text>
              </Block>

              {/* Renewal Date */}
              <Block flex={false} style={styles.infoRow}>
                <Text regular size={responsiveScale(11)} color={colors.logoColor}>
                  {i18n.t("Renewal date")}
                </Text>
                <Text style={styles.infoText}>{renewalDate}</Text>
              </Block>

              {/* Type */}
              <Block flex={false} style={styles.infoRow}>
                <Text regular size={responsiveScale(11)} color={colors.logoColor}>
                  {i18n.t("Type")}
                </Text>
                <Text style={styles.infoText}>
                  {subscriptionVia == "N/A"
                    ? type
                    : `${price} ${/[^\d.,]/.test(price) ? "" : currency} ${
                        price != "" ? "/" : ""
                      } ${
                        price != ""
                          ? duration == "monthly"
                            ? i18n.t("month")
                            : i18n.t("year")
                          : ""
                      }`}
                </Text>
              </Block>

              {/* Subscription Via */}
              <Block flex={false} style={styles.infoRow}>
                <Text regular size={responsiveScale(11)} color={colors.logoColor}>
                  {i18n.t("Subscription via")}
                </Text>
                <Text style={styles.infoText}>{subscriptionVia}</Text>
              </Block>
            </Block>
          </ScrollView>

          {/* {subscriptionVia !== "Stripe" && (
            <TouchableOpacity
              style={styles.changePlanButton}
              onPress={() => onPressChange()}
              //   navigation.navigate("ChangePlanScreen", {
              //     renewalDate: "1691234567890",
              //     price: 9.99,
              //   })
              // }
            >
              <Text medium size={responsiveScale(16)} color={colors.white}>
                {i18n.t("Change plan")}
              </Text>
            </TouchableOpacity>
          )} */}
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
    marginTop: "15%",
    paddingHorizontal: perfectSize(16),
  },
  pageTitle: {
    paddingHorizontal: perfectSize(16),
    marginTop: perfectSize(20),
  },
  infoContainer: {
    marginTop: perfectSize(20),
    paddingHorizontal: perfectSize(16),
  },
  infoRow: {
    backgroundColor: colors.transparent,
    borderRadius: perfectSize(8),
    paddingVertical: perfectSize(8),
    paddingHorizontal: perfectSize(16),
    marginBottom: perfectSize(15),
    justifyContent: "space-between",
  },
  infoText: {
    color: colors.white,
    fontSize: responsiveScale(16),
    marginTop: perfectSize(4),
  },
  changePlanButton: {
    backgroundColor: colors.darkRedText,
    borderRadius: perfectSize(8),
    justifyContent: "center",
    marginHorizontal: perfectSize(20),
    alignItems: "center",
    height: perfectSize(56),
    marginBottom: "10%",
  },
  appIconContainer: {
    marginVertical: perfectSize(50),
  },
});

export default SubscriptionDetails;
