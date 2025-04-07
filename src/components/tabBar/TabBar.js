import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import HomeIcon from "../../assets/appImages/svgImages/HomeIcon";
import ExploreIcon from "../../assets/appImages/svgImages/ExploreIcon";
import ProfileIcon from "../../assets/appImages/svgImages/ProfileIcon";
import FullAccessIcon from "../../assets/appImages/svgImages/FullAccessIcon";
import BlackHomeIcon from "../../assets/appImages/svgImages/BlackHomeIcon";
import BlackExploreIcon from "../../assets/appImages/svgImages/BlackExploreIcon";
import BlackProfileIcon from "../../assets/appImages/svgImages/BlackProfileIcon";
import BlackFullAccessIcon from "../../assets/appImages/svgImages/BlackFullAccessIcon";
import BlackMySelection from "../../assets/appImages/svgImages/BlackMySelection";
import MySelection from "../../assets/appImages/svgImages/MySelection";
import Block from "../utilities/Block";
import { perfectSize, responsiveScale } from "../../styles/mixins";
import i18n from "../../translations/i18n";
import { useLocale } from "../../context/LocaleProvider";
import { useSelector } from "react-redux";
import SubscriptionModal from "../subscriptionModal/SubscriptionModal";
import CongratsModal from "../subscriptionModal/CongratulationsModal";
import { useModal } from "../../context/ModalContext";
import { YEARLY, YEARLY_PROMO } from "../../constants/InAppPurchase";

const TAB_BAR_HEIGHT = perfectSize(85);

const TabBar = (props) => {
  const modal = useModal();
  const isUserSubscribed = useSelector(
    (state) => state?.subscription?.isUserSubscribed
  );

  const navigation = props?.navigation;

  const [activeTab, setActiveTab] = useState(0);
  const [openSubscriptionModal, setOpenSubscriptionModal] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const { locale } = useLocale();

  useEffect(() => {
    if (props?.state?.index.toString()) {
      setActiveTab(props?.state?.index);
    }
  }, [props?.state?.index]);

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: activeTab,
      friction: 6,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const handleTabPress = (tabIndex) => {
    if (!isUserSubscribed && tabIndex === 3) {
      setOpenSubscriptionModal(true);
    } else {
      setActiveTab(tabIndex);
      navigation.navigate(
        tabIndex === 0
          ? "Home"
          : tabIndex === 1
          ? "Explore"
          : tabIndex === 2
          ? "Profile"
          : "Full Access"
      );
    }
  };
  const { width } = Dimensions.get("window");
  const TAB_ITEM_WIDTH = width / 4;

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [0, TAB_ITEM_WIDTH, TAB_ITEM_WIDTH * 2, TAB_ITEM_WIDTH * 3],
  });

  return (
    <Block flex={false} style={styles.container}>
      <Animated.View
        style={[
          styles.curveContainer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <Svg
          height="50"
          width="120"
          viewBox="0 0 100 50"
          style={styles.curveSvg}
        >
          <Path d="M 0 50 Q 50 0 100 50 Z" fill="black" />
        </Svg>
      </Animated.View>

      <Block flex={false} row style={styles.tabBar}>
        {[
          {
            title: i18n.t("Home"),
            activeIcon: BlackHomeIcon,
            inactiveIcon: HomeIcon,
          },
          {
            title: i18n.t("Explore"),
            activeIcon: BlackExploreIcon,
            inactiveIcon: ExploreIcon,
          },
          {
            title: i18n.t("Profile"),
            activeIcon: BlackProfileIcon,
            inactiveIcon: ProfileIcon,
          },
          {
            title: i18n.t(isUserSubscribed ? "My Selection" : "Full Access"),
            activeIcon: isUserSubscribed
              ? BlackMySelection
              : BlackFullAccessIcon,
            inactiveIcon: isUserSubscribed ? MySelection : FullAccessIcon,
          },
        ].map((tab, index) => (
          <TabItem
            key={index}
            icon={activeTab === index ? tab.activeIcon : tab.inactiveIcon}
            title={tab.title}
            isActive={activeTab === index}
            onPress={() => handleTabPress(index)}
          />
        ))}
      </Block>
      {openSubscriptionModal && (
        <SubscriptionModal
          isVisible={openSubscriptionModal}
          hideModal={() => {
            setOpenSubscriptionModal(false);
          }}
          onSubscribedUser={(plan) => {
            setOpenSubscriptionModal(false);
            setTimeout(() => {
              modal.show(CongratsModal, {
                message:
                  plan == YEARLY || plan == YEARLY_PROMO
                    ? i18n.t("Year Plan Update")
                    : i18n.t("Month Plan Update"),
                btnTitle: "Ok"
              });
            }, 1000);
          }}
        />
      )}
    </Block>
  );
};

const TabItem = ({ icon: IconComponent, title, isActive, onPress }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const translateYValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 0.9,
          friction: 4,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYValue, {
          toValue: -12,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 4,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.tabItem}>
      <Animated.View
        style={[
          styles.tabIconContainer,
          isActive
            ? styles.activeTabIconContainer
            : styles.inactiveTabIconContainer,
          {
            transform: [{ translateY: translateYValue }],
          },
        ]}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleValue }],
          }}
        >
          <IconComponent
            width={27}
            height={27}
            fill={isActive ? "black" : "gray"}
          />
        </Animated.View>
      </Animated.View>

      <Animated.Text
        style={[
          styles.tabText,
          isActive ? styles.activeTabText : styles.inactiveTabText,
          {
            transform: [{ translateY: translateYValue }],
          },
        ]}
      >
        {title}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "black",
    zIndex: 2,
  },
  tabBar: {
    height: TAB_BAR_HEIGHT,
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabIconContainer: {
    width: perfectSize(45),
    height: perfectSize(45),
    justifyContent: "center",
    alignItems: "center",
  },
  activeTabIconContainer: {
    backgroundColor: "white",
    borderRadius: 30,
    marginBottom: 10,
  },
  inactiveTabIconContainer: {
    backgroundColor: "transparent",
    borderRadius: 0,
    marginBottom: 0,
  },
  tabText: {
    fontSize: responsiveScale(11),
    textAlign: "center",
  },
  activeTabText: {
    color: "white",
  },
  inactiveTabText: {
    color: "gray",
  },
  curveContainer: {
    position: "absolute",
    top: -40,
    width: "25%",
    height: 50,
    left: 0,
    alignItems: "center",
  },
  curveSvg: {
    width: "100%",
    height: "100%",
  },
});

export default TabBar;
