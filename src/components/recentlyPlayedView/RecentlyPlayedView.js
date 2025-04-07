import React, { memo } from "react";
import Block from "../utilities/Block";
import FreeAudios from "../freeAudios/FreeAudios";
import {
  perfectSize,
  responsiveScale,
  scaleFont,
  scaleSize,
} from "../../styles/mixins";
import i18n from "../../translations/i18n";

const RecentlyPlayedView = ({
  bannerImage = "",
  recentlyPlayedAudios = {},
  onPress = () => {},
}) => {
  return (
    <Block>
      <FreeAudios
        title={i18n.t("Recently Played")}
        image={bannerImage ?? recentlyPlayedAudios?.audios[0]?.bannerImage}
        description={""}
        extraplaylistContainerStyle={{ width: "100%" }}
        extraTitleStyle={{ fontSize: scaleSize(20), 
          // lineHeight: scaleSize(20)
         }}
        onPress={onPress}
        numberOfLines={3}
        extraMainViewStyle={{
          marginTop: perfectSize(25),
          paddingLeft: perfectSize(23),
          paddingRight: perfectSize(22),
        }}
        noPlayIcon={true}
      />
    </Block>
  );
};

export default memo(RecentlyPlayedView);
