import { useCallback, useEffect, useMemo, useState } from 'react';
import audioManager from './AudioManager';
import usePlayerStore from './PlayerStore';
import useTrackTimeStore from './TrackTimeStore';

export const useTrackProgress = () => {
  const { setPlay, setPause } = usePlayerStore();
  const { setCurrentTime, currentTime } = useTrackTimeStore();
  const [x, setX] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadedTime, setLoadedTime] = useState(0);
  const [hoverTime, setHoverTime] = useState<string | null>(null);

  useEffect(() => {
    audioManager.setSeekCompleteCallback((playing) => {
      if (playing) {
        setPlay();
      } else {
        setPause();
      }
    });

    const updateProgress = () => {
      const time = audioManager.getCurrentTime() || 0;
      const dur = audioManager.getDuration() || 0;
      const loaded = audioManager.getLoadedTime() || 0;

      setCurrentTime(time);
      setDuration(dur);
      setLoadedTime(loaded);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 1000);

    return () => {
      clearInterval(interval);
      audioManager.setSeekCompleteCallback(undefined); // Исправлено для ESLint
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPlay, setPause]);

  const changeCurrentTime = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      if (newValue >= 0 && newValue <= duration) {
        audioManager.seekTo(newValue);
        setCurrentTime(newValue);
      } else {
        console.warn(`Invalid seek value: ${newValue}, duration: ${duration}`);
      }
    },
    [duration, setCurrentTime],
  );

  const hoverTimeStyle = { left: `${x - 13}px` };
  const inputDurationStyle = useMemo(
    () => ({ '--value': duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }),
    [currentTime, duration],
  );

  const handleMouseOver = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const offsetX = e.nativeEvent.offsetX;
    setX(offsetX);
    const maxValue = parseInt(target.max, 10);
    const value = (offsetX / target.offsetWidth) * maxValue;
    const time =
      Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + Math.floor(value % 60);
    setHoverTime(time);
  }, []);

  const handleMouseLeave = useCallback(() => setHoverTime(''), []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const offsetX = e.nativeEvent.offsetX;
    setX(offsetX);
    const maxValue = parseInt(target.max, 10);
    const value = (offsetX / target.offsetWidth) * maxValue;
    const time =
      Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + Math.floor(value % 60);
    setHoverTime(time);
  }, []);

  return {
    hoverTime,
    handleMouseLeave,
    handleMouseOver,
    handleMouseMove,
    duration,
    currentTime,
    changeCurrentTime,
    inputDurationStyle,
    hoverTimeStyle,
    loadedTime,
  };
};
