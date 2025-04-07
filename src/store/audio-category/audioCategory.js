export const SET_SUB_CATEGORY_DETAIL = "SET_SUB_CATEGORY_DETAIL";
export const SET_SELECTED_AUDIO_DETAILS = "SET_SELECTED_AUDIO_DETAILS";
export const SET_ALL_CATEGORY_AUDIO_LIST = "SET_ALL_CATEGORY_AUDIO_LIST";

export const setSubCategoryDetail = (value) => ({
  type: SET_SUB_CATEGORY_DETAIL,
  payload: value,
});

export const setSelectedAudioDetails = (value) => ({
  type: SET_SELECTED_AUDIO_DETAILS,
  payload: value,
});

export const setAllCategoryAudioList = (value) => ({
  type: SET_ALL_CATEGORY_AUDIO_LIST,
  payload: value,
});
