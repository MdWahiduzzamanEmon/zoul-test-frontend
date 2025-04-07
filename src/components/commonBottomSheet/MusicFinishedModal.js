import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import CloseImg from "../../assets/appImages/svgImages/CloseImg";
import GuestPassIcon from "../../assets/appImages/svgImages/GuestPassIcon";
import { perfectSize, responsiveScale } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import Block from "../utilities/Block";
import Text from "../utilities/Text";

const backgroundImages = [
  require("../../assets/appImages/PopupSubscriptionBG1.png"),
  require("../../assets/appImages/PopupSubscriptionBG2.png"),
  require("../../assets/appImages/PopupSubscriptionBG3.png"),
];

const MusicFinishedModal = ({ visible, nextModalVisible, handleClose }) => {
  const [backgroundImage, setBackgroundImage] = useState(backgroundImages[0]);

  useEffect(() => {
    if (visible) {
      const randomImage =
        backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
      setBackgroundImage(randomImage);
    }
  }, [visible]);

  const onClose = () => {
    handleClose();
  };

  return (
    <>
      {/* First Modal */}
      <Modal
        transparent={true}
        visible={visible && !nextModalVisible}
        animationType="slide"
        onRequestClose={onClose}
      >
        <Block flex={1}>
          <ImageBackground
            source={backgroundImage}
            resizeMode="stretch"
            style={{ flex: 1, width: "100%", height: "100%" }}
          >
            <TouchableOpacity style={styles.skipTextView} onPress={onClose}>
              <Text regular color={colors.kPinkRose} size={responsiveScale(18)}>
                Skip
              </Text>
              <CloseImg style={styles.closeButtonView} />
            </TouchableOpacity>

            <Block flex={1} middle style={styles.subscriptionModalContainer}>
              <Block flex={false}>
                <GuestPassIcon height={45} width={58} />
              </Block>
              <Block
                flex={false}
                margin={[
                  perfectSize(15),
                  perfectSize(0),
                  perfectSize(40),
                  perfectSize(0),
                ]}
              >
                <Text medium color={colors.white} size={responsiveScale(30)}>
                  Ancient wisdom, modern techniques, proven results.
                </Text>
              </Block>
              <Text medium color={colors.white} size={responsiveScale(30)}>
                Tap into your{"\n"}higher self.{"\n"}Now!
              </Text>
            </Block>
          </ImageBackground>
        </Block>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  loaderView: {
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
  },
  skipTextView: {
    marginTop: "15%",
    marginHorizontal: perfectSize(16),
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
  closeButtonView: {
    marginLeft: perfectSize(5),
  },
  subscriptionModalContainer: {
    width: "100%",
    paddingHorizontal: perfectSize(16),
    paddingBottom: perfectSize(20),
  },
  promoCodeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: perfectSize(10),
    backgroundColor: "#FFFFFF66",
    padding: perfectSize(10),
    borderRadius: perfectSize(5),
  },
  gemImage: { marginRight: perfectSize(10) },
  featureContainer: {
    marginVertical: perfectSize(20),
  },
  priceContainer: {
    marginVertical: perfectSize(7),
    paddingHorizontal: perfectSize(10),
    paddingVertical: perfectSize(7),
    borderRadius: perfectSize(4),
    flexDirection: "row",
  },
  subscribeButton: {
    backgroundColor: colors.white,
    paddingVertical: perfectSize(12),
    borderRadius: perfectSize(10),
    alignItems: "center",
    marginVertical: perfectSize(20),
  },
  priceText: {
    marginHorizontal: perfectSize(10),
  },
  mostPopularView: {
    alignSelf: "flex-end",
    paddingHorizontal: perfectSize(10),
    paddingVertical: perfectSize(7),
    borderRadius: perfectSize(4),
    zIndex: 99,
    top: perfectSize(15),
    right: perfectSize(15),
  },
  termView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: perfectSize(5),
  },
});

export default MusicFinishedModal;
