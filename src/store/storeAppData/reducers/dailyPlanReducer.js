import { GET_DAILY_PLANS } from "../Types";

const initialState = {
  dailyPlansData: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DAILY_PLANS:
      return {
        ...state,
        dailyPlansData: action.payload,
      };
    default:
      return state;
  }
};
