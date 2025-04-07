import { useEffect, useState } from "react";
import { getOpenRatePopup } from "../resources/baseServices/app";

const useRatePopUpHandler = () => {
  const [isRatePopupShown, setIsRatePopupShown] = useState(false);
  useEffect(() => {
    const checkRatePopup = async () => {
      try {
        const openRatePopup = await getOpenRatePopup();

        setIsRatePopupShown(openRatePopup?.data?.value?.showRatingPopup);
      } catch (error) {
        console.error("error checkCurrentVersion =--->", error);
      }
    };
    checkRatePopup();
  }, []);
  return { isRatePopupShown };
};

export default useRatePopUpHandler;
