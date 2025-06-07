import { useCallback, useEffect } from 'react';
import { ITrack } from '../types/Track';
import audioManager from './AudioManager';
import usePlayerStore from './PlayerStore';

export const usePlayTrack = (track: ITrack) => {
  const { setActiveTrack, activeTrack, setPlay, setPause, pause } = usePlayerStore();
  const filename = track.audio;

  const play = useCallback(async () => {
    const isSameTrack = activeTrack?.id === track.id;

    if (isSameTrack) {
      if (!pause) {
        audioManager.pause();
        setPause();
      } else {
        await audioManager.play();
        setPlay();
      }
    } else {
      audioManager.cleanup()
      audioManager.loadHlsSource(`http://localhost:5000/${filename}/master.m3u8`);
      setActiveTrack(track);
      try {
        await audioManager.play();
        setPlay();
      } catch {
        setPause();
      }
    }
  }, [filename, track, activeTrack,  setActiveTrack, setPlay, setPause, pause]);

  useEffect(() => {
    const audio = audioManager.getAudio();
    if (!audio) return;

    const handlePlay = () => setPlay();
    const handlePause = () => setPause();
    const handlePlaying = () => setPlay();

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('playing', handlePlaying);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, [setPlay, setPause]);

  return { play, pause };
};
