import { produce } from "immer";
import {
  GET_CATEGORIES,
  GET_SUB_CATEGORIES,
  ONE_CATEGORIES,
  ONE_SUB_CATEGORIES,
  SELECT_AUDIO,
} from "./categories";

const initialState = {
  getCategoriesData: [],
  getSubCategoriesData: [],
  getOneCategoriesData: {},
  selectPlayListData: {},
};

// reducer
export default (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_CATEGORIES:
        draft.getCategoriesData = action?.payload;
        break;
      case GET_SUB_CATEGORIES:
        draft.getSubCategoriesData = action?.payload;
        break;
      case ONE_CATEGORIES:
        draft.getOneCategoriesData = action?.payload;
        break;
      case SELECT_AUDIO:
        draft.selectPlayListData = action?.payload;
        break;
    }
  });
