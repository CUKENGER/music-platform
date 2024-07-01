import useActions from "@/hooks/useActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import audioManager from "@/services/AudioManager";
import { ITrack } from "@/types/track";

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