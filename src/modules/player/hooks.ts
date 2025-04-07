// import { useContext, useEffect, useState } from "react";
// import { PlayerContext } from "./context";
// import { Track } from "./types";
// import TrackPlayer, { RepeatMode, State } from "react-native-track-player";
// import { useSelector } from "react-redux";
// // import { consoleLog } from "../../styles/mixins";
// import { getTransformedUrl } from "../../utils/ImageService";

// export interface UsePlayerReturnType {
//   queue: Track[] | undefined;
//   activeTrack: Track;
//   state: State;
//   addTraksToQueue: (tracks: Track[]) => Promise<number | void>;
//   play: () => Promise<void>;
//   pause: () => Promise<void>;
//   reset: () => Promise<void>;
//   prev: (initialPosition?: number | undefined) => Promise<void>;
//   next: (initialPosition?: number | undefined) => Promise<void>;
//   toggleRepeatMode: () => void;
//   activeRepeatMode: RepeatMode;
//   setQueue: (
//     tracks: Track[],
//     activeTrack: Track,
//     playlistId?: string,
//     isSharedAudio?: boolean,
//     isDefaultAudio?: boolean
//   ) => Promise<void>;
//   like: () => Promise<boolean>;
//   unlike: () => Promise<boolean>;
// }

// export const usePlayer = (): UsePlayerReturnType => {
//   const context = useContext(PlayerContext);
//   const isUserSubscribed = useSelector(
//     (state: any) => state?.subscription?.isUserSubscribed
//   );
//   if (!context) {
//     throw new Error("usePlayer must be used within a PlayerContext.Provider");
//   }

//   const [mode, setMode] = useState<RepeatMode>(RepeatMode.Queue);

//   useEffect(() => {
//     const fetchPlaybackMode = async () => {
//       const locMode = await TrackPlayer.getRepeatMode();
//       setMode(locMode);
//     };

//     fetchPlaybackMode();
//   }, []);

//   const toggleRepeatMode = () => {
//     if (mode === RepeatMode.Queue) {
//       setMode(RepeatMode.Track);
//       TrackPlayer.setRepeatMode(RepeatMode.Track);
//     } else {
//       setMode(RepeatMode.Queue);
//       TrackPlayer.setRepeatMode(RepeatMode.Queue);
//     }
//   };

//   return {
//     queue: context.queue,
//     activeTrack: context.currentTrackInfo,
//     state: context.playerState,
//     addTraksToQueue: async (tracks: Track[]) => {
//       await TrackPlayer.add(tracks);
//       context.setQueue((prev) => {
//         if (!prev) {
//           return prev;
//         }
//         return [...prev, ...tracks];
//       });
//     },
//     setQueue: async (
//       tracks: Track[],
//       activeTrack: Track,
//       playlistId: string | undefined,
//       isSharedAudio?: boolean,
//       isDefaultAudio?: boolean
//     ) => {
//       if (!isSharedAudio && !isDefaultAudio) {
//         if (!isUserSubscribed) {
//           tracks = tracks.filter((track) => !track.premium);
//         }
//       }
//       // const indexInQueue = tracks.findIndex(
//       //   (track) => track.id === activeTrack.id
//       // );

//       const indexInQueue = tracks.findIndex((track) => {
//         console.log("track", track);
//         console.log("activeTrack", activeTrack);
//         if (track?.playlistId != undefined && track?.playlistId != null) {
//           return (
//             track.playlistId === activeTrack.playlistId &&
//             track.id === activeTrack.id
//           );
//         } else {
//           return track.id === activeTrack.id;
//         }
//       });

//       if (indexInQueue === -1) {
//         console.error("no index matches");
//         return;
//       }

//       try {
//         // Ensure all tracks have a valid artwork URL
//         const updatedTracks = tracks.map((track) => {
//           if (!track.artwork || track.artwork.trim() === "") {
//             // Provide a default artwork URL or remove the artwork property
//             return {
//               ...track,
//               playlistId:
//                 typeof playlistId === "string"
//                   ? playlistId
//                   : track?.playlistId ?? "",
//               artwork: track?.coverFull
//                 ? getTransformedUrl(track?.coverFull)
//                 : "https://zoul-prod-assets.s3.eu-west-2.amazonaws.com/audios/ffd73786-ba73-42c9-93e0-3b01b602715d/1729249191940.mp3", // Replace with your default artwork URL
//             };
//           }

//           return track;
//         });

//         await TrackPlayer.setQueue(updatedTracks);
//         await TrackPlayer.skip(indexInQueue);
//       } catch (err: Error | unknown) {
//         if (err instanceof Error) {
//           console.error(err);
//         }
//       }
//       context.setQueue(tracks);
//       // context.setCurrentTrackInfo(activeTrack);
//       context.setCurrentTrackInfo({
//         ...activeTrack,
//         playlistId:
//           playlistId && typeof playlistId === "string"
//             ? playlistId
//             : activeTrack?.playlistId &&
//               typeof activeTrack?.playlistId === "string"
//             ? activeTrack?.playlistId
//             : "", // Store the playlist ID in context with the active track
//       });
//       // context.setCurrentPlaylistId(playlistId ?? activeTrack?.playlistId);
//     },
//     play: () => TrackPlayer.play(),
//     pause: () => TrackPlayer.pause(),
//     reset: () => TrackPlayer.reset(),
//     prev: () => TrackPlayer.skipToPrevious(),
//     next: () => TrackPlayer.skipToNext(),
//     toggleRepeatMode: () => toggleRepeatMode(),
//     activeRepeatMode: mode,
//     like: async () => {
//       const userId = "";
//       context.setCurrentTrackInfo((prev) => ({ ...prev, likes: [userId] }));
//       return true;
//     },
//     unlike: async () => {
//       const userId = "";
//       context.setCurrentTrackInfo((prev) => ({ ...prev, likes: [userId] }));
//       return true;
//     },
//   };
// };

