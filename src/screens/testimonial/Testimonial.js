import React, { useMemo, useRef, useState } from "react";
import Text from "../../components/utilities/Text";
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import Block from "../../components/utilities/Block";
import { colors, font } from "../../styles/theme";
import AppIntroSlider from "react-native-app-intro-slider";
import { slides } from "./TestimonialData";
import { CloseIcon, LogoIcon } from "../../components/common/SvgIcons/Icon";
import ZoulIntroSlide from "../why-zoul/ZoulIntroSlide";
import { useRoute } from "@react-navigation/native";
import i18n from "../../translations/i18n";
import LeftSign from "../../assets/appImages/svgImages/LeftSign.svg";
import RightSign from "../../assets/appImages/svgImages/RightSign.svg";
import { Backgrounds } from "../../data/background";

const OnBoardingTestimonial = ({ navigation }) => {
  const route = useRoute();
  const slider = useRef();
  const { top, bottom } = useSafeAreaInsets();
  const separatedSlides = route?.params?.separatedSlides;
  const dataSlides = separatedSlides || slides;

  const [currentSlide, setCurrentSlide] = useState({
    index: 0,
    sectionType: "",
  });

  const renderItem = ({ item }) => {
    switch (item?.sectionType) {
      case "testimonial":
        return (
          <ImageBackground
            resizeMode="cover"
            source={item?.image}
            style={[styles.imageBackground]}
          >
            <Block
              flex={1}
              width="100%"
              style={{
                paddingTop: top,
                paddingBottom: bottom,
              }}
            >
              <Block flex={1}>
                <Block
                  flex={false}
                  top
                  padding={[0, perfectSize(20), 0, perfectSize(43)]}
                  margin={[scaleSize(102 - top), 0, 0, 0]}
                >
                  <Text
                    size={scaleSize(32)}
                    weight={500}
                    color={colors.white}
                    style={{ letterSpacing: -1, fontFamily: font.medium }}
                  >
                    {i18n.t("User’s Testimonial")}
                  </Text>
                </Block>
                <Block
                  flex={1}
                  gap={scaleSize(item?.gap ? item?.gap : 14)}
                  padding={[
                    0,
                    perfectSize(
                      item?.textPaddingRight ? item?.textPaddingRight : 20
                    ),
                    perfectSize(
                      item?.textPaddingBottom ? item?.textPaddingBottom : 77
                    ),
                    perfectSize(
                      item?.textPaddingLeft ? item?.textPaddingLeft : 43
                    ),
                  ]}
                  bottom
                >
                  <Block flex={1} bottom>
                    <Text
                      size={scaleSize(item?.textSize || 20)}
                      color={colors.white}
                      style={{
                        fontFamily: item?.textFontFamily || font.medium,
                      }}
                      weight={500}
                    >
                      {i18n.t(item.text)}
                    </Text>
                  </Block>
                  <Block flex={false} top gap={scaleSize(5)}>
                    <Text
                      size={scaleSize(item?.subTextSize || 17)}
                      color={colors.white}
                      style={{
                        fontFamily: item?.subTextFontFamily || font.medium,
                      }}
                      weight={400}
                    >
                      {i18n.t(item.subText)}
                    </Text>
                    {item?.icon ? (
                      <Text
                        size={scaleSize(18)}
                        color={colors.white}
                        regular
                        weight={400}
                      >
                        {item.icon}
                      </Text>
                    ) : null}
                  </Block>
                  <Image
                    source={Backgrounds.nameLogo}
                    style={{
                      height: scaleSize(50),
                      width: scaleSize(64),
                      alignSelf: "center",
                      // position: "absolute",
                      marginTop: scaleSize(10),
                      bottom: scaleSize(20),
                    }}
                  />
                  <Block
                    flex={false}
                    style={{
                      position: "absolute",
                      right: 10,
                      bottom: 14,
                    }}
                  >
                    <Text
                      regular
                      color={colors.white}
                      size={responsiveScale(10)}
                    >
                      Users’ photos altered for privacy.
                    </Text>
                  </Block>
                </Block>
              </Block>
            </Block>
          </ImageBackground>
        );
      case "zoulIntro":
        return (
          <ImageBackground
            resizeMode="cover"
            source={item?.image}
            style={[styles.imageBackground]}
          >
            <ZoulIntroSlide item={item} />
          </ImageBackground>
        );
      case "zoulSubscribe":
        return item?.ZoulSubscribe ? (
          <item.ZoulSubscribe navigation={navigation} />
        ) : null;
      // case "subscribe":
      //   return item?.subscribe ? (
      //     <item.subscribe
      //       navigation={navigation}
      //       promoCodeData={promoCodeData}
      //       isVerifiedPromo={isVerifiedPromo}
      //     />
      //   ) : null;
    }
  };
  // console.log(currentSlide.index);
  const onDone = () => {
    const currentSlideData = dataSlides[currentSlide.index];
    if (separatedSlides?.length) {
      navigation.goBack();
    } else if (currentSlide.index == 0 || currentSlide.index == 1) {
      slider.current.goToSlide(
        dataSlides.findIndex(
          (item) => item.title.text === "Creators behind Zoul"
        ),
        true
      );
    } else {
      switch (currentSlideData?.sectionType) {
        case "zoulIntro":
          slider.current.goToSlide(
            dataSlides.findIndex((item) => item.sectionType === "testimonial"),
            true
          );
          break;
        case "testimonial":
          // navigation.navigate("Register");
          navigation.navigate("TabNavigator");
          // console.log("Register");

          break;
      }
    }
  };

  const renderNextButton = () => {
    return (
      <TouchableOpacity
        onPress={() => slider.current.goToSlide(currentSlide.index + 1, true)}
        style={{ position: "absolute", top: "50%", right: 10, zIndex: 1 }}
      >
        <RightSign />
      </TouchableOpacity>
    );
  };

  const renderPrevButton = (goBack) => {
    return (
      <TouchableOpacity
        onPress={() =>
          goBack
            ? goBack()
            : slider.current.goToSlide(currentSlide.index - 1, true)
        }
        style={{ position: "absolute", top: "50%", left: 10, zIndex: 1 }}
      >
        <LeftSign />
      </TouchableOpacity>
    );
  };

  const isFirstSlide = currentSlide.index === 0;
  const isLastSlide = currentSlide.index === dataSlides.length - 1;
  return (
    <>
      {separatedSlides?.length && isFirstSlide
        ? null
        : isFirstSlide
        ? renderPrevButton(navigation.goBack)
        : renderPrevButton()}

      {!isLastSlide && renderNextButton()}
      <Block
        padding={[0, perfectSize(20), 0, perfectSize(40)]}
        flex={1}
        style={[
          styles.navigationContainer,
          {
            paddingTop: top,
          },
        ]}
      >
        <Block
          flex={false}
          width="100%"
          row
          style={{ alignItems: "space-between" }}
          between
          margin={[scaleSize(51 - top), 0, 0, 0]}
        >
          <Block>
            {currentSlide.sectionType == "testimonial" && (
              <LogoIcon
                width={currentSlide.sectionType === "zoulIntro" && 52}
                height={currentSlide.sectionType === "zoulIntro" && 40.19}
              />
            )}
          </Block>
          <TouchableOpacity onPress={onDone} activeOpacity={1}>
            <Block
              flex={false}
              style={{
                borderColor: "rgba(0,0,0,0.3)",
                borderWidth: 1,
                backgroundColor: "rgba(0,0,0,0.3)",
                borderRadius: 20,
                paddingHorizontal: perfectSize(13),
                marginBottom: scaleSize(20),
              }}
              row
              center
              gap={4}
            >
              <Text
                size={responsiveScale(17)}
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
      <AppIntroSlider
        renderItem={renderItem}
        data={dataSlides}
        onSlideChange={(a, b) => {
          const currentSlideData = dataSlides[a];
          setCurrentSlide((prevState) => ({
            ...prevState,
            index: a,
            sectionType: currentSlideData?.sectionType,
          }));
        }}
        showPrevButton={false}
        showNextButton={false}
        showDoneButton={false}
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.dotStyle}
        ref={(ref) => (slider.current = ref)}
      />
    </>
  );
};

export default OnBoardingTestimonial;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  nextButton: {
    height: perfectSize(50),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.buttonBgColor,
    borderRadius: perfectSize(8),
    width: "100%",
  },
  navigationContainer: {
    position: "absolute",
    zIndex: 1,
  },
  dotStyle: {
    display: "none",
  },
});
