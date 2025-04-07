import React from "react";
import {
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import BackIcon from "../../assets/appImages/svgImages/BackIcon";
import { aboutData } from "./aboutData";
import { Backgrounds } from "../../data/background";

const About = ({ navigation }) => {
  const handleSetting = () => {
    navigation.navigate("Settings");
  };

  return (
    <Block flex={1}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={Backgrounds.aboutUsBg}
        resizeMode="stretch"
        style={styles.bgImage}
      >
        <Block flex={1} padding={[0, scaleSize(25), 0, scaleSize(29)]}>
          {/* header View */}
          <Block flex={false} style={styles.headerContainer}>
            <TouchableOpacity onPress={() => handleSetting()}>
              <BackIcon height={32} width={32} />
            </TouchableOpacity>
            <Block flex={false} style={{ marginTop: perfectSize(10) }}>
              <Text medium size={responsiveScale(32)} color={colors.white}>
                About
              </Text>
            </Block>
          </Block>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: perfectSize(40) }}
          >
            <Block flex={1} gap={scaleSize(13)}>
              {aboutData.map((text, index) => (
                <Text
                  key={index}
                  regular
                  size={responsiveScale(22)}
                  color={colors.white}
                >
                  {text}
                </Text>
              ))}
            </Block>
            {/* <Block flex={1}>
              <Text regular size={responsiveScale(17)} color={colors.white}>
                Making a positive impact on the environment, social
                responsibility, and good governance (ESG) is not just a topic
                for discussion but an underlying consideration in all that we
                touch.
              </Text>
            </Block> */}
            {/* 
            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                Zoul's mission is committed to making this happen here and now.
                We start by creating audio content that enhances awareness and
                fosters the implementation of sustainability, equality, and
                goodness, impacting the behaviors of millions of listeners
                worldwide.
              </Text>
            </Block>

            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                In creating Zoul, we involve people of all nationalities, races,
                religions, and genders, thereby promoting equality of
                opportunity for all to be part of making this world a better
                place.
              </Text>
            </Block>

            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                While data quality, reliability, and greenwashing can pose
                challenges to the accurate measurement of ESG criteria, Zoul
                believes that ESG can be achieved through the world population’s
                strong mental health and wellness. Mental strength and wellness
                lead to non-discrimination and consideration of the human race
                as a whole. Every piece of Zoul content is built on the
                principle of gratitude, recognizing that everything we consume
                is derived from the earth and other human beings.
              </Text>
            </Block>

            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                This profound gratitude can be cultivated through mindfulness,
                even in simple acts like drinking clean water and being
                thankful, recognizing how interconnected we all are.
              </Text>
            </Block>

            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                Seeing oneself as part of the whole, and the whole as part of
                oneself. Recognizing the sufferings of others as our own and the
                happiness of others as our family’s happiness.
              </Text>
            </Block>

            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                That is how and where true ESG begins.
              </Text>
            </Block>
            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                Note: In practicing what we believe, Zoul stands behind the
                initiation of the global event of World Depression Care Day
                (WCD), making giving love, support, and care to others, bringing
                the world together, creating self-generating joy and sustainable
                long-lasting wellness for all our Zoul DNA.
              </Text>
            </Block> */}
          </ScrollView>
        </Block>
      </ImageBackground>
    </Block>
  );
};
export default About;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  headerContainer: {
    marginTop: "18%",
    paddingBottom: perfectSize(24),
  },
});
