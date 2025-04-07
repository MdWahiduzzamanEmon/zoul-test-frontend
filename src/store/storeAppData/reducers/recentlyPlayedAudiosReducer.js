import { RECENTLY_PLAYED_AUDIOS } from "../Types";

const initialState = {
  recentlyPlayedAudios: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RECENTLY_PLAYED_AUDIOS:
      return {
        ...state,
        recentlyPlayedAudios: action.payload,
      };
    default:
      return state;
  }
};
