import React, { useEffect } from 'react';
import Slider from '@react-native-community/slider';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { colors } from '../../styles/theme';

const SeekBarComponent = () => {
  const [value, setValue] = React.useState(0);

  const progress = useProgress();

  useEffect(() => {
    setValue(progress.position);
  }, [progress.position]);

  return (
    <Slider
      // style={{ width: '100%', height: 40 }}
      minimumValue={0}
      maximumValue={progress.duration}
      value={value}
      minimumTrackTintColor={colors.white}
      maximumTrackTintColor={'rgba(255, 255, 255, 0.1)'}
      onValueChange={newValue => setValue(newValue)}
      onSlidingComplete={newValue => {
        TrackPlayer.seekTo(newValue);
      }}
      // thumbTintColor="transparent"
    />
  );
};

export default SeekBarComponent;
