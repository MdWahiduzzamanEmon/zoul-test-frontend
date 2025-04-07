const initialState = {
  selectedLanguage: "en", 
};

export default function languageReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_LANGUAGE":
      return {
        ...state,
        selectedLanguage: action.payload,
      };
    default:
      return state;
  }
}
