import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

/* 
actionIcon = svg icon component
onHide = function to hide the toast
hideOn = time to hide the toast(in ms)
message = message to display
visible = boolean to show/hide the toast
animationDuration = duration of the animation (in ms)
*/

const CustomToast = ({
  visible,
  message,
  onHide,
  actionIcon,
  hideOn = 3000,
  animationDuration = 500,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: animationDuration,
            useNativeDriver: true,
          }).start(() => {
            onHide();
          });
        }, hideOn);
      });
    }
  }, [visible, fadeAnim, onHide]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={["#B38888", "#882F39"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBackground}
      >
        <Text style={styles.toastText}>{message}</Text>
        {actionIcon ? actionIcon : null}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 50,
    left: "8%",
    right: "8%",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gradientBackground: {
    padding: 15,
    borderRadius: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between", // Ensure spacing between text and icon
    alignItems: "center",
  },
  toastText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomToast;
