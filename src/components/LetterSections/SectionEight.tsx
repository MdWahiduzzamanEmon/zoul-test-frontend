import { perfectSize, scaleSize } from "../../styles/mixins";
import { colors, font } from "../../styles/theme";
import { generateLineHeight } from "../../utils/utils";
import Block from "../utilities/Block";
import Text from "../utilities/Text";
import { isIOS } from "../../utils/platform";
import i18n from "../../translations/i18n";

const SectionEight = () => {
  return (
    <Block flex={1} marginTop={scaleSize(46)}>
      <Block flex={false} padding={[0, perfectSize(5), 0, perfectSize(5)]}>
        <Text
          size={scaleSize(30)}
          style={{
            fontFamily: font.Caveat_Regular,
            paddingTop: perfectSize(10),
            lineHeight: generateLineHeight(scaleSize(30), 120),
          }}
          center
          color={colors.white}
        >
          {i18n.t("And we will carry on")}
        </Text>
      </Block>

      <Block
        flex={false}
        marginTop={scaleSize(18)}
        padding={[0, perfectSize(19), 0, perfectSize(14)]}
      >
        <Text
          size={scaleSize(16)}
          center
          color={colors.sandBrown}
          regular
          style={{
            lineHeight: generateLineHeight(scaleSize(16), 145),
          }}
        >
          {i18n.t("I hope to see you on my travels")}{" "}
          <Text
            color={colors.white}
            style={{
              lineHeight: generateLineHeight(scaleSize(24), 145),
              fontFamily: font.Playfair_Display_Medium,
            }}
            size={scaleSize(24)}
          >
            {i18n.t("Zoul")}.
          </Text>
        </Text>
      </Block>

      <Block
        flex={false}
        marginTop={scaleSize(5)}
        padding={
          isIOS
            ? [perfectSize(16), perfectSize(23), 0, perfectSize(16)]
            : [0, perfectSize(23), 0, perfectSize(16)]
        }
      >
        <Text
          size={scaleSize(16)}
          color={colors.vintageTan}
          center
          style={{
            lineHeight: generateLineHeight(scaleSize(16), 130),
            fontFamily: font.bold,
          }}
        >
          {i18n.t("Heres to wellness, caring for ourselves")}
        </Text>
      </Block>

      <Block
        flex={false}
        marginTop={scaleSize(31)}
        padding={[0, perfectSize(87), 0, perfectSize(85)]}
      >
        <Text
          size={scaleSize(23)}
          center
          color={colors.white}
          regular
          style={{
            lineHeight: generateLineHeight(scaleSize(23), 130),
            fontFamily: font.optinoval,
          }}
        >
          {i18n.t("​Much love")}
        </Text>
      </Block>

      <Block
        flex={1}
        marginTop={scaleSize(3)}
        padding={[0, perfectSize(32), perfectSize(83), perfectSize(24)]}
      >
        <Text
          size={scaleSize(42)}
          center
          color={colors.sandBrown}
          style={{
            marginBottom: perfectSize(-12),
            fontFamily: font.Beyond_Infinity_Demo,
          }}
        >
          {i18n.t("Sarah")}
        </Text>
        <Text
          size={scaleSize(20)}
          center
          color={colors.sandBrown}
          regular
          style={{
            lineHeight: generateLineHeight(scaleSize(20), 130),
            fontFamily: font.optinoval,
            marginTop: scaleSize(8),
          }}
        >
          {i18n.t("Sarah, Duchess of York")}
        </Text>
      </Block>
    </Block>
  );
};

export default SectionEight;
