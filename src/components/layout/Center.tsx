import React, { PropsWithChildren } from 'react';
import { View, ViewStyle } from 'react-native';

type CenterProps = PropsWithChildren<{ flex?: number }>;

export const Center = ({ flex = undefined, children }: CenterProps): React.JSX.Element => (
  <View style={[{ flex }, center]}>{children}</View>
);

const center: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
};
