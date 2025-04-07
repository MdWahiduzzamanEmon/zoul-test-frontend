import { Linking } from "react-native";
import InAppBrowser from "react-native-inappbrowser-reborn";
import { useModal } from "../context/ModalContext";
import { ErrorDialog } from "../components/modal/Modal";
import { ERROR_CONTACT_SUPPORT_MESSAGE } from "../constants/errors";

export const useInAppBrowser = () => {
  const modal = useModal();
  const handleInAppBrowser = async (url) => {
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(`${url}`, {
          // ios Properties
          dismissButtonStyle: "close",
          enableBarCollapsing: true,
          // Android Properties
          showTitle: true,
          enableUrlBarHiding: true,
          animated: true,
        });
      } else {
        Linking.openURL(url);
      }
    } catch (err) {
      console.log("err", err);
      modal.show(ErrorDialog, {
        message: err.message ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    }
  };

  return { handleInAppBrowser };
};
