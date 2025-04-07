export const GET_DAILY_WISDOM = "GET_DAILY_WISDOM";
export const GET_HOROSCOPE = "GET_HOROSCOPE";

export const setDailyWisdomData = (value) => ({
  type: GET_DAILY_WISDOM,
  payload: value,
});

export const persistHoroscopeData = (value) => {
  return {
    type: GET_HOROSCOPE,
    payload: value,
  };
};
