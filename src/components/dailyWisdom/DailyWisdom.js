import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Block from "../utilities/Block";
import Text from "../utilities/Text";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import moment from "moment";
import SpinnerLoader from "../progressBar/SpinnerLoader";
import ShareIcon from "../../assets/appImages/svgImages/ShareIcon.svg";
import { colors } from "../../styles/theme";
import { getTransformedUrl } from "../../utils/ImageService";

const DailyWisdom = ({
  isSharing = false,
  shareImage = () => {},
  getDailyWisdomData = {},
  onLayout,
}) => {
  return (
    <Block
      flex={false}
      style={[styles.PosterImageContainer]}
      onLayout={onLayout}
    >
      <ImageBackground
        source={{ uri: getTransformedUrl(getDailyWisdomData?.image) }}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <Block flex={1} padding={[perfectSize(12)]}>
          <Block flex={false}>
            <Text
              regular
              right
              weight={"400"}
              size={scaleSize(12)}
              color={colors.white}
            >
              {moment(getDailyWisdomData?.date).format("dddd, D MMMM")}
            </Text>
          </Block>
          <TouchableOpacity
            style={styles.shareIconView}
            onPress={shareImage}
            disabled={isSharing}
          >
            {isSharing ? (
              <SpinnerLoader />
            ) : (
              <ShareIcon height={35} width={36} />
            )}
          </TouchableOpacity>
        </Block>
      </ImageBackground>
    </Block>
  );
};

export default DailyWisdom;

const styles = StyleSheet.create({
  PosterImageContainer: {
    marginTop: perfectSize(27),
  },

  imageBackground: {
    aspectRatio: 16 / 12,
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },

  shareIconView: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flex: 1,
  },
});
