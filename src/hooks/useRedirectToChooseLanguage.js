import { useState, useEffect } from "react";
import { getSignupUserAuthToken } from "../helpers/auth"; // Adjust the path accordingly

const useRedirectToChooseLanguage = () => {
  const [
    isUserRedirectedToChooseLanguage,
    setIsUserRedirectedToChooseLanguage,
  ] = useState(false);

  useEffect(() => {
    const checkAndRedirectToChooseLanguage = async () => {
      try {
        // await removeSignupUserAuthToken();
        const { token, isChooseLanguage } = JSON.parse(
          await getSignupUserAuthToken()
        );
        if (token && isChooseLanguage) {
          setIsUserRedirectedToChooseLanguage(isChooseLanguage);
        }
      } catch (error) {
        console.error("Error fetching auth token:", error);
      }
    };

    checkAndRedirectToChooseLanguage();

    return () => {
      setIsUserRedirectedToChooseLanguage(false); // Reset on unmount
    };
  }, []);

  return isUserRedirectedToChooseLanguage;
};

export default useRedirectToChooseLanguage;
