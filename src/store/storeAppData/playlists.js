export const GET_PLAYLISTS = "GET_PLAYLISTS";
export const GET_ONE_PLAYLISTS = "GET_ONE_PLAYLISTS";
export const FREE_PLAYLISTS = "FREE_PLAYLISTS";
export const MASTER_PLAYLISTS = "MASTER_PLAYLISTS";
export const GET_ALL_USER_PLAYLISTS = "GET__ALL_USER_PLAYLISTS";
export const GET_ONE_USER_PLAYLISTS = "GET__ONE_USER_PLAYLISTS";
export const GET_DOWNLOAD_AUDIO_LIST = "GET_DOWNLOAD_AUDIO_LIST";
export const GET_ALL_AUDIO_LIST = "GET_ALL_AUDIO_LIST";
export const GET_ALL_FREE_AUDIO_LIST = "GET_ALL_FREE_AUDIO_LIST";
export const SET_ALL_INITIAL_FREE_AUDIO_LIST =
  "SET_ALL_INITIAL_FREE_AUDIO_LIST";
export const GET_ALL_MASTER_AUDIO_LIST = "GET_ALL_MASTER_AUDIO_LIST";
export const SET_ALL_INITIAL_AUDIO_LIST = "SET_ALL_INITIAL_AUDIO_LIST";
export const GET_ALL_EXTRA_AUDIO_LIST = "GET_ALL_EXTRA_AUDIO_LIST";
export const SET_ALL_INITIAL_EXTRA_AUDIO_LIST =
  "SET_ALL_INITIAL_EXTRA_AUDIO_LIST";
export const SET_FREE_PLAYLISTS_BANNER_IMAGE =
  "SET_FREE_PLAYLISTS_BANNER_IMAGE";
export const SET_RECENTLY_PLAYED_PLAYLIST_BANNER_IMAGE =
  "SET_RECENTLY_PLAYED_PLAYLIST_BANNER_IMAGE";
export const SET_HOME_MASTER_PLAYLISTS_IDS = "SET_HOME_MASTER_PLAYLISTS_IDS";

export const IS_LOOPING = "IS_LOOPING";
export const LOOPED_LIST = "LOOPED_LIST";
export const LOOPED_LIST_ID = "LOOPED_LIST_ID";

export const setPlayListsData = (value) => ({
  type: GET_PLAYLISTS,
  payload: value,
});

export const setOnePlayListsData = (value) => ({
  type: GET_ONE_PLAYLISTS,
  payload: value,
});

export const setAllUserPlayListsData = (value) => ({
  type: GET_ALL_USER_PLAYLISTS,
  payload: value,
});

export const setFreePlaylists = (value) => ({
  type: FREE_PLAYLISTS,
  payload: value,
});
export const setmasterPlaylists = (value) => ({
  type: MASTER_PLAYLISTS,
  payload: value,
});
export const setOneUserPlayListsData = (value) => ({
  type: GET_ONE_USER_PLAYLISTS,
  payload: value,
});

export const setDownloadAudioListsData = (value) => ({
  type: GET_DOWNLOAD_AUDIO_LIST,
  payload: value,
});

export const setAllAudioListsData = (value) => {
  return {
    type: GET_ALL_AUDIO_LIST,
    payload: value,
  };
};

export const setAllFreeAudioListsData = (value) => {
  return {
    type: GET_ALL_FREE_AUDIO_LIST,
    payload: value,
  };
};

export const setAllInitialFreeAudios = (value) => {
  return {
    type: SET_ALL_INITIAL_FREE_AUDIO_LIST,
    payload: value,
  };
};

export const setAllmasterchoiceAudioListsData = (value) => {
  return {
    type: GET_ALL_MASTER_AUDIO_LIST,
    payload: value,
  };
};

export const setAllInitialAudios = (value) => {
  return {
    type: SET_ALL_INITIAL_AUDIO_LIST,
    payload: value,
  };
};

export const setAllExtraAudioListsData = (value) => {
  return {
    type: GET_ALL_EXTRA_AUDIO_LIST,
    payload: value,
  };
};

export const setAllInitialExtraAudios = (value) => {
  return {
    type: SET_ALL_INITIAL_EXTRA_AUDIO_LIST,
    payload: value,
  };
};

export const setFreePlaylistsBanner = (value) => {
  return {
    type: "SET_FREE_PLAYLISTS_BANNER_IMAGE",
    payload: value,
  };
};

export const setRecentlyPlayedPlaylistBanner = (value) => {
  return {
    type: "SET_RECENTLY_PLAYED_PLAYLIST_BANNER_IMAGE",
    payload: value,
  };
};

export const setHomeMasterPlaylistIds = (value) => {
  return {
    type: "SET_HOME_MASTER_PLAYLISTS_IDS",
    payload: value,
  };
};

export const setIsLooped = (value) => {
  return {
    type: IS_LOOPING,
    payload: value,
  };
};

export const setLoopedList = (value) => {
  return {
    type: LOOPED_LIST,
    payload: value,
  };
};


export const setLoopedListId = (value) => {
  return {
    type: LOOPED_LIST_ID,
    payload: value,
  };
}
