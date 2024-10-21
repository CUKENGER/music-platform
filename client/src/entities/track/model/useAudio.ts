import { ApiUrl, audioManager } from "@/shared";
import usePlayerStore from "./PlayerStore";
import { ITrack } from "@/entities";

export const useAudio = (trackList?: ITrack[] | null) => {

  const {activeTrack, setActiveTrack, volume} = usePlayerStore()
  const audio = audioManager.audio

  const setAudio = () => {
    if (activeTrack && audio) {
      if (audio.src !== ApiUrl + activeTrack.audio) {
        audio.src = ApiUrl + activeTrack.audio;
        audio.load();
        audio.onended = () => {
          handleNextTrack();
        };
        audio.oncanplay = () => {
          audio.play().catch(error => {
            console.error('Failed to play audio:', error);
          });
        };
      }
      audio.volume = volume / 100;
    }
  }

  const handleNextTrack = () => {
    if (trackList) {
      const currentTrackIndex = trackList.findIndex(t => t.id === activeTrack?.id);
      let nextTrackIndex = currentTrackIndex + 1;
      if (nextTrackIndex >= trackList.length) {
        nextTrackIndex = 0;
      }
      const nextTrack = trackList[nextTrackIndex];
      setActiveTrack(nextTrack);
    }
  };

  return {
    setAudio
  }
};

