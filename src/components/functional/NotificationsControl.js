import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../../store/notifications";
import { Headline, Subhead } from "./TypographyText";

import CloseIcon from "../../assets/appImages/CloseIcon.svg";
import { boxShadow, scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";
import { SF_PRO_TEXT_SEMIBOLD } from "../../styles/typography";

// PRIMARY
export const PRIMARY_CTA = "#E00087";
export const PRIMARY_PINK = "#FF0099";
export const LIGHT_PINK = "#FFE1F2";
export const EXTRA_LIGHT_PINK = "#FEF4FA";
export const BACKGROUND_PINK = "#CD238A";
export const PRIMARY_GREEN = "#00B313";
export const PRIMARY_RED = "#FF0000";

// GRAYSCALE
export const LIGHT_GRAY_5 = "#F8F8FC";
export const LIGHT_GRAY_10 = "#F2F2F7";
export const LIGHT_GRAY_20 = "#E5E5EA";
export const LIGHT_GRAY_40 = "#D1D1D6";
export const LIGHT_GRAY_60 = "#C7C7CC";
export const LIGHT_GRAY_80 = "#AEAEB2";
export const LIGHT_GRAY_100 = "#8E8E93";
export const LIGHT_GRAY_105 = "#080F1A";
export const LIGHT_GRAY_110 = "#E0E0E0";

export const DARK_GRAY_5 = "#131314";
export const DARK_GRAY_10 = "#1C1C1E";
export const DARK_GRAY_20 = "#2c2c2e";
export const DARK_GRAY_40 = "#3a3a3c";
export const DARK_GRAY_60 = "#48484a";
export const DARK_GRAY_80 = "#636366";
export const DARK_GRAY_66 = "#DADADA";

// UTILITY
export const UTILITY_DESTRUCTIVE = "#FF0000";
export const UTILITY_SUCCESS = "#00820E";

// TRANSPERANT
export const WHITE_TRANSPERANT = "#73FFFFFF";
export const WHITE_TRANSPERANT_10 = "rgba(0, 0, 0, 0.87)";
export const TRANSPERANT = "rgba(0, 0, 0, 0)";

export default function NotificationsControl() {
  const notifications = useSelector(
    (state) => state.notifications.notificationsArray
  );
  const dispatch = useDispatch();

  const _computeStatusStyle = useCallback((condition) => styles[condition], []);

  const _computeEmoji = useCallback((notificationType) => {
    switch (notificationType) {
      case "success":
        return "👍";
      case "warning":
        return "⚠️";
      default:
        return "!";
    }
  }, []);

  const _handleClosePress = useCallback((notificationId) => {
    dispatch(removeNotification(notificationId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    notifications &&
    notifications.length > 0 && (
      <View style={styles.wrap}>
        {notifications.map((item) => (
          <View key={item.id} style={styles.notificationContainer}>
            <TouchableOpacity
              style={styles.closeTouchable}
              onPress={() => _handleClosePress(item.id)}
            >
              <CloseIcon height={12} width={12} />
            </TouchableOpacity>
            <Headline style={[styles.title, _computeStatusStyle(item.type)]}>
              {item.title} {_computeEmoji(item.type)}
            </Headline>
            <Subhead style={styles.message}>{item.message}</Subhead>
          </View>
        ))}
      </View>
    )
  );
}

const styles = StyleSheet.create({
  closeTouchable: {
    padding: 11,
    position: "absolute",
    right: 0,
    zIndex: 5,
  },
  info: {
    color: PRIMARY_CTA,
  },
  message: {
    marginTop: 12,
  },
  notificationContainer: {
    position: "relative",
    width: "100%",
    ...boxShadow({ height: 8, width: 0 }, 0.05, 8, colors.shadowColor),
    backgroundColor: colors.viewBackgroundColor,
    borderColor: LIGHT_GRAY_20,
    borderRadius: 4,
    borderWidth: 1,
    padding: scaleSize(16),
  },
  success: {
    color: UTILITY_SUCCESS,
  },
  title: {
    fontFamily: SF_PRO_TEXT_SEMIBOLD,
  },
  warning: {
    color: UTILITY_DESTRUCTIVE,
  },
  wrap: {
    bottom: 60,
    paddingHorizontal: scaleSize(16),
    position: "absolute",
    width: "100%",
    zIndex: 500,
  },
});
