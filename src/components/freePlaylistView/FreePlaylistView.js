import { TouchableOpacity, FlatList, Image, View } from "react-native";
import React, { useMemo } from "react";
import Block from "../utilities/Block";
import {
  consoleLog,
  perfectSize,
  responsiveScale,
  scaleFont,
  scaleSize,
} from "../../styles/mixins";
import Text from "../utilities/Text";
import { colors } from "../../styles/theme";
import FreeAudios from "../freeAudios/FreeAudios";
import { useDispatch, useSelector } from "react-redux";
import { setIsFirstFreeAudioPlay } from "../../store/storeAppData/actions/subscriptionAction";
import { useNavigation } from "@react-navigation/native";
import ListEmptyComponent from "../emptyComponent/EmptyComponent";
import { COMING_SOON } from "../../constants/errors";
import i18n from "../../translations/i18n";
import { LogoIcon } from "../common/SvgIcons/Icon";
import { SCREEN_WIDTH } from "../../constants/metrics";

const FreePlaylistView = ({
  freePlaylistsData = [],
  onPressViewAll = () => {},
  selectedLanguage = "en",
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isUserSubscribed = useSelector(
    (state) => state?.subscription?.isUserSubscribed
  );

  const handlePlaylistSelection = (item, title = "") => {
    if (!isUserSubscribed) {
      dispatch(setIsFirstFreeAudioPlay(true));
    }
    consoleLog("FreePlaylistView -> handlePlaylistSelection -> title", title);
    const isDeepSleep = title === "deep sleep" || title === "sleep";
    const isDuchess = title === "daily dose from duchess";

    navigation?.navigate("GettingOverplaylist", {
      item,
      isFreeAudio: true,
      isDeepSleep,
      isDuchess,
    });
  };
  return (
    <Block flex={false} marginTop={perfectSize(15)}>
      <Block
        flex={false}
        row
        center
        gap={7}
        paddingHorizontal={perfectSize(28)}
      >
        <Block row style={{ alignItems: "center" }}>
          <LogoIcon height={23} width={26} />
          <Text
            regular
            size={scaleSize(20)}
            color={colors.white}
            style={{
              marginLeft: SCREEN_WIDTH * 0.02,
              width: SCREEN_WIDTH * 0.48,
            }}
            numberOfLines={2}
          >
            {i18n.t("Free Audio")}
          </Text>
        </Block>
        <TouchableOpacity
          style={{
            alignSelf: "baseline",
          }}
          onPress={onPressViewAll}
          activeOpacity={1}
        >
          <Text
            regular
            size={responsiveScale(18)}
            weight={"400"}
            color={colors.white}
            numberOfLines={3}
            style={{ width: scaleSize(100), textAlign: "right" }}
          >
            {i18n.t("View More")}
            {/* {i18n.t("View All")} */}
          </Text>
        </TouchableOpacity>
      </Block>

      <FlatList
        data={freePlaylistsData?.slice(0, 4)}
        ItemSeparatorComponent={<View style={{ height: perfectSize(15) }} />}
        renderItem={({ item }) => {
          const title =
            item?.[`title_${selectedLanguage?.toUpperCase()}`] ||
            item?.title_EN ||
            item?.title;

          const description =
            item?.[`description_${selectedLanguage?.toUpperCase()}`] ||
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
                // width: "100%",
                marginTop: perfectSize(0),
              }}
              extraTitleStyle={{
                fontSize: scaleSize(20),
                // lineHeight: scaleSize(20),
              }}
              extraDescriptionTextStyle={{
                fontSize: responsiveScale(14),
              }}
              onPress={() =>
                handlePlaylistSelection(item, title?.toLowerCase())
              }
              numberOfLines={3}
            />
          );
        }}
        keyExtractor={(item) => item.id}
        // contentContainerStyle={{ marginTop: perfectSize() }}
        // contentContainerStyle={{ marginTop: perfectSize(15) }}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={() => <ListEmptyComponent message={COMING_SOON} />}
      />
    </Block>
  );
};

export default FreePlaylistView;
