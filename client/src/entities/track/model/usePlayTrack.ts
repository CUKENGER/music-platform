import {  useCallback } from "react";
import { audioManager } from "@/shared"; // ваш AudioManager
import { ITrack, usePlayerStore } from "@/entities";

export const usePlayTrack = (track: ITrack) => {
  const { pause, activeTrack, setPlay, setPause, setActiveTrack } = usePlayerStore();

  const handlePlay = useCallback(async () => {
    if (activeTrack?.id === track.id) {
      if (pause) {
        await audioManager.audio?.play();
        setPlay();
      } else {
        audioManager.pause();
        setPause();
      }
    } else {
      setActiveTrack(track);
      setPlay();
    }
  }, [activeTrack?.id, track, pause, setPlay, setPause, setActiveTrack]);

  return {
    handlePlay,
  };
};

export default usePlayTrack
