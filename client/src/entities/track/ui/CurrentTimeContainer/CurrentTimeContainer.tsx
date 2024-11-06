import { audioManager, formatTime } from '@/shared';
import styles from './CurrentTimeContainer.module.scss';
import { FC, useEffect, useCallback } from 'react';
import { usePlayerStore, useTrackTimeStore } from '@/entities';

interface CurrentTimeContainerProps {
  duration: string | undefined;
}

export const CurrentTimeContainer: FC<CurrentTimeContainerProps> = ({ duration }) => {
  const currentTime = useTrackTimeStore(state => state.currentTime);
  const setCurrentTime = useTrackTimeStore(state => state.setCurrentTime);
  const setDuration = useTrackTimeStore(state => state.setDuration);
  const activeTrack = usePlayerStore(state => state.activeTrack);
  const audio = audioManager.audio;

  const handleLoadedMetadata = useCallback(() => {
    if (audio) {
      setDuration(Math.ceil(audio.duration));
    }
  }, [audio, setDuration]);

  const handleTimeUpdate = useCallback(() => {
    if (audio) {
      setCurrentTime(Math.ceil(audio.currentTime));
    }
  }, [audio, setCurrentTime]);

  useEffect(() => {
    if (activeTrack && audio) {
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [activeTrack, audio, handleLoadedMetadata, handleTimeUpdate]);

  return (
    <div className={styles.duration_container}>
      <p>{currentTime ? formatTime(currentTime) : '0:00'} / {duration}</p>
    </div>
  );
};
