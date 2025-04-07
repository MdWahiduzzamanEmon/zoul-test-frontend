import TrackPlayer, { Event, Capability } from "react-native-track-player";
import NetInfo from "@react-native-community/netinfo";

export const PlaybackService = async function () {
  await TrackPlayer.updateOptions({
    progressUpdateEventInterval: 400,
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
    ],
  });

  const unsubscribe = NetInfo.addEventListener(async (state) => {
    if (!state.isConnected) {
      console.warn("No internet connection. Stopping playback...");
      await TrackPlayer.stop();
    }
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async (data) => {
    try {
      if (data?.nextTrack === null || data?.nextTrack === undefined) {
        console.warn("No next track available. Skipping metadata update.");
        return;
      }

      const queue = await TrackPlayer.getQueue();

      const track = await TrackPlayer.getTrack(data.nextTrack);

      if (!track || !track.id) {
        console.error("Track not found! Skipping metadata update.");
        return;
      }

      const isTrackInQueue = queue.some((t) => t.id === track.id);
      if (!isTrackInQueue) {
        console.error("Error: Track is not in the queue yet!");
        return;
      }

      // ✅ Set a temporary default metadata instead of an empty object
      await TrackPlayer.updateNowPlayingMetadata({
        title: "Loading...",
        artist: "Unknown Artist",
        artwork: "https://your-default-image-url.com/loading.jpg", // Use a real default image
        duration: 0,
      });

      // ✅ Ensure artwork is valid
      if (!track.artwork || track.artwork.trim() === "") {
        console.warn("Missing artwork! Setting default image.");
        track.artwork = "https://your-default-image-url.com/default.jpg";
      }

      // ✅ Force artwork refresh by appending a timestamp
      const artworkUrl = `${track.artwork}?timestamp=${new Date().getTime()}`;
      // ✅ Update metadata with the actual track info
      await TrackPlayer.updateNowPlayingMetadata({
        title: track.title,
        artist: track.artist || "",
        artwork: artworkUrl,
        duration: track.duration || 0,
      });
    } catch (error) {
      console.error("Error updating metadata:", error);
    }
  });

  return () => {
    unsubscribe();
  };
};
