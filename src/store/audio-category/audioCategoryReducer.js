import { produce } from "immer";
import {
  SET_SUB_CATEGORY_DETAIL,
  SET_SELECTED_AUDIO_DETAILS,
  SET_ALL_CATEGORY_AUDIO_LIST,
} from "./audioCategory";

const initialState = {
  subCategoryDetail: {},
  selectedAudioDetails: {
    title: "",
    image: "",
    audioUrl: "",
    currentAudioIndex: 0,
    nextAudioButtonDisabled: false,
    previousAudioButtonDisabled: false,
  },
  allCategoryAudioList: [],
};

// reducer
export default (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_SUB_CATEGORY_DETAIL:
        draft.subCategoryDetail = action?.payload;
        break;
      case SET_SELECTED_AUDIO_DETAILS:
        draft.selectedAudioDetails = action?.payload;
        break;
      case SET_ALL_CATEGORY_AUDIO_LIST:
        draft.allCategoryAudioList = action?.payload;
        break;
    }
  });
