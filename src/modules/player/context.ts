import { createContext } from 'react';
import { Track } from './types';
import { State } from 'react-native-track-player';

export interface PlayerContextType {
  value: string;
  setValue: (value: string) => void;
  queue: Track[] | undefined;
  setQueue: React.Dispatch<React.SetStateAction<Track[] | undefined>>;
  currentTrackInfo: Track;
  setCurrentTrackInfo: (info: Track) => void;
  setCurrentPlaylistId: (playlistId: string) => void;
  playerState: State;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);
