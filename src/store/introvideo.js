const INTRO_VIDEO = "INTRO_VIDEO";
const DEEP_LINK_USED = "DEEP_LINK_USED";

const initialState = {
  introVideo: true,
  isDeeplinkUsed: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case INTRO_VIDEO:
      return {
        ...state,
        introVideo: action.payload,
      };

    case DEEP_LINK_USED:
      return {
        ...state,
        isDeeplinkUsed: action.payload,
      };
    default:
      return state;
  }
};

export const setIntroVideoVisibility = () => {
  return {
    type: INTRO_VIDEO,
    payload: false,
  };
};

export const setDeeplinkUsed = (value) => {
  return {
    type: DEEP_LINK_USED,
    payload: value,
  };
};
