import { audioManager } from "@/shared";
import { ChangeEvent, CSSProperties, useCallback, useMemo, useState } from "react";
import useTrackTimeStore from "./TrackTimeStore";
import usePlayerStore from "./PlayerStore";

export const useTrackProgress = () => {

  const audio = audioManager.audio;
  const [x, setX] = useState(0);
  const [hoverTime, setHoverTime] = useState('')

  const {currentTime, setCurrentTime} = useTrackTimeStore()
  const {activeTrack} = usePlayerStore()

  const convertDurationToSeconds = (duration: string): number => {
    const [minutes, seconds] = duration.split(':').map(Number);
    return (minutes * 60) + seconds;
  };

  const duration = convertDurationToSeconds(activeTrack?.duration ?? '')

  const changeCurrentTime = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (audio) {
      audio.currentTime = Number(e.target.value);
      setCurrentTime(Number(e.target.value));
    }
  }, [audio, setCurrentTime]);

  const inputDurationStyle = useMemo(() => {
    return { '--value': `${(currentTime / Number(duration)) * 100}%` } as CSSProperties;
  }, [currentTime, duration]);

  const handleMouseOver = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
      const offsetX = e.nativeEvent.offsetX;
      setX(offsetX);
      const maxValue = parseInt(target.max, 10);
      const value = (offsetX / target.offsetWidth) * maxValue;
      const time = Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + Math.floor(value % 60);
      setHoverTime(time);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setHoverTime('')
  }, [setHoverTime]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
      const offsetX = e.nativeEvent.offsetX;
      setX(offsetX);
      const maxValue = parseInt(target.max, 10);
      const value = (offsetX / target.offsetWidth) * maxValue;
      const time = Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + Math.floor(value % 60);
      setHoverTime(time);
  }, []);
  
  return {
    hoverTime,
    handleMouseLeave,
    handleMouseOver,
    handleMouseMove,
    x,
    duration,
    currentTime,
    changeCurrentTime,
    inputDurationStyle
  }
}