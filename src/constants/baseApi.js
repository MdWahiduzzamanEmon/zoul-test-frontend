const { envConfig } = require("../config/config");
const BASE_URL = envConfig.BASE_URL;

const API = {
  /** AUTH **/
  // LOGIN: BASE_URL + "users/sign-in",
  LOGIN: BASE_URL + "users/mobile-sign-in",
  REGISTER: BASE_URL + "users/sign-up",
  GOOGLE_SIGN_IN: BASE_URL + "users/google",
  FACEBOOK_SIGN_IN: BASE_URL + "users/facebook",
  APPLE_SIGN_IN: BASE_URL + "users/apple",
  VERIFY_EMAIL: BASE_URL + "users/email-verification",
  FORGOT_PASSWORD: BASE_URL + "users/request-for-reset-password",
  RESET_PASSWORD: BASE_URL + "users/reset-password",
  GET_PROFILE: BASE_URL + "users/me",
  UPDATE_PROFILE: BASE_URL + "users/customer-profile",
  REMINDER: BASE_URL + "reminders",
  UXCAM: BASE_URL + "config/uxcam",
  APP_FEATURE: BASE_URL + "config/app-features",
  USER_EMAIL_EXIST: BASE_URL + "users/user-exist-or-not",
  LOGIN_REQUEST_BY_ZOUL_CHECKOUT_TOKEN:
    BASE_URL + "users/login-request-by-token",
  USER_REFRESH_TOKEN: BASE_URL + "users/refresh-access-token",
  USER_RESEND_VERIFICATION_CODE:
    BASE_URL + "users/resend/email-verification-code",
  USER_UPDATE_ACCESS_TOKEN: BASE_URL + "users/update-access-token",
  USER_SIGNUP_WITH_PHONE_NUMBER: BASE_URL + "users/sign-up-with-phone-number",
  REQUEST_RESET_PASSWORD_WITH_PHONE_NUMBER:
    BASE_URL + "users/request-for-reset-password-using-phone-number",
  USER_RESET_PASSWORD_WITH_PHONE_NUMBER:
    BASE_URL + "users/reset-password-using-phone-number",

  /** APP **/
  CATEGORIES: BASE_URL + "categories",
  GLOBAL_CONTENT: BASE_URL + "global-content?page=",
  SUB_CATEGORIES: BASE_URL + "sub-categories",
  ONE_CATEGORIE: BASE_URL + "categories/",
  PLAYLISTS: BASE_URL + "playlists",
  SINGLE_GOAL: BASE_URL + "sub-categories/",

  /** HOME SCREEN **/
  GLOBAL_CONTENT_HOME: BASE_URL + "global-content/home",
  DAILY_WISDOM: BASE_URL + "daily-wisdom/today",
  HOROSCOPE_TODAY: BASE_URL + "horoscopes?date=",
  DAILY_PLAY: BASE_URL + "audios/daily-plan?page=",

  /** EXPLORE SCREEN **/
  GLOBAL_CONTENT_EXPLORE: BASE_URL + "global-content/explore",

  /** USER PLAYLIST **/
  ONE_PLAYLIST: BASE_URL + "playlists/",
  GET_ALL_USER_PLAYLISTS: BASE_URL + "user-playlists/",
  CREATE_USER_PLAYLISTSDATA: BASE_URL + "user-playlists/",
  Delete_PLAYLIST: BASE_URL + "user-playlists/",
  UPDATE_USER_PLAYLISTS: BASE_URL + "user-playlists/",
  UPDATE_USER_PROFILE: BASE_URL + "file/profile-upload",

  /** AUDIO FAVOURITE **/
  ADD_FAVOURITES_AUDIO: BASE_URL + "user-favourites/add-audio/",
  REMOVE_FAVOURITES_AUDIO: BASE_URL + "user-favourites/remove-audio/",
  GET_FAVOURITES_AUDIO: BASE_URL + "user-favourites",
  CREATE_USER_PLAYLISTS: BASE_URL + "user-playlists/",

  // UPDATE_USER_PLAYLISTS: BASE_URL + "user-playlists/",
  GET_ONE_USER_PLAYLISTS: BASE_URL + "user-playlists/",
  GET_SINGLE_USER_PLAYLISTS: BASE_URL + "user-playlists/",

  /** USER RECENLTY PLAYED AUDIOS **/
  GET_RECENTLY_PLAYED_AUDIOS: BASE_URL + "user-recently-played-audios",
  ADD_RECENTLY_PLAYED_AUDIO:
    BASE_URL + "user-recently-played-audios/add-audio/",

  // Settings
  FETCH_REMINDERS: BASE_URL + "reminders/notification",
  FETCH_HOROSCOPE_REMINDERS: BASE_URL + "reminders/horoscope",
  UPDATE_USER_PASSWORD: BASE_URL + "users/change-password",
  DELETE_USER_ACCOUNT: BASE_URL + "users/delete-my-profile",
  SUPPORT_REQUEST: BASE_URL + "support-request",
  UPDATE_USER_EMAIL: BASE_URL + "users/email",
  GUEST_PASS: BASE_URL + "promo-code/guest-pass",

  // PROMO CODE
  APPLY_PROMO_CODE: BASE_URL + "promo-code/verify",
  ADD_AUDIO_TO_PLAYLIST: BASE_URL + "user-playlists/",
  REDEEMABLE_CODE: BASE_URL + "user-subscription/redeemable",
  UPDATE_AUDIO_IN_PLAYLISTS:
    BASE_URL + "user-playlists/update-audio-in-playlists",

  // SUBSCRIPTION_DETAILS
  MY_SUBSCRIPTION_DETAILS: BASE_URL + "users/my-subscription-plan",
  TRACK_PROMO_COAD: BASE_URL + "promo-code/track-code",

  // GETTING SINGLE AUDIO
  GET_SINGLE_AUDIO: BASE_URL + "audios/",
  LIVE_STREAM: BASE_URL + "livestream/",
  JOIN_LIVE_STREAM: BASE_URL + "livestream/{livestream-id}/room-token",
  END_LIVE_STREAM: BASE_URL + "livestream/{livestream-id}/endstream",
  GET_USERS: BASE_URL + "users/speakers",

  // VERSION
  VERSION: BASE_URL + "config/version",
  // RATING POPUP
  RATING_POPUP: BASE_URL + "config/ratingpopup",

  // Generate signed URL
  GENERATE_SIGNED_URL: BASE_URL + "signing/resources",

  // fetch images https://api.zoul.app/config/randomaudioimages
  FETCH_IMAGES: BASE_URL + "config/randomaudioimages",

  SAVE_SUBSCRIPTION_DETAILS: BASE_URL + "inapp-purchases/save",

  //Event Logging
  LOG_EVENT: BASE_URL + "event-activity-log/create",
  FETCH_SUBSCRIPTION_IMAGES: BASE_URL + "subscription-images/images",
  FETCH_HOMEPAGE_BANNERS: BASE_URL + "home-page-banners/get",
  FETCH_LIVESTREAM_BANNERS: BASE_URL + "live-stream-banners/get",
  USER_SIGNUP: BASE_URL + "users/mobile-sign-up",
};

export default API;
