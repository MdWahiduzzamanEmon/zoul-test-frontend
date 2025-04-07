import React, { useState } from 'react';
import { usePlayer } from '../modules/player';

interface BottomSheetState {
  selectedSnappoint: number;
  setSelectedSnappoint: React.Dispatch<React.SetStateAction<number>>;
  trackForBottomSheet: string;
  openBottomSheet: () => void;
  selectedMode: 'display' | 'create';
  selectDisplayMode: () => void;
  selectCreateMode: () => void;
}

const useUserPlaylistBottomsheet = (): BottomSheetState => {
  const player = usePlayer();
  const [trackForBottomSheet, setTrackForBottomSheet] = useState('');
  const [selectedSnappoint, setSelectedSnappoint] = useState<number>(-1);
  const [selectedMode, setSelectedMode] = useState<'display' | 'create'>('display');
  const selectDisplayMode = () => {
    setSelectedMode('display');
    setSelectedSnappoint(0);
  };
  const selectCreateMode = () => {
    setSelectedMode('create');
    setSelectedSnappoint(0);
  };

  const openBottomSheet = () => {
    selectDisplayMode();
    setTrackForBottomSheet(player.activeTrack.id);
  };

  return {
    selectedSnappoint,
    setSelectedSnappoint,
    trackForBottomSheet,
    openBottomSheet,
    selectedMode,
    selectDisplayMode,
    selectCreateMode,
  };
};

export default useUserPlaylistBottomsheet;
