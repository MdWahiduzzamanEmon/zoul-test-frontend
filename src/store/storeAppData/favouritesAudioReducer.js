import { produce } from "immer";
import {
  ADD_AUDIO_TO_FAVOURITES,
  GET_USER_FAVOURITES,
  REMOVE_AUDIO_FROM_FAVOURITES,
} from "./favouritesAudio";

const initialState = {
  favourites: [], // Initialize favourites as an empty array
};

const favouritesReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ADD_AUDIO_TO_FAVOURITES:
        draft.favourites = action.payload;
        break;

      case REMOVE_AUDIO_FROM_FAVOURITES:
        draft.favourites = action.payload;
        break;

      case GET_USER_FAVOURITES:
        draft.favourites = action.payload;
        break;

      default:
        break;
    }
  });

export default favouritesReducer;
