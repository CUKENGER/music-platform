import audioManager from "@/services/AudioManager";
import useActions from "../../../shared/hooks/useActions";
import { ITrack } from "@/entities/track/model/types/track";
import { apiUrl } from "@/shared/config/apiUrl";
import { useTypedSelector } from "@/shared/hooks/useTypedSelector";

const usePlayer = (trackList: ITrack[] | null) => {
  const audio = audioManager.audio;

  const { volume, activeTrack } = useTypedSelector(state => state.playerReducer);
  const { setDuration, setCurrentTime, setActiveTrack } = useActions();

  const setAudio = () => {
    if (activeTrack && audio) {
      if (audio.src !== apiUrl + activeTrack.audio) {
        audio.src = apiUrl + activeTrack.audio;
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