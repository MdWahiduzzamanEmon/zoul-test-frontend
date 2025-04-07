export const FETCH_USER_REMINDERS = "FETCH_USER_REMINDERS";
export const FETCH_HOROSCOPE_REMINDER = "FETCH_HOROSCOPE_REMINDER";

export const fetchUserReminders = (value) => ({
  type: FETCH_USER_REMINDERS,
  payload: value,
});

export const fetchHoroScopeReminder = (value) => ({
  type: FETCH_HOROSCOPE_REMINDER,
  payload: value,
});
