export const SET_AUDIO_LINK = "SET_AUDIO_LINK";
export const SELECT_DEFAULT_AUDIO = "SELECT_DEFAULT_AUDIO";
export const SET_IS_DAILY_WISDOM_LINK = "SET_IS_DAILY_WISDOM_LINK";
export const SET_RANDOM_IMAGES = "SET_RANDOM_IMAGES";
export const SET_AUDIO_DEEPLINK = "SET_AUDIO_DEEPLINK";
export const SET_HOROSCOPE_DEEPLINK = "SET_HOROSCOPE_DEEPLINK";
export const SET_PROMO_CODE_DETAILS = "SET_PROMO_CODE_DETAILS";

export const setAudioLinkDetail = (value) => ({
  type: SET_AUDIO_LINK,
  payload: value,
});

export const setDefaultAudioData = (value) => ({
  type: SELECT_DEFAULT_AUDIO,
  payload: value,
});

export const setIsDailyWisdom = (value) => ({
  type: SET_IS_DAILY_WISDOM_LINK,
  payload: value,
});

export const setRandomImages = (value) => ({
  type: SET_RANDOM_IMAGES,
  payload: value,
});

export const audioDeepLink = (value) => {
  return {
    type: SET_AUDIO_DEEPLINK,
    payload: value,
  };
};

export const horoscopeDeepLink = (value) => {
  return {
    type: SET_HOROSCOPE_DEEPLINK,
    payload: value,
  };
};

export const promoCodeDetails = (value) => {
  return {
    type: SET_PROMO_CODE_DETAILS,
    payload: value,
  };
};
