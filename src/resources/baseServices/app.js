import {
  callApiDelete,
  callApiGet,
  callApiPatch,
  callApiPost,
  callApiPut,
} from "./baseApi";
import API from "../../constants/baseApi";

export const getCategories = async (data = {}) => {
  try {
    return await callApiGet({ url: API.CATEGORIES, data });
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getPlaylists = async (data = {}) => {
  try {
    return await callApiGet({ url: API.PLAYLISTS, data });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
};

export const getGlobalContent = async (screen, data = {}) => {
  try {
    return await callApiGet({ url: API.GLOBAL_CONTENT + screen, data });
  } catch (error) {
    console.error("Error fetching global content:", error);
    throw error;
  }
};

export const getGlobalContentHome = async (data = {}) => {
  try {
    return await callApiGet({ url: API.GLOBAL_CONTENT_HOME, data });
  } catch (error) {
    console.error("Error fetching global content:", error);
    throw error;
  }
};

export const getGlobalContentExplore = async (data = {}) => {
  try {
    return await callApiGet({ url: API.GLOBAL_CONTENT_EXPLORE, data });
  } catch (error) {
    console.error("Error fetching global content:", error);
    throw error;
  }
};

export const getSubCategories = async (data = {}) => {
  try {
    return await callApiGet({ url: API.SUB_CATEGORIES, data });
  } catch (error) {
    console.error("Error fetching sub categories:", error);
    throw error;
  }
};

export const getOneCategorie = async (id = "", data = {}) => {
  try {
    return await callApiGet({ url: API.ONE_CATEGORIE + id, data });
  } catch (error) {
    console.error("Error fetching sub categories:", error);
    throw error;
  }
};

export const fetchSigleGoal = async (id = "") => {
  try {
    const params = { includeAudio: true };
    return await callApiGet({ url: API.SINGLE_GOAL + id, params });
  } catch (error) {
    console.error("Error fetching sub categories:", error);
    throw error;
  }
};

export const getDailyWisdomToday = async (data = {}) => {
  try {
    return await callApiGet({ url: API.DAILY_WISDOM, data });
  } catch (error) {
    console.error("Error fetching getDailyWisdomTodaye:", error);
    throw error;
  }
};

export const getHoroscopeToday = async (date, data = {}) => {
  try {
    return await callApiGet({ url: API.HOROSCOPE_TODAY + date, data });
  } catch (error) {
    console.error("Error fetching getHoroscopeToday:", error?.response?.data);
    throw error;
  }
};

export const fetchDailyPlan = async (screen, data = {}) => {
  try {
    return await callApiGet({ url: API.DAILY_PLAY + screen });
  } catch (error) {
    console.error("Error fetching DailyPlan:", error?.response?.data);
    throw error;
  }
};

export const getOnePlayList = async (id = "", data = {}) => {
  try {
    return await callApiGet({ url: API.ONE_PLAYLIST + id, data });
  } catch (error) {
    console.error("Error fetching getOnePlayList:", error);
    throw error;
  }
};

export const getAllUserPlaylists = async (id = "", data = {}) => {
  try {
    return await callApiGet({ url: API.GET_ALL_USER_PLAYLISTS + id, data });
  } catch (error) {
    console.error("Error fetching getAllUserPlaylists:", error);
    throw error;
  }
};

export const createuserplaylist = async (id = "", data = {}) => {
  try {
    return await callApiPost({
      url: API.CREATE_USER_PLAYLISTSDATA + id,
      data,
      isToken: false,
    });
  } catch (error) {
    console.error("Error fetching addUserFavouritesAudio:", error);
    throw error;
  }
};

export const deleteuserplaylist = async (id = "", data = {}) => {
  try {
    return await callApiDelete({ url: API.Delete_PLAYLIST + id, data });
  } catch (error) {
    console.error("Error fetching removeUserFavouritesAudio:", error);
    throw error;
  }
};

export const addUserFavouritesAudio = async (id = "", data = {}) => {
  try {
    return await callApiPost({
      url: API.ADD_FAVOURITES_AUDIO + id,
      data,
      isToken: false,
    });
  } catch (error) {
    console.error("Error fetching addUserFavouritesAudio:", error);
    throw error;
  }
};

export const removeUserFavouritesAudio = async (id = "", data = {}) => {
  try {
    return await callApiPost({ url: API.REMOVE_FAVOURITES_AUDIO + id });
  } catch (error) {
    console.error("Error fetching removeUserFavouritesAudio:", error);
    throw error;
  }
};

export const getUserFavouritesAudio = async (data = {}) => {
  try {
    return await callApiGet({ url: API.GET_FAVOURITES_AUDIO, data });
  } catch (error) {
    console.error("Error fetching getUserFavouritesAudio:", error);
    throw error;
  }
};

export const addUserPlaylists = async (data = {}) => {
  try {
    return await callApiPost({
      url: API.CREATE_USER_PLAYLISTS,
      data,
      isToken: false,
    });
  } catch (error) {
    console.error("Error addUserPlaylists:", error);
    throw error;
  }
};

// USER RECENTLY PLAYED AUDIOS
export const fetchRecentlyPlayedAudios = async (
  params = { offset: 1, limit: 10 }
) => {
  try {
    return await callApiGet({ url: API.GET_RECENTLY_PLAYED_AUDIOS, params });
  } catch (error) {
    console.error("Error fetching Recently Played Audios:", error);
    throw error;
  }
};

export const updateUserPlaylists = async (id = "", data = {}) => {
  try {
    return await callApiPatch({ url: API.UPDATE_USER_PLAYLISTS + id, data });
  } catch (error) {
    console.error("Error fetching updateUserPlaylists:", error);
    throw error;
  }
};
export const trackpromocode = async (data = {}) => {
  try {
    return await callApiPatch({
      url: API.TRACK_PROMO_COAD,
      data,
    });
  } catch (error) {
    console.error("Error fetching trackpromocode:", error);
    throw error;
  }
};

export const getOneUserPlaylists = async (id = "", data = {}) => {
  try {
    return await callApiGet({ url: API.GET_ONE_USER_PLAYLISTS + id, data });
  } catch (error) {
    console.error("Error fetching getOneUserPlaylists:", error);
    throw error;
  }
};

export const getSingleUserPlaylists = async (id = "", data = {}) => {
  try {
    return await callApiGet({ url: API.GET_SINGLE_USER_PLAYLISTS + id, data });
  } catch (error) {
    console.error("Error fetching getOneUserPlaylists:", error);
    throw error;
  }
};

export const addAudioToRecentlyPlayed = async (id = "") => {
  try {
    return await callApiPost({ url: API.ADD_RECENTLY_PLAYED_AUDIO + id });
  } catch (error) {
    console.error("Error Adding Audio To Recently Played:", error);
    throw error;
  }
};

// Fetch all reminders
export const fetchReminders = async () => {
  try {
    return await callApiGet({ url: API.FETCH_REMINDERS });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    throw error;
  }
};

export const fetchUserHoroscopeReminders = async () => {
  try {
    return await callApiGet({ url: API.FETCH_HOROSCOPE_REMINDERS });
  } catch (error) {
    console.error("Error fetching horoscope reminders:", error);
    throw error;
  }
};

export const getmysubscriptionplanDetails = async () => {
  try {
    return await callApiGet({ url: API.MY_SUBSCRIPTION_DETAILS });
  } catch (error) {
    console.error("Error fetching horoscope reminders:", error);
    throw error;
  }
};

export const updateUserPassword = async (data = {}) => {
  try {
    return await callApiPatch({ url: API.UPDATE_USER_PASSWORD, data });
  } catch (error) {
    console.error("Error update user password:", error);
    throw error;
  }
};

export const deleteUserAccount = async () => {
  try {
    return await callApiDelete({ url: API.DELETE_USER_ACCOUNT });
  } catch (error) {
    console.error("Error fetching horoscope reminders:", error);
    throw error;
  }
};

export const applyPromoCode = async (data = {}) => {
  try {
    return await callApiPost({ url: API.APPLY_PROMO_CODE, data });
  } catch (error) {
    console.error("Error applying promo code:", error);
    throw error;
  }
};

export const applyRedeemableCode = async (data = {}) => {
  try {
    return await callApiPost({ url: API.REDEEMABLE_CODE, data });
  } catch (error) {
    console.error("Error applying redeemable code:", error);
    throw error;
  }
};
export const createLiveStream = async (data = {}) => {
  try {
    return await callApiPost({ url: API.LIVE_STREAM, data });
  } catch (error) {
    console.error("Error creating live stream:", error);
    throw error;
  }
};

export const modifyAudioInPlayList = async (
  PlayListID = "",
  AudioID = "",
  isAdd = true,
  data = {}
) => {
  try {
    const actionUrl = isAdd ? "add-audio" : "remove-audio";
    return await callApiPost({
      url: API.ADD_AUDIO_TO_PLAYLIST + `${PlayListID}/${actionUrl}/${AudioID}`,
      data,
    });
  } catch (error) {
    console.error(
      `Error ${isAdd ? "adding" : "removing"} audio to playlist:`,
      error
    );
    throw error;
  }
};

export const updateAudioInPlayList = async (data = {}, AudioID = "") => {
  try {
    return await callApiPost({
      url: API.UPDATE_AUDIO_IN_PLAYLISTS + `/${AudioID}`,
      data,
    });
  } catch (error) {
    console.error("error updateAudioInPlayList =--->", error);
  }
};

export const sendSupportRequest = async (data = {}) => {
  try {
    return await callApiPost({ url: API.SUPPORT_REQUEST, data });
  } catch (error) {
    console.error("Error send support request:", error);
    throw error;
  }
};

export const getSingleAudio = async (id = "") => {
  try {
    return await callApiGet({
      url: API.GET_SINGLE_AUDIO + id,
    });
  } catch (error) {
    console.error("error getSingleAudio =--->", error);
  }
};

export const getUsers = async (params) => {
  try {
    return await callApiGet({
      url: API.GET_USERS,
      params,
    });
  } catch (error) {
    console.error("error getSingleAudio =--->", error);
  }
};

export const getVersion = async (data = {}) => {
  try {
    return await callApiGet({ url: API.VERSION, data });
  } catch (error) {
    console.error("Error fetching get Version:", error);
    throw error;
  }
};
export const getOpenRatePopup = async (data = {}) => {
  try {
    return await callApiGet({ url: API.RATING_POPUP, data });
  } catch (error) {
    console.error("Error fetching get open rate pop up:", error);
    throw error;
  }
};
export const getLiveStreams = async () => {
  try {
    return await callApiGet({ url: API.LIVE_STREAM });
  } catch (error) {
    console.error("Error fetching get live stream:", error);
    throw error;
  }
};

export const joinLiveStream = async (id) => {
  try {
    return await callApiGet({
      url: API.JOIN_LIVE_STREAM.replace("{livestream-id}", id),
    });
  } catch (error) {
    console.error("Error fetching get open rate pop up:", error);
    throw error;
  }
};
export const endLiveStream = async (id) => {
  try {
    return await callApiPut({
      url: API.END_LIVE_STREAM.replace("{livestream-id}", id),
    });
  } catch (error) {
    console.error("Error fetching get open rate pop up:", error);
    throw error;
  }
};

export const updateUserEmail = async (data = {}) => {
  try {
    return await callApiPatch({ url: API.UPDATE_USER_EMAIL, data });
  } catch (error) {
    console.error("Error while update user email:", error);
    throw error;
  }
};

export const guestPass = async (data = {}) => {
  try {
    return await callApiPost({ url: API.GUEST_PASS, data });
  } catch (error) {
    console.error("Error while guest pass:", error);
    throw error;
  }
};

// fetch random images for the audio sharing poster
export const getImages = async (data = {}) => {
  try {
    return await callApiGet({ url: API.FETCH_IMAGES, data });
  } catch (error) {
    console.error("error getImages =--->", error);
  }
};

export const checkEmailExist = async ({ email }) => {
  try {
    const response = await callApiGet({
      url: API.USER_EMAIL_EXIST + `/${email}`,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getNewToken = async (data = {}) => {
  try {
    const response = await callApiPost({ url: API.USER_REFRESH_TOKEN, data });
    return response;
  } catch (error) {
    throw error;
  }
};

export const resendVerificationCode = async (data = {}) => {
  try {
    const response = await callApiPost({
      url: API.USER_RESEND_VERIFICATION_CODE,
      data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateTokens = async (data = {}) => {
  try {
    const response = await callApiPost({
      url: API.USER_UPDATE_ACCESS_TOKEN,
      data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const setSubscriptionData = async (data = {}) => {
  try {
    const response = await callApiPost({
      url: API.SAVE_SUBSCRIPTION_DETAILS,
      data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSubscriptionImages = async () => {
  try {
    return await callApiGet({ url: API.FETCH_SUBSCRIPTION_IMAGES });
  } catch (error) {
    console.error("Error fetching get live stream:", error);
    throw error;
  }
};

export const getHomePageBanners = async () => {
  try {
    return await callApiGet({ url: API.FETCH_HOMEPAGE_BANNERS });
  } catch (error) {
    console.error("Error fetching get live stream:", error);
    throw error;
  }
};

export const getLiveStreamBanners = async () => {
  try {
    return await callApiGet({ url: API.FETCH_LIVESTREAM_BANNERS });
  } catch (error) {
    console.error("Error fetching get live stream:", error);
    throw error;
  }
};
