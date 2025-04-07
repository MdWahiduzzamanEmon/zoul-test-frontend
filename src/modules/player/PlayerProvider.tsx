import React, { PropsWithChildren, useEffect, useState } from "react";
import { PlayerContext, PlayerContextType } from "./context";
import { Track } from "./types";
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
  State,
  RepeatMode,
} from "react-native-track-player";
import { SmallPlayerProvider } from "./SmallPlayerProvider";

const emptyTrackInfo: Track = {
  url: "",
  title: "",
  duration: 0,
  artwork: "",
  album: "",
  genre: "",
  likes: [],
  playlistId: "",
};

const events = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.PlaybackActiveTrackChanged,
];

export const PlayerProvider = ({
  children,
}: PropsWithChildren): React.JSX.Element => {
  const [value, setValue] = useState<string>("");

  // undefined mean player queue in not inialized
  const [queue, setQueue] = useState<Track[] | undefined>(undefined);
  const [currentTrackInfo, setCurrentTrackInfo] =
    useState<Track>(emptyTrackInfo);
  const [playerState, setPlayerState] = useState<State>(State.None);

  useTrackPlayerEvents(events, async (event) => {
    switch (event.type) {
      case Event.PlaybackError:
        break;
      case Event.PlaybackState:
        setPlayerState(event.state);
        break;
      case Event.PlaybackActiveTrackChanged:
        if (event.track) {
          setCurrentTrackInfo({ ...event.track });
          return;
        }
        setCurrentTrackInfo(emptyTrackInfo);
        break;
      default:
        console.log("should not reach at this point.");
    }
  });

  useEffect(() => {
    TrackPlayer.setRepeatMode(RepeatMode.Queue);
  }, []);

  // debug info
  useEffect(() => {
    console.log("[player-state]: ", playerState);
  }, [playerState]);

  useEffect(() => {
    console.log("[player-current-track]: ", currentTrackInfo);
  }, [currentTrackInfo]);

  // useEffect(() => {
  //   // console.log('[player-queue]: ', queue);
  //   TrackPlayer.getQueue().then(q => console.log('TrackPlayer.getQueue', q));
  // }, [queue]);

  const contextValue: PlayerContextType = {
    value,
    setValue,
    queue,
    setQueue,
    currentTrackInfo,
    setCurrentTrackInfo,
    setCurrentPlaylistId: () => {},
    playerState,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      <SmallPlayerProvider>{children}</SmallPlayerProvider>
    </PlayerContext.Provider>
  );
};
