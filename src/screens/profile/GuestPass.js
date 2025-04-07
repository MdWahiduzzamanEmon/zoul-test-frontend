import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors, deviceHeight, deviceWidth } from "../../styles/theme";
import GuestPassIcon from "../../assets/appImages/svgImages/GuestPassIcon.svg";
import i18n from "../../translations/i18n";
import CloseIcon from "../../assets/icons/ic_sharp-close.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Backgrounds } from "../../data/background";
import { guestPass } from "../../resources/baseServices/app";
import { useModal } from "../../context/ModalContext";
import { useDispatch } from "react-redux";
import { ErrorDialog } from "../../components/modal/Modal";
import Share from "react-native-share";
import GuestPassModal from "../../components/modal/GuestPassModal";
import {
  ERROR_CONTACT_SUPPORT_MESSAGE,
  ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
} from "../../constants/errors";

const GuestPass = ({ navigation }) => {
  const { top, bottom } = useSafeAreaInsets();
  const modal = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const buttonBottom = 55 - bottom;
  const [isShowContent, setIsShowContent] = useState(true);

  const fetchGuestPass = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await guestPass();
      if (res?.data?.response?.shortLink) {
        const shareOptions = {
          message: `I‘d like to help you de-stress, sleep better, and find happiness. Enjoy a Guest Pass for a free month of Zoul—where ancient wisdom meets modern techniques.`,
          url: res?.data?.response?.shortLink,
        };
        await Share.open(shareOptions).then(() => {
          setIsShowContent(false);
        });
        modal.show(GuestPassModal, {
          message: "You’ve already shared the Zoul journey with your friends.",
          onConfirm: () => {
            modal.close();
            setIsShowContent(true);
          },
          setIsShowContent: setIsShowContent,
        });
      }
    } catch (error) {
      if (error.message == "User did not share") {
        console.error("An error occurred while sharing:", error);
      } else {
        console.error("error while guest pass =--->", error);
        modal.show(ErrorDialog, {
          messageTitle:
            error?.response?.data?.errorTitle ??
            ERROR_CONTACT_SUPPORT_MESSAGE_TITLE,
          message:
            error?.response?.data?.errorBody ?? ERROR_CONTACT_SUPPORT_MESSAGE,
          onConfirm: () => modal.close(),
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ImageBackground
      source={
        Backgrounds.guestPassBgImage ??
        require("../../assets/appImages/GuestPass.png")
      }
      resizeMode="cover"
      style={[
        styles.bgImage,
        {
          paddingTop: top,
          paddingBottom: bottom,
        },
      ]}
    >
      <Block flex={1}>
        <Block
          flex={false}
          margin={[0, scaleSize(20), scaleSize(5), scaleSize(20)]}
        >
          <Block flex={false} gap={3} row right>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text size={scaleSize(18)} regular weight={400} color={"#DFCBCD"}>
                {i18n.t("Skip")}
              </Text>
            </TouchableOpacity>
            <CloseIcon height={28} />
          </Block>
        </Block>
        <Block flex={false} row left gap={16} margin={[0, scaleSize(20)]}>
          <Block flex={false} marginTop={scaleSize(4)}>
            <GuestPassIcon height={42} width={53} />
          </Block>
          <Block flex={1}>
            <Text
              size={scaleSize(36)}
              regular
              weight={500}
              color={colors.white}
              style={{ letterSpacing: -1 }}
            >
              {i18n.t("Zoul 30-Day Guest Pass")}
            </Text>
          </Block>
        </Block>
        {isShowContent && (
          <>
            <Block
              flex={1}
              padding={[0, scaleSize(25), 0, scaleSize(30)]}
              bottom
            >
              <Block flex={false}>
                <Text
                  size={scaleSize(26)}
                  regular
                  weight={400}
                  color={colors.white}
                  style={{ lineHeight: scaleSize(33.8) }}
                >
                  Help a friend de-stress, sleep better, and find happiness.
                  Share a Guest Pass for a free month of ZOUL—where ancient
                  wisdom meets modern techniques.
                </Text>
              </Block>
              <Block flex={false}>
                <Text
                  size={scaleSize(22)}
                  regular
                  weight={600}
                  color={colors.white}
                  marginTop={scaleSize(17)}
                  style={{ letterSpacing: -1 }}
                >
                  Meditation | Sleep Aid | 24/7
                </Text>
                <Text
                  size={scaleSize(22)}
                  regular
                  weight={600}
                  color={colors.white}
                  style={{ letterSpacing: -1 }}
                >
                  Life Coach
                </Text>
              </Block>
            </Block>
            <Block
              flex={false}
              margin={[scaleSize(23), 0, scaleSize(buttonBottom), 0]}
              padding={[0, scaleSize(20), 0, perfectSize(20)]}
            >
              <TouchableOpacity
                style={[
                  styles.guestPassButton,
                  {
                    backgroundColor: "#6B0021",
                  },
                ]}
                onPress={fetchGuestPass}
              >
                {isLoading ? (
                  <Block flex={false}>
                    <ActivityIndicator size={25} color={colors.white} />
                  </Block>
                ) : (
                  <Text size={scaleSize(20)} medium color={colors.white}>
                    {i18n.t("Refer A Friend Now")}
                  </Text>
                )}
              </TouchableOpacity>
            </Block>
          </>
        )}
      </Block>
    </ImageBackground>
  );
};
export default GuestPass;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  guestPassButton: {
    alignItems: "center",
    justifyContent: "center",
    height: perfectSize(56),
    borderRadius: perfectSize(8),
    width: "100%",
  },
});
