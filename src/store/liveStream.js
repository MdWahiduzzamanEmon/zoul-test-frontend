const SET_LIVE_STREAMS = "SET_LIVE_STREAMS";

const initialState = {
  liveStreams: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LIVE_STREAMS:
      return {
        ...state,
        liveStreams: action.payload,
      };

    default:
      return state;
  }
};

export const setLiveStreams = (value) => {
  return {
    type: SET_LIVE_STREAMS,
    payload: value,
  };
};
