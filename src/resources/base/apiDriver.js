import axios from "axios";
import {
  authHeader,
  setAuthToken,
  setRefreshToken,
  userAuthHeader,
} from "../../helpers/auth";
import { configureAxiosParams } from "../../helpers/configureAxios";
import { consoleLog } from "../../styles/mixins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthTokenAction } from "../../store/auth";
import configureStore from "../../store/configureStore";
import API from "../../constants/baseApi";
import { navigate } from "../../navigation/NavigationService";

let isRefreshing = false;
// Format axios nested params correctly
configureAxiosParams(axios);

async function delayOneSecond() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000); // 1000 milliseconds = 1 second
  });
}

export const callApi = async (url, options = {}) => {
  while (isRefreshing) {
    console.log("Waiting for token refresh");
    await delayOneSecond();
  }

  const { store } = configureStore();
  const { isToken } = options;
  const headers = isToken ? await userAuthHeader() : await authHeader();
  // consoleLog("API URL ", url);
  // consoleLog("API Parameters ", options);
  const { method, ...rest } = options;
  const data = rest?.data;
  const params = rest?.params;
  let response;

  try {
    response = await axios.request({
      url,
      headers: {
        ...headers,
        ...{ "Cache-Control": "no-cache, no-store, must-revalidate" },
      },
      method,
      data,
      params,
    });
    return response;
  } catch (error) {
    if (error?.status === 401) {
      if (isRefreshing) {
        return;
      }
      isRefreshing = true;

      try {
        // GET REFRESH TOKEN
        const refreshToken = await AsyncStorage.getItem("@refresh_token");

        // CHECK IF REFRESH TOKEN IS NOT FOUND
        if (!refreshToken) {
          console.error("Refresh token not found--->");
          throw new Error("Refresh token not found");
        }

        // GET NEW TOKENS FROM REFRESH TOKEN
        const refreshTokenResponse = await axios.request({
          url: API.USER_REFRESH_TOKEN,
          headers: {
            ...{ "Cache-Control": "no-cache, no-store, must-revalidate" },
          },
          method: "POST",
          data: { refreshToken: refreshToken },
        });

        const newAuthToken = refreshTokenResponse?.data?.accessToken;
        const newRefreshToken = refreshTokenResponse?.data?.refreshToken;

        // SET NEW TOKENS
        await setAuthToken(newAuthToken);
        store.dispatch(setAuthTokenAction(newAuthToken));
        await setRefreshToken(newRefreshToken);

        // RECALL API FAILED API WITH NEW TOKENS AND SAME PARAMS
        const newHeaders = isToken
          ? await userAuthHeader()
          : await authHeader();

        response = await axios.request({
          url,
          headers: {
            ...newHeaders,
            ...{ "Cache-Control": "no-cache, no-store, must-revalidate" },
          },
          method,
          data,
          params,
        });
        return response;
      } catch (error) {
        console.error("Error while fetching new user tokens", error);

        // CHECK IF GET NEW TOKENS API FAILED WITH 401 THEN NAVIGATE TO SESSION EXPIRE SCREEN
        if (error?.response?.data?.statusCode === 401) {
          return navigate("SessionExpire", {
            message: error?.response?.data?.errorBody,
            statusCode: error?.response?.data?.statusCode,
          });
        }

        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
};
