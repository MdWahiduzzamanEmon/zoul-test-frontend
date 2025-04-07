import { produce } from "immer";
import { FETCH_USER_REMINDERS, FETCH_HOROSCOPE_REMINDER } from "./setting";

const initialState = {
  userReminders: [],
  userHoroscopeReminders: [],
};

// reducer
export default (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case FETCH_USER_REMINDERS:
        draft.userReminders = action?.payload;
        break;
      case FETCH_HOROSCOPE_REMINDER:
        draft.userHoroscopeReminders = action?.payload;
        break;
    }
  });
