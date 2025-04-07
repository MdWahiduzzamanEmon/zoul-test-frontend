import { produce } from "immer";
import {
  IS_LOADER,
  REMOVE_AUTH_TOKEN,
  SET_AUTH_TOKEN,
  SET_LANGUAGE,
  SET_LOGOUT_FLAG,
  USER_ENTER_FIRST_TIME,
} from "./auth";

const initialState = {
  authToken: "",
  isSocialLoading: false,
  selectedLanguage: "English",
  logoutFlag: false,
  isEnterFirstTime: true,
};

// reducer
export default (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_AUTH_TOKEN:
        draft.authToken = action.payload;
        break;

      case REMOVE_AUTH_TOKEN:
        draft.authToken = "";
        break;

      case IS_LOADER:
        draft.isSocialLoading = action.payload;
        break;

      case SET_LANGUAGE: // Handle setting language
        draft.selectedLanguage = action.payload;
        break;

      case SET_LOGOUT_FLAG:
        draft.logoutFlag = action.payload;
        break;

      case USER_ENTER_FIRST_TIME:
        draft.isEnterFirstTime = action.payload;
        break;
    }
  });
