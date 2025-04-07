import * as React from 'react';
import { Animated, Easing, StyleSheet, View, ViewStyle } from 'react-native';
import { Children, ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const AnimatedChild = ({
  index,
  children,
  anim,
  totalContentWidth,
  spacing,
}: React.PropsWithChildren<{
  index: number;
  anim: Animated.Value;
  totalContentWidth: number;
  spacing: number;
}>) => {
  const left = index * totalContentWidth;
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -totalContentWidth],
  });

  const wrapperStyles: ViewStyle = {
    position: 'absolute',
    left,
    transform: [{ translateX }],
  };

  return <Animated.View style={wrapperStyles}>{children}</Animated.View>;
};

export type MarqueeProps = React.PropsWithChildren<{
  speed?: number;
  spacing?: number;
  style?: ViewStyle;
  isPlaying?: boolean;
}>;

const calculateDuration = (totalContentWidth: number, speed: number) => {
  return totalContentWidth / speed;
};

export const Marquee = ({ speed = 1, children, spacing = 0, style, isPlaying = true }: MarqueeProps) => {
  const [parentWidth, setParentWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [cloneTimes, setCloneTimes] = useState(0);
  const [isAnimationReady, setIsAnimationReady] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const childrenCount = Children.count(children);

  const totalContentWidth = contentWidth + spacing * childrenCount;

  useEffect(() => {
    if (!isPlaying) return;

    if (contentWidth > 0 && childrenCount > 0) {
      if (isPlaying) {
        const totalWidth = totalContentWidth + spacing * (cloneTimes - 1);
        if (totalWidth <= parentWidth) {
          return;
        }
      }

      const duration = calculateDuration(totalContentWidth, speed) * 1000;

      anim.setValue(0);
      const animation = Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      setTimeout(() => {
        setIsAnimationReady(true);
        animation.start();
      }, 2000);
      return () => {
        animation.stop();
        setIsAnimationReady(true);
      };
    }
  }, [contentWidth, spacing, speed, anim, childrenCount, parentWidth, totalContentWidth, cloneTimes]);

  useEffect(() => {
    if (contentWidth === 0 || parentWidth === 0) {
      return;
    }
    const times = Math.ceil(parentWidth / totalContentWidth) + 1;
    setCloneTimes(times);
  }, [contentWidth, parentWidth, totalContentWidth]);

  const content = useMemo(
    () => (
      <View
        style={styles.hidden}
        onLayout={ev => {
          setContentWidth(ev.nativeEvent.layout.width);
        }}>
        {children}
      </View>
    ),
    [children],
  );

  const running = useMemo(
    () =>
      cloneTimes > 0 &&
      [...Array(cloneTimes).keys()].map(index => {
        return (
          <AnimatedChild key={`clone-${index}`} index={index} anim={anim} totalContentWidth={totalContentWidth} spacing={spacing}>
            {children}
          </AnimatedChild>
        );
      }),
    [cloneTimes, children],
  );

  return (
    <View
      style={style}
      onLayout={ev => {
        setParentWidth(ev.nativeEvent.layout.width);
      }}
      pointerEvents="box-none">
      <View style={styles.row} pointerEvents="box-none">
        {isAnimationReady ? (
          <>
            {content}
            {running}
          </>
        ) : (
          <View
            onLayout={ev => {
              setContentWidth(ev.nativeEvent.layout.width);
            }}>
            {children}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hidden: { opacity: 0, zIndex: -9999 },
  row: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
});
