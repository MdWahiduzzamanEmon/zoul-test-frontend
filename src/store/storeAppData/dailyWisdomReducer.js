import { produce } from "immer";
import { GET_DAILY_WISDOM } from "./dailyWisdom";
import { GET_HOROSCOPE } from "./dailyWisdom";

const initialState = {
  getDailyWisdomData: {},
  horoscopeData: [],
};

// reducer
export default (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_DAILY_WISDOM:
        draft.getDailyWisdomData = action?.payload;
        break;
      case GET_HOROSCOPE:
        draft.horoscopeData = action?.payload;
        break;
    }
  });
