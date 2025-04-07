import { GET_DAILY_PLANS } from "../Types";

export const setDailyPlansData = (value) => {
  return {
    type: GET_DAILY_PLANS,
    payload: value,
  };
};