import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "./context";
import { Track } from "./types";
import TrackPlayer, { RepeatMode, State } from "react-native-track-player";
import { useSelector } from "react-redux";
import { getTransformedUrl } from "../../utils/ImageService";

export interface UsePlayerReturnType {
  queue: Track[] | undefined;
  activeTrack: Track;
  state: State;
  addTraksToQueue: (tracks: Track[]) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  reset: () => Promise<void>;
  prev: () => Promise<void>;
  next: () => Promise<void>;
  toggleRepeatMode: () => void;
  activeRepeatMode: RepeatMode;
  setQueue: (
    tracks: Track[],
    activeTrack: Track,
    playlistId?: string,
    isSharedAudio?: boolean,
    isDefaultAudio?: boolean
  ) => Promise<void>;
  like: () => Promise<boolean>;
  unlike: () => Promise<boolean>;
}

export const usePlayer = (): UsePlayerReturnType => {
  const context = useContext(PlayerContext);
  const isUserSubscribed = useSelector(
    (state: any) => state?.subscription?.isUserSubscribed
  );

  if (!context) {
    throw new Error("usePlayer must be used within a PlayerContext.Provider");
  }

  const [mode, setMode] = useState<RepeatMode>(RepeatMode.Queue);

  useEffect(() => {
    TrackPlayer.getRepeatMode().then(setMode);
  }, []);

  const toggleRepeatMode = () => {
    const newMode =
      mode === RepeatMode.Queue ? RepeatMode.Track : RepeatMode.Queue;
    setMode(newMode);
    TrackPlayer.setRepeatMode(newMode);
  };

  const play = async () => {
    await TrackPlayer.play();
  };

  const pause = async () => {
    await TrackPlayer.pause();
  };

  const reset = async () => {
    await TrackPlayer.reset();
  };

  const prev = async () => {
    await TrackPlayer.skipToPrevious();
  };

  const next = async () => {
    const queue = await TrackPlayer.getQueue();
    const currentTrack = await TrackPlayer.getCurrentTrack();

    if (currentTrack !== null && currentTrack < queue.length - 1) {
      await TrackPlayer.skipToNext();
      await TrackPlayer.play();
    } else if (mode === RepeatMode.Queue && queue.length > 0) {
      await TrackPlayer.skip(0);
      await TrackPlayer.play();
    }
  };

  const addTraksToQueue = async (tracks: Track[]) => {
    await TrackPlayer.add(tracks);
    context.setQueue((prev) => (prev ? [...prev, ...tracks] : tracks));
  };

  const setQueue = async (
    tracks: Track[],
    activeTrack: Track,
    playlistId?: string,
    isSharedAudio?: boolean,
    isDefaultAudio?: boolean
  ) => {
    // Filter based on subscription
    if (!isSharedAudio && !isDefaultAudio && !isUserSubscribed) {
      tracks = tracks.filter((track) => !track.premium);
    }

    // Filter tracks belonging to the same playlist
    const playlistTracks = tracks.filter(
      (track) =>
        track.playlistId === activeTrack.playlistId ||
        track.playlistId === playlistId
    );

    const indexInQueue = playlistTracks.findIndex(
      (track) => track.id === activeTrack.id
    );

    if (indexInQueue === -1) {
      console.error("Active track not found in playlist.");
      return;
    }

    // Normalize artwork
    const normalizedTracks = playlistTracks.map((track) => ({
      ...track,
      playlistId: playlistId ?? track.playlistId ?? "",
      artwork:
        track.artwork?.trim() ||
        getTransformedUrl(track.coverFull) ||
        "https://default-artwork-url.com/fallback.png",
    }));

    try {
      await TrackPlayer.reset(); // Clear old queue
      await TrackPlayer.add(normalizedTracks);
      await TrackPlayer.skip(indexInQueue);
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);
      await TrackPlayer.play(); // Autoplay
    } catch (err) {
      console.error("Failed to set queue or play:", err);
    }

    context.setQueue(normalizedTracks);
    context.setCurrentTrackInfo({
      ...activeTrack,
      playlistId: playlistId ?? activeTrack?.playlistId ?? "",
    });
  };

  const like = async () => {
    const userId = "";
    context.setCurrentTrackInfo((prev) => ({
      ...prev,
      likes: [userId],
    }));
    return true;
  };

  const unlike = async () => {
    const userId = "";
    context.setCurrentTrackInfo((prev) => ({
      ...prev,
      likes: [],
    }));
    return true;
  };

  return {
    queue: context.queue,
    activeTrack: context.currentTrackInfo,
    state: context.playerState,
    addTraksToQueue,
    play,
    pause,
    reset,
    prev,
    next,
    toggleRepeatMode,
    activeRepeatMode: mode,
    setQueue,
    like,
    unlike,
  };
};
