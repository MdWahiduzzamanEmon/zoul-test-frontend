import { produce } from "immer";

export const SET_AUTH_TOKEN = "SET_AUTH_TOKEN";
export const REMOVE_AUTH_TOKEN = "REMOVE_AUTH_TOKEN";
export const IS_LOADER = "IS_LOADER";
export const SET_LANGUAGE = "SET_LANGUAGE";
export const SET_LOGOUT_FLAG = "SET_LOGOUT_FLAG";
export const USER_ENTER_FIRST_TIME = "USER_ENTER_FIRST_TIME";

export const setAuthTokenAction = (value = "") => {
  return {
    type: SET_AUTH_TOKEN,
    payload: value,
  };
};

export const removeAuthTokenAction = () => ({
  type: REMOVE_AUTH_TOKEN,
});

export const setIsSocialLoading = (value) => ({
  type: IS_LOADER,
  payload: value,
});

export const setLanguage = (language) => ({
  type: SET_LANGUAGE,
  payload: language,
});

export const setLogoutFlag = (flag = false) => ({
  type: SET_LOGOUT_FLAG,
  payload: flag,
});

export const setIsUserEnterFirstTime = (flag = false) => ({
  type: USER_ENTER_FIRST_TIME,
  payload: flag,
});
