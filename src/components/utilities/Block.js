import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { theme } from '../../styles';

export default class Block extends Component {
  handleMargins() {
    const { margin } = this.props;
    if (typeof margin === 'number') {
      return {
        marginTop: margin,
        marginRight: margin,
        marginBottom: margin,
        marginLeft: margin,
      };
    }

    if (typeof margin === 'object') {
      const msize = Object.keys(margin).length;
      switch (msize) {
        case 1:
          return {
            marginTop: margin[0],
            marginRight: margin[0],
            marginBottom: margin[0],
            marginLeft: margin[0],
          };
        case 2:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[0],
            marginLeft: margin[1],
          };
        case 3:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[2],
            marginLeft: margin[1],
          };
        default:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[2],
            marginLeft: margin[3],
          };
      }
    }
  }

  handlePaddings() {
    const { padding } = this.props;
    if (typeof padding === 'number') {
      return {
        paddingTop: padding,
        paddingRight: padding,
        paddingBottom: padding,
        paddingLeft: padding,
      };
    }

    if (typeof padding === 'object') {
      const paddingSize = Object.keys(padding).length;
      switch (paddingSize) {
        case 1:
          return {
            paddingTop: padding[0],
            paddingRight: padding[0],
            paddingBottom: padding[0],
            paddingLeft: padding[0],
          };
        case 2:
          return {
            paddingTop: padding[0],
            paddingRight: padding[1],
            paddingBottom: padding[0],
            paddingLeft: padding[1],
          };
        case 3:
          return {
            paddingTop: padding[0],
            paddingRight: padding[1],
            paddingBottom: padding[2],
            paddingLeft: padding[1],
          };
        default:
          return {
            paddingTop: padding[0],
            paddingRight: padding[1],
            paddingBottom: padding[2],
            paddingLeft: padding[3],
          };
      }
    }
  }

  handleHeight() {
    const { height } = this.props;
    if (typeof height === 'string') {
      return {
        height: height,
      };
    }

    if (typeof height === 'number') {
      return {
        height: height,
      };
    }
  }

  handleWidth() {
    const { width } = this.props;
    if (typeof width === 'string') {
      return {
        width: width,
      };
    }

    if (typeof width === 'number') {
      return {
        width: width,
      };
    }
  }

  render() {
    const {
      flex,
      row,
      column,
      center,
      middle,
      around,
      evenly,
      between,
      selfcenter,
      left,
      right,
      top,
      bottom,
      card,
      shadow,
      color,
      space,
      radius,
      padding,
      height,
      width,
      margin,
      animated,
      wrap,
      style,
      children,
      safeAreaView,
      safeAreaViewColor,
      darkStatusBar,
      statusBarColor,
      ...props
    } = this.props;

    const blockStyles = [
      styles.block,
      flex && { flex },
      flex === false && { flex: 0 }, // reset / disable flex
      row && styles.row,
      column && styles.column,
      center && styles.center,
      middle && styles.middle,
      around && styles.around,
      evenly && styles.evenly,
      between && styles.between,
      left && styles.left,
      right && styles.right,
      selfcenter && styles.selfcenter,
      top && styles.top,
      bottom && styles.bottom,
      margin && { ...this.handleMargins() },
      height && { ...this.handleHeight() },
      width && { ...this.handleWidth() },
      padding && { ...this.handlePaddings() },
      card && styles.card,
      shadow && styles.shadow,
      space && { justifyContent: `space-${space}` },
      wrap && { flexWrap: 'wrap' },
      radius && { borderRadius: radius },
      color && styles[color], // predefined styles colors for backgroundColor
      color && !styles[color] && { backgroundColor: color }, // custom backgroundColor
      style, // rewrite predefined styles
    ];

    if (animated) {
      return (
        <Animated.View style={blockStyles} {...props}>
          {children}
        </Animated.View>
      );
    }

    return (
      <View style={blockStyles} {...props}>
        {safeAreaView && (
          <SafeAreaView
            style={{ backgroundColor: safeAreaViewColor || '#007CC2' }}
          />
        )}
        {safeAreaView && (
          <StatusBar
            backgroundColor={statusBarColor || '#007CC2'}
            barStyle={darkStatusBar ? 'dark-content' : 'light-content'}
          />
        )}
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  card: {
    borderRadius: theme.sizes.radius,
  },
  selfcenter: {
    alignSelf: 'center',
  },
  center: {
    alignItems: 'center',
  },
  middle: {
    justifyContent: 'center',
  },
  left: {
    justifyContent: 'flex-start',
  },
  right: {
    justifyContent: 'flex-end',
  },
  top: {
    justifyContent: 'flex-start',
  },
  bottom: {
    justifyContent: 'flex-end',
  },
  between: {
    justifyContent: 'space-between',
  },
  around: {
    justifyContent: 'space-around',
  },
  evenly: {
    justifyContent: 'space-evenly',
  },
  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 4,
  },
});
