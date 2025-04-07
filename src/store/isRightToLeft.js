const IS_RIGHT_TO_LEFT = "IS_RIGHT_TO_LEFT";

const initialState = {
  isRTL: false,
};

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case IS_RIGHT_TO_LEFT:
      return {
        ...state,
        isRTL: action.payload,
      };

    default:
      return state;
  }
};

export const setRToL = (value = false) => {
  return {
    type: IS_RIGHT_TO_LEFT,
    payload: value,
  };
};
