import { audioManager } from "@/shared";
import { useState, useCallback, ChangeEvent } from "react";
import usePlayerStore from "./PlayerStore";

export const useVolumeBar = () => {
  const audio = audioManager.audio;
  const [isMute, setIsMute] = useState(false);
  const [prevVolume, setPrevVolume] = useState(50);

  const volume = usePlayerStore(state => state.volume);
  const setVolume = usePlayerStore(state => state.setVolume);

  const changeVolume = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (audio) {
      const newVolume = Number(e.target.value) / 100;
      audio.volume = newVolume;
      setVolume(Number(e.target.value));
      setIsMute(newVolume === 0);
    }
  }, [audio, setVolume]);

  const handleMute = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
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

  return {
    handleMute,
    isMute,
    volume,
    changeVolume,
  };
};
