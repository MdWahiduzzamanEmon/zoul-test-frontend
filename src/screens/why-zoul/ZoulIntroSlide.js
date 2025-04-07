import React from "react";
import Text from "../../components/utilities/Text";
import { scaleSize } from "../../styles/mixins";
import Block from "../../components/utilities/Block";
import { colors } from "../../styles/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { isIOS } from "../../utils/platform";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import i18n from "../../translations/i18n";
import { Image, ScrollView } from "react-native";
import { Backgrounds } from "../../data/background";
import LogoIcon from "../../components/common/SvgIcons/LogoIcon";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { Text as Text1 } from 'react-native'

const ZoulIntroSlide = ({ item }) => {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <Block
      flex={1}
      padding={[
        0,
        scaleSize(item.padding.paddingRight),
        0,
        scaleSize(item.padding.paddingLeft),
      ]}
      style={{
        paddingTop: top,
        paddingBottom: bottom,
        backgroundColor: "rgba(0,0,0,0)",
      }}
    >
      <Block flex={1}>
        <Block row flex={false} style={{alignItems:'center'}} top margin={[scaleSize(107 - top), 0, 0, 0]}>
          <Block flex={false} margin={[ 0,scaleSize(8),0, 0]}>
          <LogoIcon
            width={item.sectionType === "zoulIntro" && 52}
            height={item.sectionType === "zoulIntro" && 40.19}
          />
          </Block>
          <Text
            size={scaleSize(item.title.textSize)}
            weight={500}
            regular
            numberOfLines={2}
            color={colors.white}
            style={{width:SCREEN_WIDTH*0.7}}
            // allowFontScaling={true}
          >
            {i18n.t(item.title.text)}
          </Text>
          {/* <Text1 style={{}} ></Text1> */}
        </Block>

        {/* <Block flex={1}> */}

        <Block flex={false}>
          
          <ScrollView
            // behavior={isIOS ? "padding" : "height"}
            // bounces={false}
            showsVerticalScrollIndicator={false}
            style={{height:SCREEN_HEIGHT*0.65,width:SCREEN_WIDTH*0.8}}
          >
            {!item.isBullet && (
              <>
              {item?.text1?.text ? (
            <Block margin={item.text1.margin} flex={false} bottom>
              <Text
                size={scaleSize(item.text1.textSize)}
                color={colors.white}
                regular
                weight={500}
              >
                {i18n.t(item.text1.text)}
              </Text>
            </Block>
          ) : null}
                {item?.text2?.text ? (
                  <Block flex={false} bottom margin={item.text2.margin}>
                    <Text
                      size={scaleSize(item.text2.textSize)}
                      color={colors.white}
                      regular
                      weight={500}
                    >
                      {i18n.t(item.text2.text)}
                    </Text>
                  </Block>
                ) : null}
                {item?.text3?.text ? (
                  <Block flex={false} bottom margin={item.text3.margin}>
                    <Text
                      size={scaleSize(item.text3.textSize)}
                      color={colors.white}
                      regular
                      weight={500}
                    >
                      {i18n.t(item.text3.text)}
                    </Text>
                  </Block>
                ) : null}
                {item?.text4?.text ? (
                  <Block flex={false} bottom margin={item.text4.margin}>
                    <Text
                      size={scaleSize(item.text4.textSize)}
                      color={colors.white}
                      style={{
                        fontStyle: item?.text4?.fontStyle
                          ? item.text4.fontStyle
                          : "normal",
                      }}
                      weight={500}
                    >
                      {i18n.t(item.text4.text)}
                    </Text>
                  </Block>
                ) : null}
              </>
            )}
            {item.isBullet && (
              <Block flex={false} margin={item.bulletBlockMargin} bottom>
                {item.bulletPoints.map((bullet, index) => (
                  <Block
                    key={index}
                    flex={false}
                    row
                    align="flex-start"
                    margin={item.bulletMargin}
                  >
                    <Text
                      size={scaleSize(8)}
                      color={colors.white}
                      regular
                      weight={500}
                      style={{ marginRight: 8, marginTop: 8 }}
                    >
                      {"\u25CF"} {/* Bullet point symbol */}
                    </Text>
                    <Text
                      size={scaleSize(item.bulletTextSize)}
                      color={colors.white}
                      regular
                      weight={500}
                      style={{ flexShrink: 1 }}
                    >
                      {i18n.t(bullet.text)}
                    </Text>
                  </Block>
                ))}
              </Block>
            )}
            
          </ScrollView>
        </Block>
      </Block>
          <Image
            source={Backgrounds.nameLogo}
            style={{
              height: scaleSize(50),
              width: scaleSize(64),
              alignSelf: "center",
              position: "absolute",
              bottom: scaleSize(20),
            }}
          />
    </Block>
  );
};

export default ZoulIntroSlide;