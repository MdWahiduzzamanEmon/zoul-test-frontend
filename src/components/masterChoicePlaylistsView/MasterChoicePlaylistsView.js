import { FlatList, TouchableOpacity, View } from "react-native";
import React from "react";
import Block from "../utilities/Block";
import Text from "../utilities/Text";
import { colors } from "../../styles/theme";
import i18n from "../../translations/i18n";
import FreeAudios from "../freeAudios/FreeAudios";
import {
  perfectSize,
  responsiveScale,
  scaleFont,
  scaleSize,
} from "../../styles/mixins";
import ListEmptyComponent from "../emptyComponent/EmptyComponent";
import { LogoIcon } from "../common/SvgIcons/Icon";
import {
  COMING_SOON,
  NEW_AUDIOS_COMING_SOON,
  NEW_PLAYLIST_COMING_SOON,
} from "../../constants/errors";
import { removeItem } from "../../utils/utils";
import { FIRST_PLAYLIST_ID } from "../../constants/constant";
import { useSelector } from "react-redux";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";

const MasterChoicePlaylistsView = ({
  masterChoicePlaylistdata = [],
  selectedLanguage = "en",
  onPressViewAll = () => {},
  onPress = () => {},
  title = i18n.t("Master Choice Playlists"),
  visibleTitle = true,
  isPremium = false,
}) => {
  const isUserSubscribed = useSelector(
    (state) => state?.subscription?.isUserSubscribed
  );

  return (
    <Block flex={false} marginTop={perfectSize(25)}>
      {visibleTitle ? (
        <>
          <Block
            flex={false}
            row
            gap={7}
            paddingHorizontal={perfectSize(28)}
            between
          >
            <Block
              // flex={false}
              row
              center
              gap={7}
              // paddingHorizontal={perfectSize(28)}
            >
              <LogoIcon height={23} width={26} />
              <Text
                regular
                size={scaleSize(20)}
                color={colors.white}
                numberOfLines={2}
                style={{ width: SCREEN_WIDTH * 0.48 }}
              >
                {title}
              </Text>
            </Block>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
              }}
              onPress={onPressViewAll}
              activeOpacity={1}
            >
              {/* onPress={onPressViewAll} activeOpacity={1}> */}
              <Text
                regular
                size={scaleSize(18)}
                weight={"400"}
                color={colors.white}
                numberOfLines={2}
                style={{ width: SCREEN_WIDTH * 0.25, textAlign: "right" }}
              >
                {/* {i18n.t("View More")} */}
                {i18n.t("View All")}
              </Text>
            </TouchableOpacity>
          </Block>
          {/* <Block
            flex={false}
            row
            center
            gap={7}
            paddingHorizontal={perfectSize(28)}
          >
            <LogoIcon height={23} width={26} />
            <Text regular size={scaleSize(20)} color={colors.white}>
              {title}
            </Text>
          </Block> */}
        </>
      ) : null}
      <FlatList
        data={removeItem(
          masterChoicePlaylistdata,
          FIRST_PLAYLIST_ID,
          isUserSubscribed
        )}
        ItemSeparatorComponent={<View style={{ height: perfectSize(15) }} />}
        renderItem={({ item }) => {
          const title =
            item?.[`title_${selectedLanguage.toUpperCase()}`] ||
            item?.title_EN ||
            item?.title;

          const description =
            item?.[`description_${selectedLanguage.toUpperCase()}`] ||
            item?.description_EN ||
            item?.description;
          return (
            <FreeAudios
              title={title}
              image={item?.coverImage}
              description={description}
              extraMainViewStyle={{
                // marginBottom: perfectSize(30),
                paddingHorizontal: perfectSize(28),
              }}
              extraplaylistContainerStyle={{
                width: "100%",
                marginTop: perfectSize(0),
              }}
              extraTitleStyle={{
                fontSize: scaleSize(20),
                // lineHeight: scaleSize(20),
              }}
              extraDescriptionTextStyle={{
                fontSize: responsiveScale(14),
              }}
              onPress={() => onPress(item)}
              // numberOfLines={3}
              isPremium={isPremium}
            />
          );
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ marginTop: perfectSize(15) }}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={() => <ListEmptyComponent message={COMING_SOON} />}
      />
    </Block>
  );
};

export default MasterChoicePlaylistsView;
