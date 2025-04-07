import React from 'react';
import { Text } from 'react-native';
import { responsiveScale, scaleFont } from '../../styles/mixins';
import {
  FONT_WEIGHT_BOLD,
  SF_PRO_DISPLAY_BOLD,
  SF_PRO_DISPLAY_SEMIBOLD,
  SF_PRO_TEXT_BOLD,
  SF_PRO_TEXT_REGULAR,
  SF_PRO_TEXT_SEMIBOLD,
} from '../../styles/typography';

export const LargeTitle = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_DISPLAY_SEMIBOLD,
          fontSize: responsiveScale(17),
          letterSpacing: -0.02,
        },
        props.style,
      ]}
    />
  );
};

export const Title_1 = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_DISPLAY_SEMIBOLD,
          fontSize: scaleFont(28),
          lineHeight: scaleFont(34),
          letterSpacing: -0.01,
        },
        props.style,
      ]}
    />
  );
};

export const Title_2 = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_DISPLAY_SEMIBOLD,
          fontSize: responsiveScale(12),
          lineHeight: scaleFont(28),
          letterSpacing: -0.01,
        },
        props.style,
      ]}
    />
  );
};

export const Title_3 = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_DISPLAY_SEMIBOLD,
          fontSize: scaleFont(20),
          lineHeight: scaleFont(24),
          letterSpacing: -0.01,
        },
        props.style,
      ]}
    />
  );
};

export const Headline = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_TEXT_REGULAR,
          fontSize: responsiveScale(9),
          lineHeight: responsiveScale(11),
          letterSpacing: -0.04,
        },
        props.style,
      ]}
    />
  );
};

export const Body = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_TEXT_REGULAR,
          fontSize: responsiveScale(9.5),
          lineHeight: scaleFont(22),
          letterSpacing: -0.408,
        },
        props.style,
      ]}
    />
  );
};

export const Callout = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_TEXT_REGULAR,
          fontSize: scaleFont(16),
          lineHeight: scaleFont(21),
          letterSpacing: -0.32,
        },
        props.style,
      ]}
    />
  );
};

export const Subhead = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_TEXT_REGULAR,
          fontSize: responsiveScale(8.5),
          lineHeight: scaleFont(20),
          letterSpacing: -0.24,
        },
        props.style,
      ]}
    />
  );
};

export const Footnote = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_TEXT_REGULAR,
          fontSize: scaleFont(13),
          lineHeight: scaleFont(18),
          letterSpacing: -0.078,
        },
        props.style,
      ]}
    />
  );
};

export const Caption_1 = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_TEXT_REGULAR,
          fontSize: responsiveScale(7),
          lineHeight: scaleFont(16),
        },
        props.style,
      ]}
    />
  );
};

export const Caption_2 = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_TEXT_REGULAR,
          fontSize: responsiveScale(6),
          lineHeight: scaleFont(14),
          letterSpacing: 0.066,
        },
        props.style,
      ]}
    />
  );
};

export const LargeTitleBold = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_DISPLAY_BOLD,
          fontWeight: FONT_WEIGHT_BOLD,
          fontSize: scaleFont(34),
          lineHeight: scaleFont(41),
          letterSpacing: 0.374,
        },
        props.style,
      ]}
    />
  );
};

export const Caption_1_Bold = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_TEXT_BOLD,
          fontSize: scaleFont(12),
          lineHeight: scaleFont(16),
          letterSpacing: -0.04,
        },
        props.style,
      ]}
    />
  );
};

export const Caption_2_Bold = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_TEXT_BOLD,
          fontSize: scaleFont(11),
          lineHeight: scaleFont(14),
          letterSpacing: -0.02,
        },
        props.style,
      ]}
    />
  );
};

export const SubheadBold = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_TEXT_BOLD,
          fontSize: scaleFont(15),
          lineHeight: scaleFont(20),
          letterSpacing: -0.24,
        },
        props.style,
      ]}
    />
  );
};

export const FootnoteBold = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_TEXT_REGULAR,
          fontSize: scaleFont(13),
          lineHeight: scaleFont(18),
          letterSpacing: -0.04,
        },
        props.style,
      ]}
    />
  );
};

export const Title_2_Semibold = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_DISPLAY_SEMIBOLD,
          fontSize: scaleFont(22),
          lineHeight: scaleFont(28),
          letterSpacing: -0.01,
        },
        props.style,
      ]}
    />
  );
};

export const FootnoteSemibold = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_TEXT_SEMIBOLD,
          fontSize: responsiveScale(7.5),
          lineHeight: scaleFont(18),
          letterSpacing: -0.078,
        },
        props.style,
      ]}
    />
  );
};

export const FootnoteUnderline = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_TEXT_REGULAR,
          fontSize: scaleFont(13),
          lineHeight: scaleFont(18),
          letterSpacing: -0.078,
          textDecorationLine: 'underline',
        },
        props.style,
      ]}
    />
  );
};

export const Web_H6 = props => {
  return (
    <Text
      {...props}
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          fontFamily: SF_PRO_DISPLAY_SEMIBOLD,
          fontSize: scaleFont(17),
          lineHeight: scaleFont(26),
          letterSpacing: -0.03,
        },
        props.style,
      ]}
    />
  );
};
