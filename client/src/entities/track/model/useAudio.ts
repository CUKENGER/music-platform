import { useCallback, useEffect } from "react";
import { ApiUrl, audioManager } from "@/shared";
import usePlayerStore from "./PlayerStore";
import { ITrack } from "@/entities";

export const useAudio = (trackList?: ITrack[] | null) => {
  const { activeTrack, setActiveTrack, volume } = usePlayerStore();
  const audio = audioManager.audio;

  const handleNextTrack = useCallback(() => {
    if (!trackList || !activeTrack) return;

    const currentTrackIndex = trackList.findIndex(t => t.id === activeTrack.id);
    const nextTrackIndex = (currentTrackIndex + 1) % trackList.length;
    const nextTrack = trackList[nextTrackIndex];
    setActiveTrack(nextTrack);
  }, [trackList, activeTrack, setActiveTrack]);

  const setAudio = useCallback(() => {
    if (!activeTrack || !audio) return;

    const trackSrc = ApiUrl + activeTrack.audio;
    if (audio.src !== trackSrc) {
      audio.src = trackSrc;
      audio.load();

      audio.onended = handleNextTrack;
      audio.oncanplay = () => {
        audio.play().catch(error => {
          console.error('Failed to play audio:', error);
        });
      };
    }
    audio.volume = volume / 100;
  }, [activeTrack, audio, volume, handleNextTrack]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.onended = null;
        audio.oncanplay = null;
      }
    };
  }, [audio]);

  return {
    setAudio,
  };
};
