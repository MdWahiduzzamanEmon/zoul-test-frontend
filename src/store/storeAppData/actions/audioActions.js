// actions/audioActions.js

export const SET_CURRENT_AUDIO = 'SET_CURRENT_AUDIO';
export const TOGGLE_BOTTOM_SHEET = 'TOGGLE_BOTTOM_SHEET';

export const setCurrentAudio = (audio) => ({
  type: SET_CURRENT_AUDIO,
  payload: audio,
});

export const toggleBottomSheet = (isVisible) => ({
  type: TOGGLE_BOTTOM_SHEET,
  payload: isVisible,
});
