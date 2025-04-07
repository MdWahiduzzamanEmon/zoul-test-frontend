import React from "react";
import {
  FlatList,
  ImageBackground,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { perfectSize, responsiveScale } from "../../styles/mixins";
import { colors, deviceHeight, deviceWidth } from "../../styles/theme";
import BackIcon from "../../assets/appImages/svgImages/BackIcon.svg";
import SuggestYourPlan from "../../components/suggestYourPlan/SuggestYourPlan";
import ActivityHistoryIcon from "../../assets/appImages/svgImages/ActivityHistoryIcon.svg";

const ActivityHistory = ({ navigation }) => {
  const imageData = [
    {
      title: "April 16",
      data: [
        {
          id: 1,
          title: "Happiness Decoded",
          subtitle: "Mindful Activity",
          duration: "01:23",
          image: require("../../assets/appImages/SunriseImg.png"),
          audio:
            "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
        },
        {
          id: 2,
          title: "Happiness",
          subtitle: "Meditation",
          duration: "01:23",
          image: require("../../assets/appImages/SunriseImg.png"),
        },
        {
          id: 3,
          title: "Finding Happiness at Home",
          image: require("../../assets/appImages/SunriseImg.png"),
        },
        {
          id: 4,
          title: "Happiness",
          subtitle: "Mindful Activity",
          duration: "01:23",
          image: require("../../assets/appImages/SunriseImg.png"),
        },
      ],
    },
    {
      title: "April 15",
      data: [
        {
          id: 1,
          title: "Happiness Decoded",
          subtitle: "Mindful Activity",
          duration: "01:23",
          image: require("../../assets/appImages/SunriseImg.png"),
          audio:
            "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
        },
        {
          id: 2,
          title: "Happiness",
          subtitle: "Meditation",
          duration: "01:23",
          image: require("../../assets/appImages/SunriseImg.png"),
        },
        {
          id: 3,
          title: "Finding Happiness at Home",
          image: require("../../assets/appImages/SunriseImg.png"),
        },
        {
          id: 4,
          title: "Happiness",
          subtitle: "Mindful Activity",
          duration: "01:23",
          image: require("../../assets/appImages/SunriseImg.png"),
        },
      ],
    },
  ];
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
        style={styles.bgImage}
      >
        <Block flex={1}>
          {/* header View */}
          <Block flex={false} style={styles.headerContainer}>
            <Block flex={false} row between center>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackIcon height={32} width={32} />
              </TouchableOpacity>
            </Block>

            <Block
              flex={false}
              row
              center
              style={{ marginTop: perfectSize(10) }}
            >
              <Block flex={false} style={{ marginRight: perfectSize(7) }}>
                <ActivityHistoryIcon />
              </Block>

              <Text medium size={responsiveScale(26)} color={colors.white}>
                Activity History
              </Text>
            </Block>
          </Block>

          {/* Main Banner View */}
          <Block
            flex={1}
            style={[
              styles.PosterImageContainer,
              { paddingHorizontal: perfectSize(18) },
            ]}
          >
            <Text
              regular
              size={responsiveScale(16)}
              color={colors.white}
              style={{
                marginBottom: perfectSize(10),
                marginTop: perfectSize(15),
              }}
            >
              2024
            </Text>

            <Block flex={1} row center style={{ marginTop: perfectSize(10) }}>
              <FlatList
                data={imageData}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => (
                  <Block flex={false} style={styles.sectionContainer}>
                    <Block
                      flex={false}
                      row
                      center
                      style={{
                        marginBottom: perfectSize(10),
                        marginTop: perfectSize(10),
                      }}
                    >
                      <Block
                        flex={false}
                        style={{
                          borderWidth: 1,
                          borderRadius: 10,
                          borderColor: "white",
                          height: perfectSize(8),
                          width: perfectSize(8),
                        }}
                      ></Block>
                      <Text
                        regular
                        size={responsiveScale(15)}
                        color={colors.white}
                        marginLeft={perfectSize(15)}
                      >
                        {item.title}
                      </Text>
                    </Block>
                    <FlatList
                      data={item.data}
                      keyExtractor={(subItem) => subItem.id.toString()}
                      numColumns={2}
                      columnWrapperStyle={styles.row}
                      renderItem={({ item: subItem }) => (
                        <SuggestYourPlan
                          image={subItem.image}
                          title={subItem.title}
                        />
                      )}
                    />
                  </Block>
                )}
                contentContainerStyle={{ paddingBottom: perfectSize(30) }}
                showsVerticalScrollIndicator={false}
              />
            </Block>
          </Block>
        </Block>
      </ImageBackground>
    </Block>
  );
};
export default ActivityHistory;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    // height: deviceHeight,
    // width: deviceWidth,
  },
  headerContainer: {
    marginTop: "13%",
    paddingHorizontal: perfectSize(16),
    paddingVertical: perfectSize(10),
  },

  categoryImageBackground: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
  categoryImageBackgroundBlock: {
    height: perfectSize(180),
  },
  row: {
    justifyContent: "space-between",
  },

  image: {
    height: deviceWidth * 0.3,
    width: deviceWidth * 0.44,
    borderRadius: perfectSize(5),
  },
});
