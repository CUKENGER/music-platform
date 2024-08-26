import { ITrack } from "@/entities/track/model/types/track";
import audioManager from "@/services/AudioManager";
import useActions from "./useActions";
import { useTypedSelector } from "./useTypedSelector";

const usePlayTrack = (track: ITrack) => {
  const { pause, activeTrack } = useTypedSelector(state => state.playerReducer);
  const { setPlay, setPause, setActiveTrack } = useActions();
  const audio = audioManager.audio;

  const handlePlay = async () => {
    await setActiveTrack(track);
    if (activeTrack?.id === track.id) {
      if (pause) {
        audio?.play();
        setPlay();
      } else {
        audio?.pause();
        setPause();
      }
    } else {
      await setActiveTrack(track);
      audio?.play();
      setPlay();
    }
  }
  return {
    handlePlay
  }
  
};

export default usePlayTrack