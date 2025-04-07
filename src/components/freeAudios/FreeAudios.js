import React, { memo, useEffect } from "react";
import { Platform, StyleSheet, TouchableOpacity, Text } from "react-native";
import Block from "../../components/utilities/Block";
import {
  perfectSize,
  responsiveScale,
  scaleFont,
  scaleSize,
} from "../../styles/mixins";
import { colors, font } from "../../styles/theme";
import { BlurView } from "@react-native-community/blur";
import PlayIcon from "../../assets/appImages/svgImages/PlayIcon.svg";
import ResetIcon from "../../assets/appImages/svgImages/ResetIcon.svg";
import Play from "../../assets/icons/play.svg";
import FastImage from "react-native-fast-image";
import i18n from "../../translations/i18n";
import { getTransformedUrl } from "../../utils/ImageService";
import LinearGradient from "react-native-linear-gradient";
import PremiumTag from "../../assets/appImages/svgImages/premiumTag.svg";
import { SCREEN_WIDTH } from "../../constants/metrics";

const FreeAudios = ({
  title,
  image,
  extraplaylistContainerStyle,
  description,
  extraTitleStyle,
  extraDescriptionTextStyle,
  isDescription = true,
  extraimageBackgroundStyle,
  onPress = () => {},
  onPressLoop = () => {},
  isShowAudioContent = true,
  isBlurView = true,
  isshowResetIcon = false,
  showDescription = false,
  isLoop = false,
  dataLength,
  numberOfLines,
  extraMainViewStyle,
  isPremium,
  fromExplore,
  noPlayIcon,
}) => {
  const imageUri =
    typeof image === "string"
      ? { uri: getTransformedUrl(image) }
      : require("../../assets/appImages/RecentlyPlayedImg.png");

  const imageOpacity = title ? 0.9 : 1;
  return (
    <Block flex={false}>
      {isPremium && (
        <Block
          flex={false}
          style={{
            position: "absolute",
            alignSelf: "flex-start",
            left: fromExplore ? perfectSize(-2) : perfectSize(16),
            top: perfectSize(13),
            zIndex: fromExplore ? 5 : 5,
          }}
        >
          <PremiumTag />
        </Block>
      )}
      <Block
        flex={false}
        style={[
          extraMainViewStyle,
          {
            // backgroundColor:"pink"
            // height: perfectSize(120),
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            onPress();
          }}
          activeOpacity={1}
        >
          <Block
            flex={false}
            style={[
              styles.playlistContainer,
              extraplaylistContainerStyle,
              {
                width: "100%",
                // height:SCREEN_WIDTH*0.2
                aspectRatio: 16 / 6,
                // borderRadius: perfectSize(10),
              },
            ]}
          >
            <FastImage
              source={imageUri}
              resizeMode="cover"
              style={[
                styles.imageBackground,
                extraimageBackgroundStyle,
                {
                  opacity: imageOpacity,
                },
              ]}
            />
            <LinearGradient
              colors={["rgba(0, 0, 0, 0.22)", "rgba(0, 0, 0, 0.02)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              locations={[0.3626, 0.9806]}
              style={styles.gradient}
            />
            <Block
              flex={false}
              style={[
                styles.contentView,
                {
                  // height:SCREEN_WIDTH*0.1
                },
              ]}
            >
              {isshowResetIcon && (
                <TouchableOpacity
                  onPress={() => onPressLoop()}
                  style={[
                    isLoop && styles.isActiveRepeat,
                    {
                      alignSelf: "flex-end",
                      right: perfectSize(10),
                      top: perfectSize(10),
                    },
                  ]}
                >
                  <Block flex={false}>
                    <ResetIcon height={48} width={48} />
                  </Block>
                </TouchableOpacity>
              )}
              {!noPlayIcon && (
                <Block
                  flex={false}
                  style={{
                    alignSelf: "center",
                    top: "40%",
                    position: "absolute",
                  }}
                >
                  <Play height={30} width={30} />
                </Block>
              )}
              <Block flex={1} bottom>
                {/* {isPremium ? (
                  <Text
                    style={{
                      paddingLeft: perfectSize(8),
                      color: "rgba(255, 255, 255, 0.9)",
                      fontSize: responsiveScale(12),
                      fontWeight: "400",
                    }}
                  >
                    Book of
                  </Text>
                ) : null} */}
                <Text
                  numberOfLines={2}
                  style={[styles.numberText, extraTitleStyle]}
                >
                  {title}
                </Text>
              </Block>

              {/* {isBlurView && (
                <TouchableOpacity
                  style={styles.infoContainer}
                  onPress={() => {
                    onPress();
                  }}
                > */}
              {/* {Platform.OS === "ios" ? (
                    <BlurView
                      style={styles.absolute}
                      blurType="light"
                      blurAmount={4.43}
                    />
                  ) : (
                    <BlurView
                      blurType="light"
                      blurRadius={5}
                      overlayColor="transparent"
                      style={styles.absolute}
                    />
                  )} */}

              {/* {isShowAudioContent ? (
                    <Block flex={false} row center middle>
                      <TouchableOpacity>
                        <PlayIcon height={20} width={20} />
                      </TouchableOpacity>
                      <Text style={styles.titleText}>
                        {i18n.t("Playlist Contents")}
                      </Text>
                    </Block>
                  ) : (
                    <Block flex={1} row between>
                      <Text style={styles.titleText}>
                        {dataLength ? `${dataLength} audio files` : null}
                      </Text>
                    </Block>
                  )} */}
              {/* </TouchableOpacity>
              )} */}
            </Block>
          </Block>
        </TouchableOpacity>

        {isDescription && description && showDescription && (
          <Text
            style={[styles.descriptionText, extraDescriptionTextStyle]}
            numberOfLines={numberOfLines}
          >
            {description}
          </Text>
        )}
      </Block>
    </Block>
  );
};

export default memo(FreeAudios);

const styles = StyleSheet.create({
  playlistContainer: {
    // marginTop: perfectSize(24),
    borderRadius: perfectSize(10),
    overflow: "hidden",
    aspectRatio: 16 / 9,
    width: "100%",
  },
  imageBackground: {
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
    borderRadius: perfectSize(10),
    overflow: "hidden",
  },
  numberText: {
    marginHorizontal: perfectSize(8),
    marginBottom: perfectSize(8),
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: scaleSize(20),
    fontFamily: font.regular,
    fontWeight: "400",
  },
  infoContainer: {
    paddingHorizontal: perfectSize(12),
    flexDirection: "row",
    paddingVertical: perfectSize(7),
  },
  titleText: {
    marginLeft: perfectSize(7),
    color: colors.white,
    fontSize: responsiveScale(12),
    fontFamily: font.regular,
    fontWeight: "400",
  },
  descriptionText: {
    marginTop: perfectSize(10),
    color: colors.white,
    fontSize: responsiveScale(14),
    fontFamily: font.regular,
    fontWeight: "400",
  },
  absolute: {
    position: "absolute",
    top: perfectSize(0),
    left: perfectSize(0),
    bottom: perfectSize(0),
    right: perfectSize(0),
  },
  androidBlurBackground: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  gradient: {
    height: "40%",
    width: "100%",
    borderRadius: perfectSize(10),
    position: "absolute", // Ensures the gradient is above the image
  },
  contentView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  isActiveRepeat: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 25,
  },
});
