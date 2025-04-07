import { callApiGet, callApiPatch, callApiPost, callApiPut } from "./baseApi";
import API from "../../constants/baseApi";

export const login = (data = {}) => callApiPost({ url: API.LOGIN, data });

export const register = (data = {}) => callApiPost({ url: API.REGISTER, data });

export const signUpWithPhoneNumber = (data = {}) =>
  callApiPost({ url: API.USER_SIGNUP_WITH_PHONE_NUMBER, data });

export const signUp = (data = {}) =>
  callApiPost({ url: API.USER_SIGNUP, data });

export const forgotPassword = (data = {}) =>
  callApiPost({ url: API.FORGOT_PASSWORD, data });

export const resetPassword = (data = {}) =>
  callApiPatch({ url: API.RESET_PASSWORD, data });

export const requestResetPasswordUsingPhoneNumber = (data = {}) =>
  callApiPost({ url: API.REQUEST_RESET_PASSWORD_WITH_PHONE_NUMBER, data });

export const resetPasswordUsingPhoneNumber = (data = {}) =>
  callApiPatch({ url: API.USER_RESET_PASSWORD_WITH_PHONE_NUMBER, data });

export const getUsersPostDetails = (data = {}) =>
  callApiGet({ url: API.GET_POST_DETAILS, data });

export const googleAuthentication = (data = {}) =>
  callApiPost({ url: API.GOOGLE_SIGN_IN, data });

export const appleAuthentication = (data = {}) =>
  callApiPost({ url: API.APPLE_SIGN_IN, data });

export const facebookAuthentication = (data = {}) =>
  callApiPost({ url: API.FACEBOOK_SIGN_IN, data });

export const verifyEmail = (data = {}) =>
  callApiPost({ url: API.VERIFY_EMAIL, data });

export const updateProfile = (data = {}, isToken = false) =>
  callApiPatch({ url: API.UPDATE_PROFILE, data, isToken });

export const reminder = (data = {}, isToken = false) =>
  callApiPost({ url: API.REMINDER, data, isToken });

export const getUserProfile = (data = {}, isToken = false) =>
  callApiGet({ url: API.GET_PROFILE, data, isToken });

export const getuxcam = (data = {}, isToken = false) =>
  callApiGet({ url: API.UXCAM, isToken });

export const getConfigData = (data = {}, isToken = false) =>
  callApiGet({ url: API.APP_FEATURE, data, isToken });

export const loginRequestByZoulCheckOutToken = async (data = {}) => {
  try {
    const response = await callApiPost({
      url: API.LOGIN_REQUEST_BY_ZOUL_CHECKOUT_TOKEN,
      data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
