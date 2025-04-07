import React from "react";
import { Image, Modal, StyleSheet, TouchableOpacity } from "react-native";
import Block from "../utilities/Block";
import Text from "../utilities/Text";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import MenuIcon from "../../assets/appImages/svgImages/MenuIcon";
import { getTransformedUrl } from "../../utils/ImageService";

const SuggestedDailyPlan = ({
  image,
  title,
  subtitle,
  duration,
  handleonPress = () => {},
  showDivider = true,
  showMenuIcon = false,
  extraimagestyle,
  Icon,
  onLongPress,
  isEditing,
  onpress,
}) => {
  const imageUri =
    typeof image === "string"
      ? { uri: getTransformedUrl(image) }
      : require("../../assets/appImages/CategoryImage.png");
  return (
    <>
      <TouchableOpacity
        onLongPress={onLongPress}
        onPress={() => {
          handleonPress();
        }}
      >
        <Block flex={false}>
          <Block flex={false} row style={styles.container}>
            <Block flex={false} row>
              <Image
                source={imageUri}
                style={[styles.image, extraimagestyle]}
              />
            </Block>
            <Block between padding={[2, 0, 2, 14]}>
              <Block flex={false} row between center>
                <Text
                  regular
                  size={scaleSize(18)}
                  style={{ width: showMenuIcon ? "90%" : "100%" }}
                  color={colors.white}
                >
                  {title}
                </Text>
                {showMenuIcon && (
                  <TouchableOpacity onPress={onpress}>
                    <Image
                      source={Icon}
                      style={
                        isEditing
                          ? styles.deleteIconStyle
                          : styles.menuIconStyle
                      }
                    />
                  </TouchableOpacity>
                )}
              </Block>
              {showDivider && (
                <Block
                  flex={false}
                  style={[styles.divider2, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
                />
              )}
              <Block flex={false} row between>
                <Text regular size={scaleSize(16)} color={colors.white}>
                  {subtitle}
                </Text>
                <Text regular size={scaleSize(16)} color={colors.white}>
                  {duration}
                </Text>
              </Block>
            </Block>
          </Block>
        </Block>
      </TouchableOpacity>
    </>
  );
};

export default SuggestedDailyPlan;

const styles = StyleSheet.create({
  container: {
    marginTop: perfectSize(12),
    backgroundColor: "#FFFFFF1A",
    borderRadius: 8,
    padding: perfectSize(8),
  },
  image: {
    height: perfectSize(80),
    width: perfectSize(80),
    borderRadius: perfectSize(6)
  },
  divider2: {
    width: "100%",
    height: perfectSize(4),
    alignSelf: "center",
    borderRadius: 10,
  },
  menuIconStyle: {
    height: perfectSize(6),
    width: perfectSize(16),
    tintColor: colors.logoColor,
    right: perfectSize(5),
  },
  deleteIconStyle: {
    height: perfectSize(24),
    width: perfectSize(24),
    tintColor: colors.logoColor,
  },
});
