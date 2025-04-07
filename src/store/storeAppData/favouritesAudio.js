// actionTypes.js
export const ADD_AUDIO_TO_FAVOURITES = "ADD_AUDIO_TO_FAVOURITES";
export const REMOVE_AUDIO_FROM_FAVOURITES = "REMOVE_AUDIO_FROM_FAVOURITES";
export const GET_USER_FAVOURITES = "GET_USER_FAVOURITES";

export const addAudioToFavourites = (audioData) => ({
  type: ADD_AUDIO_TO_FAVOURITES,
  payload: audioData,
});

export const removeAudioFromFavourites = (audioId) => ({
  type: REMOVE_AUDIO_FROM_FAVOURITES,
  payload: audioId,
});

export const getUserFavourites = (value) => ({
  type: GET_USER_FAVOURITES,
  payload: value,
});
