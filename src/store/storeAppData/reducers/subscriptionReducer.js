import {
  IS_USER_SUBSCRIBED,
  SET_OFFERS,
  SET_PROMO_CODE_APPLIED,
  SET_SUBSCRIBED_USER,
  IS_FIRST_FREE_AUDIO_PLAY,
} from "../Types";

const initialState = {
  subscribedUser: {},
  isUserSubscribed: false,
  offers: {},
  promoCodeApplied: false,
  isFirstFreeAudioPlay: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SUBSCRIBED_USER:
      return {
        ...state,
        subscribedUser: action.payload,
      };

    case IS_USER_SUBSCRIBED:
      return {
        ...state,
        isUserSubscribed: action.payload,
      };

    case SET_OFFERS:
      return {
        ...state,
        offers: action.payload,
      };

    case SET_PROMO_CODE_APPLIED:
      return {
        ...state,
        promoCodeApplied: action.payload,
      };
    case IS_FIRST_FREE_AUDIO_PLAY:
      return {
        ...state,
        isFirstFreeAudioPlay: action.payload,
      };
    default:
      return state;
  }
};
