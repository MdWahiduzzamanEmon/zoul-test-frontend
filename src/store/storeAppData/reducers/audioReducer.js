// reducers/audioReducer.js
import {
  SET_CURRENT_AUDIO,
  TOGGLE_BOTTOM_SHEET,
} from "../actions/audioActions";

const initialState = {
  currentAudio: null,
  isBottomSheetVisible: false,
};

const audioReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_AUDIO:
      return { ...state, currentAudio: action.payload };
    case TOGGLE_BOTTOM_SHEET:
      return { ...state, isBottomSheetVisible: action.payload };
    default:
      return state;
  }
};

export default audioReducer;
