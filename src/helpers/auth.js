import AsyncStorage from "@react-native-async-storage/async-storage";
import { logError } from "./logging";

const TOKEN_KEY = "@auth_token";
const AUTH_TOKEN = "@user_token";
const USER_UUID = "@user_uuid";
const REFRESH_TOKEN = "@refresh_token";
const APP_LANGUAGE = "@language";

export const setAuthToken = async (value = "") => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, value);
  } catch (err) {
    logError(err, "[setAuthToken] AsyncStorage Error");
  }
};

export const setRefreshToken = async (value = "") => {
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN, value);
  } catch (err) {
    logError(err, "[setRefreshToken] AsyncStorage Error");
  }
};

export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN);
  } catch (err) {
    logError(err, "[setRefreshToken] AsyncStorage Error");
    return null;
  }
};

export const removeRefreshToken = async () => {
  try {
    await AsyncStorage.removeItem(REFRESH_TOKEN);
  } catch (err) {
    logError(err, "[removeRefreshToken] AsyncStorage Error");
  }
};

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (err) {
    logError(err, "[getAuthToken] AsyncStorage Error");

    return null;
  }
};

export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    logError(err, "[removeAuthToken] AsyncStorage Error");
  }
};

export const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (err) {
    logError(err, "[clearStorage] AsyncStorage Error");
  }
};

export const authHeader = async () => {
  const token = await getAuthToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const storeSignupAuthToken = async (
  token = "",
  isChooseLanguage = false
) => {
  try {
    await AsyncStorage.setItem(
      AUTH_TOKEN,
      JSON.stringify({ token, isChooseLanguage })
    );
  } catch (err) {
    logError(err, "[setAuthToken] AsyncStorage Error");
  }
};

export const getSignupUserAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN);
  } catch (err) {
    logError(err, "[getAuthToken] AsyncStorage Error");

    return null;
  }
};

export const removeSignupUserAuthToken = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN);
  } catch (err) {
    logError(err, "[removeAuthToken] AsyncStorage Error");
  }
};

export const userAuthHeader = async () => {
  const userToken = JSON.parse(await getSignupUserAuthToken());
  console.log("userToken", userToken);

  const { token } = userToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const setUUID = async (uuid) => {
  try {
    await AsyncStorage.setItem(USER_UUID, uuid);
  } catch (err) {
    logError(err, "setUUID AsyncStorage Error");
  }
};

export const getUUID = async () => {
  try {
    return await AsyncStorage.getItem(USER_UUID);
  } catch (err) {
    logError(err, "setUUID AsyncStorage Error");
  }
};

export const removeUUID = async () => {
  try {
    await AsyncStorage.removeItem(USER_UUID);
  } catch (err) {
    logError(err, "setUUID AsyncStorage Error");
  }
};

export const storeLanguage = async (action, value) => {
  try {
    switch (action) {
      case "SET":
        return await AsyncStorage.setItem(APP_LANGUAGE, value ?? "");
      case "GET":
        return await AsyncStorage.getItem(APP_LANGUAGE);
      case "CLEAR":
        return await AsyncStorage.removeItem(APP_LANGUAGE);
    }
  } catch (err) {
    logError(err, "storeLanguage AsyncStorage Error");
  }
};
