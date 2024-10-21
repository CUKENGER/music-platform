import { useEffect, useState, useMemo, useCallback } from "react";
import { ITrack } from "../types/Track";
import useActiveTrackListStore from "./ActiveTrackListStore";
import usePlayerStore from "./PlayerStore";
import { useDeleteTrack } from "../api/useTrackApi";
import usePlayTrack from "./usePlayTrack";
import { audioManager } from "@/shared";
import { useAudio } from "./useAudio";

export const useTrackItem = (track: ITrack, trackList: ITrack[]) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const { setActiveTrackList, activeTrackList } = useActiveTrackListStore();
  const { activeTrack } = usePlayerStore();

  const {setAudio} = useAudio(activeTrackList)

  const audio = audioManager.audio;
  
  const { handlePlay } = usePlayTrack(track);
  const { mutate: deleteTrack } = useDeleteTrack();

  const handleDelete = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    try {
      await deleteTrack(track.id);
      console.log('Track deleted successfully');
    } catch (error) {
      console.error('Failed to delete track:', error);
    }
  }, [deleteTrack, track.id]);

  useEffect(() => {
    if (activeTrack?.id === track.id && audio) {
      setAudio();
    }
  }, [activeTrack?.id, track.id, audio, setAudio]);

  const clickPlay = useCallback(async () => {
    setActiveTrackList(trackList);
    await handlePlay();
  }, [setActiveTrackList, trackList, handlePlay]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isVisible) {
        setIsVisible(true);
        console.log('isVisible', isVisible);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isVisible]);


  return useMemo(() => ({
    isVisible,
    clickPlay,
    handleDelete
  }), [isVisible, clickPlay, handleDelete]);
}
