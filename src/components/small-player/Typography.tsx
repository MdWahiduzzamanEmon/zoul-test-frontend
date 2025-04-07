import React from "react";
import { ColorValue, Text, TextStyle } from "react-native";
import { PropsWithChildren } from "react";
import { colors } from "../../styles/theme";

type HeadingVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type ParagraphVariant = "p0" | "p1" | "p2" | "p3" | "p4";

type TitleVariant = "t1" | "t28" | "t12" | "t48";

type ThinVariant = "th1" | "th2" | "th4";

export type TypographyVariant =
  | HeadingVariant
  | ParagraphVariant
  | TitleVariant
  | ThinVariant;

type TypographyProps = PropsWithChildren<{
  variant: TypographyVariant;
  textAlign?: "auto" | "left" | "right" | "center" | "justify" | undefined;
  color?: ColorValue;
  raw?: TextStyle;
  isUnderlined?: boolean;
  numberOfLines?: number;
}>;

const fontConfig = (
  fontSize: number,
  lineHeight: number,
  fontWeight: TextStyle["fontWeight"]
): TextStyle => ({
  fontSize,
  lineHeight,
  fontWeight,
});

const BOLD = "600";
const REGULAR = "400";
const NORMAL = "500";
const THIN = "300";

const DEFAULT_TEXT_VARIANT = fontConfig(18, 28, REGULAR);

const pickTextVariant = (variant: TypographyVariant): TextStyle => {
  switch (variant) {
    case "h1":
      return fontConfig(32, 40, BOLD);
    case "h2":
      return fontConfig(28, 36, BOLD);
    case "h3":
      return fontConfig(24, 32, BOLD);
    case "h4":
      return fontConfig(18, 28, BOLD);
    case "h5":
      return fontConfig(16, 24, BOLD);
    case "h6":
      return fontConfig(14, 20, BOLD);
    case "p0":
      return fontConfig(48, 57.6, REGULAR);
    case "p1":
      return fontConfig(24, 28.8, REGULAR);
    case "p2":
      return DEFAULT_TEXT_VARIANT;
    case "p3":
      return fontConfig(16, 24, REGULAR);
    case "p4":
      return fontConfig(12, 18, REGULAR);
    case "t1": {
      return fontConfig(32, 38.4, NORMAL);
    }
    case "t28": {
      return fontConfig(28, 30, NORMAL);
    }
    case "t12": {
      return fontConfig(12, 16, NORMAL);
    }
    case "t48": {
      return fontConfig(48, 57.6, NORMAL);
    }
    case "th1": {
      return fontConfig(24, 23.4, THIN);
    }
    case "th2": {
      return fontConfig(18, 23.4, THIN);
    }
    case "th4": {
      return fontConfig(12, 14.4, THIN);
    }
    default:
      return DEFAULT_TEXT_VARIANT;
  }
};

export const Typography = ({
  variant,
  textAlign = "left",
  color = colors.white,
  raw,
  children,
  isUnderlined = false,
  numberOfLines,
}: TypographyProps): React.JSX.Element => (
  <Text
    numberOfLines={numberOfLines}
    allowFontScaling={false}
    style={[
      {
        // fontFamily: Fonts.Inter,
        ...pickTextVariant(variant),
        textAlign,
        color,
        ...raw,
        textDecorationLine: isUnderlined ? "underline" : "none",
      },
    ]}
  >
    {children}
  </Text>
);
