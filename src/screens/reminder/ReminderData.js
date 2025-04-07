import HoroscopeIcon from "../../assets/icons/horoscope-icon.svg";
import { dateToTime } from "../../helpers/date-converter";
const date = new Date();
export const reminderInitialData = [
  {
    id: 1,
    title: "Daily Affirmations",
    payloadTitle: "Daily Affirmation",
    icon: <HoroscopeIcon />,
    time: dateToTime(date),
    toggle: false,
    date: new Date(),
  },
  {
    id: 2,
    title: "Life Reflection",
    payloadTitle: "Reflection Timer Reminder",
    icon: <HoroscopeIcon />,
    time: dateToTime(date),
    toggle: false,
    date: new Date(),
  },
  {
    id: 3,
    title: "Goal Settings",
    payloadTitle: "Live Goal Setting Time Reminder",
    icon: <HoroscopeIcon />,
    time: dateToTime(date),
    toggle: false,
    date: new Date(),
  },
  {
    id: 4,
    title: "Mindfulness",
    payloadTitle: "Mindfulness Reminder",
    icon: <HoroscopeIcon />,
    time: dateToTime(date),
    toggle: false,
    date: new Date(),
  },
  {
    id: 5,
    title: "Meditation",
    payloadTitle: "Meditation Reminder",
    icon: <HoroscopeIcon />,
    time: dateToTime(date),
    toggle: false,
    date: new Date(),
  },
];
