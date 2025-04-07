import { Track as TrackPlayerTrack } from "react-native-track-player";
import { Track } from "./types";

export const convertToTrack = (track: TrackPlayerTrack): Track => {
  return {
    id: track?.id ?? track?.objectID,
    url: track?.link,
    sources: track?.sources ?? "",
    title: track?.title ? track?.title : "",
    album: track.category ?? "",
    genre: track.authorName ?? "",
    artwork: track.cover ?? "",
    coverFull: track?.bannerImage ?? track.coverFull ?? "",
    duration: track.duration ? track.duration : 0,
    likes: track.likes ?? [],
    premium: track.premium,
    playlistId:track?.playlistId,
  };
};

export const mapToTrackFlyweight = (tracks: TrackPlayerTrack[]): Track[] =>
  tracks.map(convertToTrack);

export const isLiked = (track: Track): boolean => {
  if (!track) {
    return false;
  }

  if (!track.likes && track.likes.length < 1) {
    return false;
  }

  return track.likes.includes("");
};
