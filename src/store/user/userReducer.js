import { produce } from "immer";
import { SET_USER_PROFILE } from "./user";

const initialState = {
  userProfile: {},
};

// reducer
export default (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_USER_PROFILE:
        draft.userProfile = action?.payload;
        break;
    }
  });
