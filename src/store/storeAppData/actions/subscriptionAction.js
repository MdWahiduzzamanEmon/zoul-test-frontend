import {
  IS_USER_SUBSCRIBED,
  SET_OFFERS,
  SET_PROMO_CODE_APPLIED,
  SET_SUBSCRIBED_USER,
  IS_FIRST_FREE_AUDIO_PLAY,
} from "../Types";

export const setSubscribedUser = (subscribedUser) => {
  return {
    type: SET_SUBSCRIBED_USER,
    payload: subscribedUser,
  };
};

export const setIsUserSubscribed = (value) => {
  return {
    type: IS_USER_SUBSCRIBED,
    payload: value,
  };
};

export const setOffers = (offers) => {
  return {
    type: SET_OFFERS,
    payload: offers,
  };
};

export const setPromoCodeApplied = (value) => {
  return {
    type: SET_PROMO_CODE_APPLIED,
    payload: value,
  };
};

export const setIsFirstFreeAudioPlay = (value) => {
  return {
    type: IS_FIRST_FREE_AUDIO_PLAY,
    payload: value,
  };
};
