import { produce } from "immer";
import {
  FREE_PLAYLISTS,
  ADD_NEW_PLAYLIST,
  GET_ALL_USER_PLAYLISTS,
  GET_ONE_PLAYLISTS,
  GET_ONE_USER_PLAYLISTS,
  GET_PLAYLISTS,
  GET_DOWNLOAD_AUDIO_LIST,
  GET_ALL_AUDIO_LIST,
  GET_ALL_FREE_AUDIO_LIST,
  MASTER_PLAYLISTS,
  SET_ALL_INITIAL_AUDIO_LIST,
  SET_ALL_INITIAL_FREE_AUDIO_LIST,
  SET_ALL_INITIAL_EXTRA_AUDIO_LIST,
  GET_ALL_EXTRA_AUDIO_LIST,
  SET_FREE_PLAYLISTS_BANNER_IMAGE,
  SET_RECENTLY_PLAYED_PLAYLIST_BANNER_IMAGE,
  SET_HOME_MASTER_PLAYLISTS_IDS,
  IS_LOOPING,
  LOOPED_LIST,
  LOOPED_LIST_ID,
} from "./playlists";

const initialState = {
  getPlayListData: [],
  getOnePlayListData: {},
  getAllUserPlayListData: [],
  freePlaylists: [],
  masterPlaylists: [],
  getOneUserPlayListData: {},
  downloadAudioListData: [],
  allAudios: [],
  allFreeAudios: [],
  allInitialAudios: [],
  allFreeInitialAudios: [],
  allExtraAudios: [],
  allExtraInitialAudios: [],
  freePlaylistsBannerImage: "",
  recentlyPlayedPlaylistsBannerImage: "",
  homeMasterPlaylistIds: [],
  isLooping: false,
  loopedList: [],
  loopedListId: "",
};

// reducer
export default (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_PLAYLISTS:
        draft.getPlayListData = action?.payload;
        break;
      case GET_ONE_PLAYLISTS:
        draft.getOnePlayListData = action?.payload;
        break;
      case GET_ALL_USER_PLAYLISTS:
        draft.getAllUserPlayListData = action?.payload;
        break;
      case GET_ONE_USER_PLAYLISTS:
        draft.getAllUserPlayListData = action?.payload;
        break;
      case FREE_PLAYLISTS:
        draft.freePlaylists = action?.payload;
        break;
      case MASTER_PLAYLISTS:
        draft.masterPlaylists = action?.payload;
        break;
      case GET_DOWNLOAD_AUDIO_LIST:
        draft.downloadAudioListData = action?.payload;
        break;
      case GET_ALL_AUDIO_LIST:
        draft.allAudios = action?.payload;
        break;
      case GET_ALL_FREE_AUDIO_LIST:
        draft.allFreeAudios = action?.payload;
        break;

      case SET_ALL_INITIAL_AUDIO_LIST:
        draft.allInitialAudios = action?.payload;
        break;

      case SET_ALL_INITIAL_FREE_AUDIO_LIST:
        draft.allFreeInitialAudios = action?.payload;
        break;

      case GET_ALL_EXTRA_AUDIO_LIST:
        draft.allExtraAudios = action?.payload;
        break;

      case SET_ALL_INITIAL_EXTRA_AUDIO_LIST:
        draft.allExtraInitialAudios = action?.payload;
        break;
      case SET_FREE_PLAYLISTS_BANNER_IMAGE:
        draft.freePlaylistsBannerImage = action?.payload;
        break;
      case SET_RECENTLY_PLAYED_PLAYLIST_BANNER_IMAGE:
        draft.recentlyPlayedPlaylistsBannerImage = action?.payload;
        break;
      case SET_HOME_MASTER_PLAYLISTS_IDS:
        draft.homeMasterPlaylistIds = action?.payload;
        break;
      case IS_LOOPING:
        draft.isLooping = action?.payload;
        break;
      case LOOPED_LIST:
        draft.loopedList = action?.payload;
        break;
      case LOOPED_LIST_ID:
        draft.loopedListId = action?.payload;
        break;
    }
  });
