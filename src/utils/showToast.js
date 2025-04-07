import Toast from "react-native-toast-message";

export const showToast = ({
  type,
  text1,
  text2,
  autoHide = true,
  visibilityTime = 3000,
}) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
    autoHide: autoHide,
    visibilityTime: visibilityTime,
  });
};
