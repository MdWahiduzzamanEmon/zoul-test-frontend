/**
 * @format
 */

import { AppRegistry, Text, TextInput } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import "./src/translations/i18n";
import "react-native-reanimated";
import TrackPlayer from "react-native-track-player";
import { PlaybackService } from "./src/service/player-playback.service";
import { register } from "@videosdk.live/react-native-sdk";

register();

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.setupPlayer()
  .then((_) => console.log("player setup"))
  .catch((err) => console.log("[player/error]", err));

TrackPlayer.registerPlaybackService(() => PlaybackService);

//ADD this
if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}
