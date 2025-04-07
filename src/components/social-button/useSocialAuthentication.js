import { useDispatch } from "react-redux";
import { envConfig } from "../../config/config";
import { useModal } from "../../context/ModalContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { setAuthTokenAction, setIsSocialLoading } from "../../store/auth";
import auth from "@react-native-firebase/auth";
import {
  appleAuthentication,
  facebookAuthentication,
  googleAuthentication,
} from "../../resources/baseServices/auth";
import { setAuthToken, setRefreshToken } from "../../helpers/auth";
import { ErrorDialog } from "../modal/Modal";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { setIntroVideoVisibility } from "../../store/introvideo";
import {
  LoginManager,
  AccessToken,
  AuthenticationToken,
} from "react-native-fbsdk-next";
import { ERROR_CONTACT_SUPPORT_MESSAGE } from "../../constants/errors";
import { Platform } from "react-native";
import { sha256 } from "react-native-sha256";
import { promoCodeDetails } from "../../store/audio-category/audioLink";
import { useEffect } from "react";

const GOOGLE_SIGN_IN_WEB_CLIENT_ID = envConfig.GOOGLE_SIGN_IN_WEB_CLIENT_ID;

export const useSocialAuthentication = () => {
  const dispatch = useDispatch();
  const modal = useModal();
  useEffect(() => {
    dispatch(setIsSocialLoading(false));
  }, [dispatch]);
  GoogleSignin.configure({
    webClientId: GOOGLE_SIGN_IN_WEB_CLIENT_ID,
    offlineAccess: true,
    scopes: ["profile", "email"],
  });

  const onGoogleAuth = async (uuid = null, promocode = null) => {
    try {
      dispatch(setIsSocialLoading(true));
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      if (userInfo?.data?.idToken) {
        const googleCredential = auth.GoogleAuthProvider.credential(
          userInfo?.data?.idToken
        );
        const response = await auth()?.signInWithCredential(googleCredential);
        const firebaseIdToken = await response?.user?.getIdToken(true);
        if (firebaseIdToken) {
          try {
            const payload = {
              idToken: firebaseIdToken,
            };
            if (uuid) {
              payload.uuid = uuid;
            }
            if (userInfo?.data?.user?.email) {
              payload.email = userInfo?.data?.user?.email;
            }

            if (promocode) {
              payload.promocode = promocode;
            }
            const res = await googleAuthentication(payload);
            if (res?.data?.tokens?.accessToken) {
              dispatch(setIntroVideoVisibility(false));
              await setAuthToken(res?.data?.tokens?.accessToken);
              await setRefreshToken(res?.data?.tokens?.refreshToken);
              dispatch(promoCodeDetails(null));
              dispatch(setAuthTokenAction(res?.data?.tokens?.accessToken));
            }
          } catch (error) {
            modal.show(ErrorDialog, {
              message:
                error?.response?.data?.message || ERROR_CONTACT_SUPPORT_MESSAGE,
              onConfirm: () => modal.close(),
            });
          }
        }
      } else {
        modal.show(ErrorDialog, {
          messageTitle: "Google Sign-in incomplete",
          message:
            "Please sign in with Google account or use alternative method",
          onConfirm: () => modal.close(),
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setIsSocialLoading(false));
    }
  };

  const onAppleAuth = async (uuid = null, promocode = null) => {
    try {
      dispatch(setIsSocialLoading(true));
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        requestedOperation: appleAuth.Operation.REFRESH,
      });
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error("Apple Sign-In failed - no identity token returned");
      }
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce
      );
      const response = await auth().signInWithCredential(appleCredential);

      const { fullName } = await createUserDataForIosSocialSignin(
        appleAuthRequestResponse
      );
      const firebaseIdToken = await response?.user?.getIdToken(true);
      if (firebaseIdToken) {
        try {
          const payload = {
            idToken: firebaseIdToken,
            fullName: fullName,
          };
          if (uuid) {
            payload.uuid = uuid;
          }
          if (response?.additionalUserInfo?.profile?.email) {
            payload.email = response?.additionalUserInfo?.profile?.email;
          }
          if (promocode) {
            payload.promocode = promocode;
          }
          const res = await appleAuthentication(payload);
          if (res?.data?.tokens?.accessToken) {
            dispatch(setIntroVideoVisibility(false));
            await setAuthToken(res?.data?.tokens?.accessToken);
            await setRefreshToken(res?.data?.tokens?.refreshToken);
            dispatch(promoCodeDetails(null));
            dispatch(setAuthTokenAction(res?.data?.tokens?.accessToken));
          }
        } catch (error) {
          modal.show(ErrorDialog, {
            message:
              error?.response?.data?.message || ERROR_CONTACT_SUPPORT_MESSAGE,
            onConfirm: () => modal.close(),
          });
        }
      }
    } catch (error) {
      modal.show(ErrorDialog, {
        messageTitle: "Apple Sign-in incomplete",
        message: `Please sign in with Apple account or use alternative method`,
      });
    } finally {
      dispatch(setIsSocialLoading(false));
    }
  };

  const onFacebookAuth = async (uuid = null, promocode = null) => {
    try {
      dispatch(setIsSocialLoading(true));

      // Log out any existing session to avoid conflicts
      // await LoginManager.logOut();
      let result;
      const nonce = Math.random().toString(36).substring(2, 10);
      if (Platform.OS === "ios") {
        const nonceSha256 = await sha256(nonce);
        result = await LoginManager.logInWithPermissions(
          ["public_profile", "email"],
          "limited",
          nonceSha256 // Optional
        );
      } else {
        result = await LoginManager.logInWithPermissions(
          ["public_profile", "email"] // Optional,
        );
      }
      if (result.isCancelled) {
        modal.show(ErrorDialog, {
          messageTitle: "Facebook Sign-in incomplete",
          message:
            "Please sign in with Facebook account or use alternative method",
          onConfirm: () => modal.close(),
        });
        return;
      }
      let data;
      if (Platform.OS === "ios") {
        data = await AuthenticationToken.getAuthenticationTokenIOS();
      } else {
        data = await AccessToken.getCurrentAccessToken();
      }

      if (!data) {
        throw new Error("Something went wrong obtaining the access token");
      }
      // const { first_name, last_name } = await fetchFacebookUserData(
      //   data.accessToken
      // );
      const facebookCredential =
        Platform.OS === "ios"
          ? auth.FacebookAuthProvider.credential(
              data.authenticationToken,
              nonce
            )
          : auth.FacebookAuthProvider.credential(data.accessToken);

      const response = await auth().signInWithCredential(facebookCredential);
      const firebaseIdToken = await response?.user?.getIdToken(true);
      if (firebaseIdToken) {
        try {
          const payload = {
            idToken: firebaseIdToken,
          };
          if (uuid) {
            payload.uuid = uuid;
          }

          if (promocode) {
            payload.promocode = promocode;
          }
          const res = await facebookAuthentication(payload);
          if (res?.data?.tokens?.accessToken) {
            dispatch(setIntroVideoVisibility(false));
            await setAuthToken(res?.data?.tokens?.accessToken);
            await setRefreshToken(res?.data?.tokens?.refreshToken);
            dispatch(promoCodeDetails(null));
            dispatch(setAuthTokenAction(res?.data?.tokens?.accessToken));
          }
        } catch (error) {
          modal.show(ErrorDialog, {
            message:
              error?.response?.data?.message || ERROR_CONTACT_SUPPORT_MESSAGE,
            onConfirm: () => modal.close(),
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setIsSocialLoading(false));
    }
  };

  // const fetchFacebookUserData = async (accessToken) => {
  //   try {
  //     // Fetch user info from Graph API
  //     console.log("Access Token:", accessToken);
  //     const response = await fetch(
  //       "https://graph.facebook.com/me?fields=first_name,last_name,email",
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`, // Use Authorization header
  //         },
  //       }
  //     );

  //     const userInfo = await response.json();

  //     console.log("User Info:", userInfo);
  //     // Extract first name, last name, and email
  //     const { first_name, last_name, email } = userInfo;
  //     console.log(
  //       `First Name: ${first_name}, Last Name: ${last_name}, Email: ${email}`
  //     );
  //     return { first_name, last_name, email };
  //   } catch (error) {
  //     console.log("Error fetching user data: " + error);
  //   }
  // };

  const createUserDataForIosSocialSignin = async (appleAuthRequestResponse) => {
    let { fullName } = appleAuthRequestResponse;

    return {
      fullName: fullName?.familyName
        ? fullName.givenName + " " + fullName?.familyName
        : fullName?.givenName || "",
    };
  };

  return {
    onGoogleAuth,
    onAppleAuth,
    onFacebookAuth,
  };
};
