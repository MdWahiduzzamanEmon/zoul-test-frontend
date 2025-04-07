import { ISource } from "shared/types/track";

export interface Track {
  id: string;
  url: string;
  sources: Record<string, ISource>;
  title: string;
  album: string;
  genre: string;
  artwork: string;
  duration: number;
  likes: string[];
  premium: boolean;
  coverFull: string;
  playlistId: string;
}
