import { produce } from "immer";

import {
  SET_AUDIO_LINK,
  SELECT_DEFAULT_AUDIO,
  SET_IS_DAILY_WISDOM_LINK,
  SET_RANDOM_IMAGES,
  SET_AUDIO_DEEPLINK,
  SET_HOROSCOPE_DEEPLINK,
  SET_PROMO_CODE_DETAILS,
} from "./audioLink";

const initialState = {
  audioLinkDetail: null,
  defaultAudio: null,
  isDailyWisdom: false,
  randomImages: [],
  audioDeeplink: null,
  isHoroscopeDeeplink: false,
  promoCodeDetails: null,
};

// reducer
export default (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_AUDIO_LINK:
        draft.audioLinkDetail = action?.payload;
        break;
      case SELECT_DEFAULT_AUDIO:
        draft.defaultAudio = action?.payload;
        break;
      case SET_IS_DAILY_WISDOM_LINK:
        draft.isDailyWisdom = action?.payload;
        break;
      case SET_RANDOM_IMAGES:
        draft.randomImages = action?.payload;
        break;
      case SET_AUDIO_DEEPLINK:
        draft.audioDeeplink = action?.payload;
        break;
      case SET_HOROSCOPE_DEEPLINK:
        draft.isHoroscopeDeeplink = action?.payload;
        break;
      case SET_PROMO_CODE_DETAILS:
        draft.promoCodeDetails = action?.payload;
        break;
    }
  });
