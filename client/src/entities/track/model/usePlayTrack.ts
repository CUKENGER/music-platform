import usePlayerStore from "@/entities/track/model/PlayerStore";
import { ITrack } from "@/entities/track/types/Track";
import { ApiUrl, audioManager } from "@/shared";

const usePlayTrack = (track: ITrack) => {

  const {pause,activeTrack, setPlay, setPause, setActiveTrack} = usePlayerStore()
  const audio = audioManager.audio;

  const handlePlay = async () => {
    if (activeTrack?.id === track.id) {
      if (pause) {
        setActiveTrack(track)
        await audio?.play();
        setPlay();
      } else {
        audio?.pause();
        setPause();
      }
    } else {
      await setActiveTrack(track);
      if(audio) {
        audio.src = ApiUrl + track.audio;
        await audio?.load();
        await audio?.play();
        setPlay();
      }
    }
  };

  return {
    handlePlay
  }
  
};

export default usePlayTrack