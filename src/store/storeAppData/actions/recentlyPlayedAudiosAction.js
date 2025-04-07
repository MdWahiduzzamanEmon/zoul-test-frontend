import { RECENTLY_PLAYED_AUDIOS } from "../Types";

export const setAudioToRecentlyPlayed = (value) => {
  return {
    type: RECENTLY_PLAYED_AUDIOS,
    payload: value,
  };
};
