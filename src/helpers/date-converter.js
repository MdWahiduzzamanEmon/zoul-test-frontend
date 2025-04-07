export const dateToTime = (date) => {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Convert hours from 24-hour to 12-hour format
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
  const period = hours >= 12 ? "PM" : "AM";

  const formattedTime = `${String(formattedHours).padStart(
    2,
    "0"
  )}:${minutes} ${period}`;
  return formattedTime;
};
