import usePlayerStore from "@/entities/track/model/PlayerStore";
import { ITrack } from "@/entities/track/types/Track";
import { audioManager } from "@/shared";

const usePlayTrack = (track: ITrack) => {

  const {pause,activeTrack, setPlay, setPause, setActiveTrack} = usePlayerStore()
  const audio = audioManager.audio;

  const handlePlay = async () => {
    await setActiveTrack(track);
    if (activeTrack?.id === track.id) {
      if (pause) {
        audio?.play()
          .then(() => setPlay())
      } else {
        audio?.pause()
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