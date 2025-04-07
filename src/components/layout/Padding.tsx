import React, { PropsWithChildren } from 'react';
import { View, ViewStyle } from 'react-native';

type Alignment = { horizontal?: number; vertical?: number };

export const padding = ({ horizontal = 0, vertical = 0 }: Alignment): ViewStyle => ({
  paddingVertical: vertical,
  paddingHorizontal: horizontal,
});

export const Padding = ({ children, ...gaps }: PropsWithChildren<Alignment>): React.JSX.Element => (
  <View style={padding(gaps)}>{children}</View>
);
