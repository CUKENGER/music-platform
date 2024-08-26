import audioManager from "@/services/AudioManager";
import useActions from "@/shared/hooks/useActions";
import { useTypedSelector } from "@/shared/hooks/useTypedSelector";
import { useState, useCallback, ChangeEvent, useMemo, CSSProperties } from "react";

export const useTrackProgressBar = () => {
  const audio = audioManager.audio;
  const [x, setX] = useState(0);
  const [hoverTime, setHoverTime] = useState('')

  const { currentTime, duration } = useTypedSelector(state => state.trackTimeReducer)
  const { setCurrentTime } = useActions();

  const changeCurrentTime = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (audio) {
      audio.currentTime = Number(e.target.value);
      setCurrentTime(Number(e.target.value));
    }
  }, [audio, setCurrentTime]);

  const inputDurationStyle = useMemo<CSSProperties & { '--value': string } | undefined>(() => {
      return { '--value': `${(currentTime / duration) * 100}%` };
  }, [ currentTime, duration]);

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
    handleMouseOver,
    handleMouseLeave,
    handleMouseMove, 
    duration,
    currentTime,
    changeCurrentTime,
    inputDurationStyle,
    x
  }

}