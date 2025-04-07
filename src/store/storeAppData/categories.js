export const GET_CATEGORIES = "GET_CATEGORIES";
export const GET_SUB_CATEGORIES = "GET_SUB_CATEGORIES";
export const ONE_CATEGORIES = "ONE_CATEGORIES";
export const SELECT_AUDIO = "SELECT_AUDIO";
export const setCategoriesData = (value) => ({
  type: GET_CATEGORIES,
  payload: value,
});

export const setSubCategoriesData = (value) => ({
  type: GET_SUB_CATEGORIES,
  payload: value,
});

export const setOneCategoriesData = (value) => ({
  type: ONE_CATEGORIES,
  payload: value,
});

export const setSelectedAudioData = (value) => ({
  type: SELECT_AUDIO,
  payload: value,
});
