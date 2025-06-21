import { useCallback, useEffect, useMemo, useState } from 'react';
import audioManager from './AudioManager';
import usePlayerStore from './PlayerStore';
import useTrackTimeStore from './TrackTimeStore';
import { throttle } from 'lodash';

export const useTrackProgress = () => {
  const setPlay = usePlayerStore((state) => state.setPlay);
  const setPause = usePlayerStore((state) => state.setPause);
  const { setCurrentTime, currentTime } = useTrackTimeStore();
  const [x, setX] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadedTime, setLoadedTime] = useState(0);
  const [hoverTime, setHoverTime] = useState<string | null>(null);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    const audio = audioManager.getAudio();
    if (!audio) {
      console.warn('useTrackProgress: Аудио не инициализировано');
      return;
    }

    const updateProgress = throttle(() => {
      const time = audioManager.getCurrentTime() || 0;
      const dur = audioManager.getDuration() || 0;
      const loaded = audioManager.getLoadedTime() || 0;

      setCurrentTime(time);
      // setDuration(dur);
      // setLoadedTime(loaded);
      if (dur !== duration) setDuration(dur);
      if (loaded !== loadedTime) setLoadedTime(loaded);
    }, 900);

    // Периодический опрос
    const interval = setInterval(() => {
      updateProgress();
    }, 500);

    const handleLoadedMetadata = () => {
      updateProgress();
      audio.dispatchEvent(new Event('timeupdate'));
    };

    const handlePlaying = () => {
      updateProgress();
      audio.dispatchEvent(new Event('timeupdate'));
    };

    const handleTimeUpdate = () => {
      updateProgress();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('progress', updateProgress);
    audio.addEventListener('playing', handlePlaying);

    updateProgress();
    audio.dispatchEvent(new Event('timeupdate'));

    audioManager.setSeekCompleteCallback((playing) => {
      setIsSeeking(false);
      if (playing) {
        setPlay();
      } else {
        setPause();
      }
    });

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('progress', updateProgress);
      audio.removeEventListener('playing', handlePlaying);
      audioManager.setSeekCompleteCallback(undefined);
      updateProgress.cancel();
      clearInterval(interval); // Очищаем интервал
    };
  }, [setPlay, setPause, setCurrentTime, duration, loadedTime]);

  const changeCurrentTime = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsSeeking(true);
      const newValue = Number(e.target.value);
      if (newValue >= 0 && newValue <= duration) {
        audioManager.seekTo(newValue).catch((err) => {
          console.error('changeCurrentTime: Seek error:', err);
          setIsSeeking(false);
        });
        setCurrentTime(newValue);
      } else {
        console.warn(`changeCurrentTime: Invalid seek value: ${newValue}, duration: ${duration}`);
        setIsSeeking(false);
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
    isSeeking,
  };
};
