import React, { Component } from "react";
import { StyleSheet, Text as Text1 } from "react-native";
import { colors, font, fonts, sizes } from "../../styles/theme";

export default class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isArabicLang: false,
    };
  }

  render() {
    const {
      h1,
      h2,
      h3,
      heading,
      title,
      body,
      caption,
      header,
      small,
      size,
      transform,
      align,
      // styling
      sfdisplay,
      sftext,
      opensans,
      regular,
      bold,
      Playfair_Display_Italic,
      italic,
      semibold,
      medium,
      weight,
      light,
      center,
      right,
      spacing, // letter-spacing
      height, // line-height
      //number of lines
      // colors
      family,
      color,
      primary,
      secondary,
      style,
      children,
      ...props
    } = this.props;

    const textStyles = [
      styles.text,
      h1 && styles.h1,
      h2 && styles.h2,
      h3 && styles.h3,
      title && styles.title,
      header && styles.header,
      body && styles.body,
      heading && styles.heading,
      caption && styles.caption,
      small && styles.small,
      size && { fontSize: size },
      transform && { textTransform: transform },
      align && { textAlign: align },
      height && { lineHeight: height },
      spacing && { letterSpacing: spacing },
      weight && { fontWeight: weight },
      semibold && styles.semibold,
      regular && { fontFamily: font.regular },
      bold && { fontFamily: font.bold },
      Playfair_Display_Italic && { fontFamily: font.Playfair_Display_Italic },
      italic && { fontFamily: font.italic },
      medium && { fontFamily: font.medium },
      family && { fontFamily: family },
      light && styles.light,
      center && styles.center,
      right && styles.right,
      color && styles[color],
      color && !styles[color] && { color },
      // color shortcuts
      primary && styles.primary,
      secondary && styles.secondary,
      style, // rewrite predefined styles
    ];

    return (
      <Text1 style={textStyles} {...props}>
        {children}
      </Text1>
    );
  }
}

const styles = StyleSheet.create({
  // default style
  text: {
    fontSize: sizes.font,
  },
  // variations
  regular: {
    fontFamily: font.regular,
  },

  bold: {
    fontFamily: font.bold,
  },
  Playfair_Display_Italic: {
    fontFamily: font.Playfair_Display_Italic,
  },
  italic: {
    fontFamily: font.italic,
  },
  medium: {
    fontFamily: font.medium,
  },

  // position
  center: { textAlign: "center" },
  right: { textAlign: "right" },
  // colors
  primary: { color: colors.primary },
  secondary: { color: colors.secondary },
  // fonts
  h1: fonts.h1,
  h2: fonts.h2,
  header: fonts.header,
  h3: fonts.h3,
  heading: fonts.heading,
  title: fonts.title,
  body: fonts.body,
  caption: fonts.caption,
  small: fonts.small,
  arabic: { transform: [{ scaleX: -1 }], textAlign: "right" },
});
