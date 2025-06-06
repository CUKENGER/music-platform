import { useCallback, useEffect, useState } from 'react';
import { ITrack } from '../types/Track';
import audioManager from './AudioManager';
import usePlayerStore from './PlayerStore';

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
        setIsPlaying(false);
      } else {
        audioManager.play();
        setPlay();
        setIsPlaying(true);
      }
    } else {
      // audioManager.cleanup()
      audioManager.loadHlsSource(`http://localhost:5000/${filename}/master.m3u8`);
      setActiveTrack(track);
      try {
        audioManager.play();
        setPlay();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
        setPause();
      }
    }
  }, [filename, track, activeTrack, isPlaying, setActiveTrack, setPlay, setPause]);

  useEffect(() => {
    const audio = audioManager.getAudio();
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setPlay();
    };
    const handlePause = () => {
      setIsPlaying(false);
      setPause();
    };
    const handlePlaying = () => {
      setIsPlaying(true);
      setPlay();
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('playing', handlePlaying);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, [setPlay, setPause]);

  return { play, isPlaying };
};
