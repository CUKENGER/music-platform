import audioManager from "@/services/AudioManager";
import useActions from "@/shared/hooks/useActions";
import { useTypedSelector } from "@/shared/hooks/useTypedSelector";
import { ChangeEvent, CSSProperties, useCallback, useMemo, useState } from "react";


export const useVolumeControl = () => {
  const audio = audioManager.audio
  const [isMute, setIsMute] = useState(false);
  const [prevVolume, setPrevVolume] = useState(50);
  const volume = useTypedSelector(state => state.playerReducer.volume);
  const { setVolume } = useActions();

  const changeVolume = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (audio) {
      const newVolume = Number(e.target.value) / 100;
      audio.volume = newVolume;
      setVolume(Number(e.target.value));
      setIsMute(newVolume === 0);
    }
  }, [audio, setVolume]);

  const handleMute = useCallback(() => {
    if (audio) {
      if (!isMute) {
        setPrevVolume(volume);
        audio.volume = 0;
        setVolume(0);
      } else {
        audio.volume = prevVolume / 100;
        setVolume(prevVolume);
      }
      setIsMute(!isMute);
    }
  }, [audio, isMute, volume, prevVolume, setVolume]);

  const inputVolumeStyle = useMemo(() : CSSProperties & { '--value': string } => ({ 
    '--value': `${(volume / 100) * 100}%` 
  }),[volume]);

  return {
    changeVolume,
    handleMute,
    inputVolumeStyle,
    volume,
    isMute
  }

}