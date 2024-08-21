import { useCallback, useEffect, useState } from "react";
import usePlayer from "../hooks/usePlayer";
import { audioManager } from "@/shared";
import { ITrack } from "../types/Track";
import useActiveTrackListStore from "./ActiveTrackListStore";
import usePlayerStore from "./PlayerStore";
import usePlayTrack from "../hooks/usePlayTrack";
import { useDeleteTrack } from "../api/trackApi";

export const useTrackItem = (track : ITrack, trackList: ITrack[]) => {
  const [isVisible, setIsVisible] = useState(false)
  const audio = audioManager.audio
  
  const {setActiveTrackList, activeTrackList} = useActiveTrackListStore()
  const {activeTrack} = usePlayerStore()

  const {setAudio} = usePlayer(activeTrackList);
  const {handlePlay} = usePlayTrack(track)

  const {mutate: deleteTrack} = useDeleteTrack();

  const handleDelete = useCallback(async () => {
    try {
      await deleteTrack(track.id)
      console.log('Track deleted successfully');
    } catch (error) {
      console.error('Failed to delete track:', error);
    }
  }, [deleteTrack, track.id]);

  useEffect(() => {
    if (activeTrack?.id !== track.id) {
      if (audio && activeTrack) {
        setAudio();
      }
    }
  }, [activeTrack, audio, track.id]);

  const clickPlay = () => {
    setActiveTrackList(trackList);
    handlePlay()
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return {
    isVisible,
    clickPlay,
    handleDelete
  }
}