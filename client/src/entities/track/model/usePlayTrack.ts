import { audioManager } from "@/shared";
import { ITrack } from "../types/Track";
import useActiveTrackListStore from "./ActiveTrackListStore";
import usePlayerStore from "./PlayerStore";
import useAudioChunkStore from "./AudioChunkStore";
import { useCallback } from "react";


export const usePlayTrack = (track: ITrack, trackList?: ITrack[]) => {
  const chunkSize = 1000000

  const setActiveTrackList = useActiveTrackListStore(state => state.setActiveTrackList)
  const {activeTrack, setPlay, setPause, pause, setActiveTrack} = usePlayerStore()
  const {setStart, setEnd, setLoadedTime} = useAudioChunkStore()

  const play = useCallback(() => {
    if(trackList) {
      setActiveTrackList(trackList);
    }
    if (!audioManager.isAudioExist()) return;
    if (activeTrack?.id === track.id) {
      if (pause) {
        audioManager.play();
        setPlay();
      } else {
        audioManager.pause();
        setPause();
      }
    } else {
      audioManager.cleanup();
      audioManager.seekTo(0);
      setStart(0);
      setEnd(chunkSize - 1);
      setLoadedTime(0);
      setActiveTrack(track);
      setPlay();
    }
  }, [setActiveTrackList, trackList, activeTrack?.id, track, pause])

  return {
    play
  }
}