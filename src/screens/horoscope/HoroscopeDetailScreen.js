import React, { useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CloseImg from "../../assets/appImages/svgImages/CloseImg";
import ShareIcon from "../../assets/appImages/svgImages/ShareIcon";
import * as images from "../../assets/appImages/zodiac_signs/signImages";
import CustomDropDown from "../../components/customDropDown/CustomDropDown";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { formatDate } from "../../constants/languages";
import { useLocale } from "../../context/LocaleProvider";
import {
  buildShortLinkForHoroscope,
  handleLanguageChange,
} from "../../helpers/app";
import { perfectSize, responsiveScale } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import i18n from "../../translations/i18n";
import Share from "react-native-share";
import RNRestart from "react-native-restart";
import { storeLanguage } from "../../helpers/auth";

const HoroscopeDetailScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { changeLocale } = useLocale();

  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state?.userReducer?.userProfile);
  const horoscopeData = useSelector(
    (state) => state?.dailyWisdomReducer?.horoscopeData
  );
  const selectedLanguage = useSelector(
    (state) => state.language.selectedLanguage
  );

  const filteredData = horoscopeData?.filter(
    (item) => item?.language?.toLowerCase() === selectedLanguage?.toLowerCase()
  );

  const onShareHoroscope = async () => {
    try {
      const shareLink = await buildShortLinkForHoroscope("Daily Horoscope");
      console.log("shareLink", shareLink);
      const result = await Share.open({
        message: shareLink,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.error("Error in sharing horoscope", error);
    }
  };

  return (
    <Block flex={1}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={require("../../assets/appImages/HoroscopeBG.png")}
        resizeMode="stretch"
        style={styles.bgImage}
      >
        <Block flex={false} style={styles.container}>
          <Block flex={false} row between>
            <TouchableOpacity onPress={onShareHoroscope}>
              <ShareIcon width={21} height={29} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <CloseImg />
            </TouchableOpacity>
          </Block>
          <Block flex={false} style={styles.header}>
            <Text
              medium
              size={responsiveScale(24)}
              color={colors.white}
              marginBottom={perfectSize(20)}
            >
              {user?.zodiacSign}
            </Text>
            <Text regular size={responsiveScale(15)} color={colors.white}>
              {i18n.t("Horoscope for")} {formatDate(new Date())}
            </Text>
            <Block flex={false} style={styles.horoscopeIcon}>
              {/* <HoroscopeIcon height={110} width={110} />
               */}
              <Image
                source={images[user?.zodiacSign ? user?.zodiacSign : "Libra"]}
                style={{ height: 110, width: 110 }}
              />
            </Block>
          </Block>
          <Block flex={false} style={styles.dropdownView}>
            <CustomDropDown
              onChange={async (lg) => {
                await storeLanguage("SET", lg);
                handleLanguageChange(lg, dispatch, changeLocale);
                RNRestart.Restart();
              }}
            />
          </Block>

          <FlatList
            data={filteredData || []}
            keyExtractor={(item) => item.category}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Block flex={false} style={styles.itemContainer}>
                <Text medium size={responsiveScale(18)} color={colors.white}>
                  {item?.category}
                </Text>
                <Text regular size={responsiveScale(14)} color={colors.white}>
                  {item?.description}
                </Text>
              </Block>
            )}
          />
        </Block>
      </ImageBackground>
    </Block>
  );
};

export default HoroscopeDetailScreen;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    // height: deviceHeight * 1,
    // width: deviceWidth,
  },
  container: {
    flex: 1,
    padding: perfectSize(16),
    marginTop: "10%",
  },
  header: {
    alignItems: "center",
  },
  headerText: {},
  dateText: {
    fontSize: 16,
    color: "white",
  },
  itemContainer: {
    paddingVertical: perfectSize(15),
  },
  dropdownView: {
    alignItems: "flex-end",
    marginBottom: perfectSize(25),
  },
  horoscopeIcon: {
    marginVertical: perfectSize(20),
  },
});
