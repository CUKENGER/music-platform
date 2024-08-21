import { ApiUrl, audioManager } from "@/shared";
import usePlayerStore from "../model/PlayerStore";
import useTrackTimeStore from "../model/TrackTimeStore";
import { ITrack } from "../types/Track";

const usePlayer = (trackList: ITrack[] | null) => {
  const audio = audioManager.audio;

  const {activeTrack, setActiveTrack, volume} = usePlayerStore()
  const { setCurrentTime, setDuration} = useTrackTimeStore()

  const setAudio = () => {
    if (activeTrack && audio) {
      if (audio.src !== ApiUrl + activeTrack.audio) {
        audio.src = ApiUrl + activeTrack.audio;
        audio.load()
        audio.onloadedmetadata = () => {
          setDuration(Math.ceil(audio.duration));
        };
        audio.onended = () => {
          handleNextTrack();
        };
        audio.oncanplay = () => {
          audio.play().then(() => {
            // Воспроизведение началось успешно
          }).catch(error => {
            // Воспроизведение не удалось
            console.error('ee', error);
          });
        };
      }
      audio.volume = volume / 100;
      audio.ontimeupdate = () => {
        setCurrentTime(Math.ceil(audio.currentTime));
      };
    }
  };

  const handleNextTrack = () => {
    if (trackList) {
      let nextTrackIndex = trackList.findIndex(t => t.id === activeTrack?.id) + 1;
      if (nextTrackIndex >= trackList.length) {
        nextTrackIndex = 0;
      }
      const nextTrack = trackList[nextTrackIndex];
      setActiveTrack(nextTrack);
    }
  };

  return {
    setAudio,
    handleNextTrack
  }

}

export default usePlayer