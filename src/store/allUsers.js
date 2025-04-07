const SET_USERS = "SET_USERS";
const SET_SPEAKERS_META = "SET_SPEAKERS_META";

const initialState = {
  users: [],
  speakersMeta: 0,
};

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS:
      return {
        ...state,
        users:
          action.payload.currentPage === 1
            ? action.payload.users
            : [...state.users, ...action.payload.users],
      };
    case SET_SPEAKERS_META:
      return {
        ...state,
        speakersMeta: action.payload,
      };

    default:
      return state;
  }
};

export const setUsers = (value) => {
  return {
    type: SET_USERS,
    payload: value,
  };
};

export const setSpeakersMeta = (value) => {
  return {
    type: SET_SPEAKERS_META,
    payload: value,
  };
};
