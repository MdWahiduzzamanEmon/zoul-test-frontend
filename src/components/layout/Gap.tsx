import React from 'react';
import { View, ViewStyle } from 'react-native';

type Alignment = { horizontal?: number; vertical?: number };

export const gap = ({ horizontal = 0, vertical = 0 }: Alignment): ViewStyle => ({
  height: vertical,
  width: horizontal,
});

export const Gap = (props: Alignment): React.JSX.Element => <View style={gap(props)} />;
