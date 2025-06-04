import { useCallback, useState } from 'react';
import { ITrack } from '../types/Track';
import usePlayerStore from './PlayerStore';
import audioManager from './AudioManager';

export const usePlayTrack = (track: ITrack) => {
  const { setActiveTrack, activeTrack, setPlay, setPause } = usePlayerStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const filename = track.audio;

  const play = useCallback(async () => {
    const isSameTrack = activeTrack?.id === track.id;

    if (isSameTrack) {
      if (isPlaying) {
        audioManager.pause();
        setPause();
      } else {
        audioManager.play();
        setPlay();
      }
      setIsPlaying(!isPlaying);
    } else {
      // audioManager.cleanup(); // Очистка перед загрузкой нового трека
      audioManager.loadHlsSource(`http://localhost:5000/${filename}/playlist.m3u8`);
      setActiveTrack(track);
      setPlay();
      setIsPlaying(true);
    }
  }, [filename, track, activeTrack, isPlaying, setActiveTrack, setPlay, setPause]);

  return { play };
};
