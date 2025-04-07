import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { createReducerManager } from "./reducerManager";
import auth from "./auth";
import notifications from "./notifications";
import { composeWithDevTools } from "@redux-devtools/extension";
import isRightToLeft from "./isRightToLeft";
import liveStreamReducer from "./liveStream";
import allUsersReducer from "./allUsers";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "./authReducer";
import categoriesReducer from "./storeAppData/categoriesReducer";
import dailyWisdomReducer from "./storeAppData/dailyWisdomReducer";
import playlistsReducer from "./storeAppData/playlistsReducer";
import userReducer from "./user/userReducer";
import favouritesAudioReducer from "./storeAppData/favouritesAudioReducer";
import dailyPlanReducer from "./storeAppData/reducers/dailyPlanReducer";
import recentlyPlayedAudiosReducer from "./storeAppData/reducers/recentlyPlayedAudiosReducer";
import introvideo from "./introvideo";
import settingReducer from "./settings/settingReducer";
import languageReducer from "./language";
import subCategoryAudioReducer from "./audio-category/audioCategoryReducer";
import subscriptionReducer from "./storeAppData/reducers/subscriptionReducer";
import audioLinkReducer from "./audio-category/audioLinkReducer";

const initialReducers = {
  authReducer,
  notifications,
  isRightToLeft,
  liveStreamReducer,
  playlistsReducer,
  categoriesReducer,
  allUsersReducer,
  dailyWisdomReducer,
  userReducer,
  favouritesAudioReducer,
  dailyPlanReducer,
  recentlyPlayedAudiosReducer,
  introvideo,
  settingReducer,
  language: languageReducer,
  subCategoryAudioReducer,
  audioLinkReducer,
  subscription: subscriptionReducer,
};

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whilelist: [
    "authReducer",
    "dailyWisdomReducer",
    "subscription",
    "userReducer",
  ],
  blacklist: [
    "introvideo",
    "playlistsReducer",
    "categoriesReducer",
    "favouritesAudioReducer",
    "audioLinkReducer",
    "recentlyPlayedAudiosReducer",
    "dailyPlanReducer",
    "isRightToLeft",
    "notifications",
  ],
};

export default function configureStore(preloadedState) {
  const reducerManager = createReducerManager(initialReducers);

  const rootReducer = (state, action) => {
    return reducerManager.reduce(state, action);
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(
    persistedReducer,
    preloadedState,
    composeWithDevTools(applyMiddleware(thunk))
  );

  store.reducerManager = reducerManager;

  const persistor = persistStore(store);

  return { store, persistor };
}
