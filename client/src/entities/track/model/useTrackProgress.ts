import { useCallback, useEffect, useMemo, useState } from 'react';
import audioManager from './AudioManager';

export const useTrackProgress = () => {
  const [x, setX] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadedTime, setLoadedTime] = useState(0);
  const [hoverTime, setHoverTime] = useState<string | null>(null);

  console.log('currentTime', currentTime);
  console.log('loadedTime', loadedTime);

  useEffect(() => {
    audioManager.setTimeUpdateCallback((time) => {
      setCurrentTime(time);
    });
    audioManager.setBufferUpdateCallback((time) => {
      setLoadedTime(time);
    });

    const updateDuration = () => {
      const dur = audioManager.getDuration() || 0;
      setDuration(dur);
    };

    updateDuration();
    const durationInterval = setInterval(updateDuration, 1000);

    return () => {
      clearInterval(durationInterval);
      audioManager.setTimeUpdateCallback(() => {});
      audioManager.setBufferUpdateCallback(() => {});
    };
  }, []);

  const changeCurrentTime = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    audioManager.seekTo(newValue);
  }, []);

  const hoverTimeStyle = { left: `${x - 13}px` };
  const inputDurationStyle = useMemo(
    () => ({ '--value': `${(currentTime / duration) * 100}%` }),
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
