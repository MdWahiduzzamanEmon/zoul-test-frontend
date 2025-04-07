import React, { useRef, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import Block from "../../components/utilities/Block";
import { perfectSize, responsiveScale } from "../../styles/mixins";
import BackIcon from "../../assets/appImages/svgImages/BackIcon";
import { colors, deviceHeight, deviceWidth } from "../../styles/theme";
import CustomDropDown from "../../components/customDropDown/CustomDropDown";
import Text from "../../components/utilities/Text";
import { handleLanguageChange } from "../../helpers/app";
import { useDispatch } from "react-redux";
import { useLocale } from "../../context/LocaleProvider";
import RNRestart from "react-native-restart";
import { storeLanguage } from "../../helpers/auth";

const GoalsCategoriesScreen = ({ route, navigation }) => {
  const { goalsCategoriesitem } = route.params;

  const dispatch = useDispatch();
  const { changeLocale } = useLocale();
  return (
    <Block flex={1}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ImageBackground
        source={require("../../assets/appImages/ExploreBackgroundImage.png")}
        resizeMode="stretch"
        style={styles.bgImage}
      >
        <Block flex={1} style={styles.mainView}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backIconView}
          >
            <BackIcon height={18} width={11} />
          </TouchableOpacity>
          {/* header View */}
          <Block flex={false} row between style={styles.headerContainer} center>
            <Text
              regular
              size={responsiveScale(28)}
              color={colors.white}
              width={"65%"}
            >
              {goalsCategoriesitem?.userGoal}
            </Text>

            <Block flex={false}>
              <CustomDropDown
                onChange={async (lg) => {
                  await storeLanguage("SET", lg);
                  handleLanguageChange(lg, dispatch, changeLocale);
                  RNRestart.Restart();
                }}
              />
            </Block>
          </Block>
        </Block>
      </ImageBackground>
    </Block>
  );
};

export default GoalsCategoriesScreen;

const styles = StyleSheet.create({
  mainView: {
    marginTop: "15%",
  },
  bgImage: {
    flex: 1,
    // height: deviceHeight * 1,
    // width: deviceWidth,
  },
  headerContainer: {
    marginTop: perfectSize(15),
    paddingHorizontal: perfectSize(16),
  },
  backIconView: {
    width: perfectSize(30),
    height: perfectSize(30),
    paddingHorizontal: perfectSize(16),
  },
});
