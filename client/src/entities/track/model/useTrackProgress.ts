import { useCallback, useEffect, useMemo, useState } from 'react';
import audioManager from './AudioManager';
import usePlayerStore from './PlayerStore';
import useTrackTimeStore from './TrackTimeStore';
import { throttle } from 'lodash';

export const useTrackProgress = () => {
  const { setPlay, setPause } = usePlayerStore();
  const { setCurrentTime, currentTime } = useTrackTimeStore();
  const [x, setX] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadedTime, setLoadedTime] = useState(0);
  const [hoverTime, setHoverTime] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioManager.getAudio();
    if (!audio) return;

    const updateProgress = throttle(() => {
      const time = audioManager.getCurrentTime() || 0;
      const dur = audioManager.getDuration() || 0;
      const loaded = audioManager.getLoadedTime() || 0;

      setCurrentTime(time);
      setDuration(dur);
      setLoadedTime(loaded);
    }, 1000);

    const handleLoadedMetadata = () => {
      updateProgress();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    updateProgress();

    audioManager.setSeekCompleteCallback((playing) => {
      if (playing) {
        setPlay();
      } else {
        setPause();
      }
    });
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioManager.setSeekCompleteCallback(undefined);
      updateProgress.cancel();
    };
  }, [setPlay, setPause, setCurrentTime]);

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

  const hoverTimeStyle = useMemo(() => ({ left: `${x - 13}px` }), [x]);
  const inputDurationStyle = useMemo(
    () => ({ '--value': duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }),
    [currentTime, duration],
  );

  const updateHoverTime = (e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const offsetX = e.nativeEvent.offsetX;
    setX(offsetX);
    const maxValue = parseInt(target.max, 10);
    const value = (offsetX / target.offsetWidth) * maxValue;
    const time =
      Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + Math.floor(value % 60);
    setHoverTime(time);
  };

  const handleMouseOver = updateHoverTime;
  const handleMouseMove = updateHoverTime;

  const handleMouseLeave = useCallback(() => setHoverTime(''), []);

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
