import { useEffect, useState, useMemo, useCallback } from "react";
import { ITrack } from "../types/Track";
import useActiveTrackListStore from "./ActiveTrackListStore";
import usePlayerStore from "./PlayerStore";
import { useDeleteTrack } from "../api/useTrackApi";
import usePlayTrack from "./usePlayTrack";
import { ApiUrl, audioManager } from "@/shared";

export const useTrackItem = (track: ITrack, trackList: ITrack[]) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const { setActiveTrackList } = useActiveTrackListStore();
  const { activeTrack } = usePlayerStore();
  const { setActiveTrack, volume} = usePlayerStore()

  const audio = audioManager.audio;
  
  const { handlePlay } = usePlayTrack(track);
  const { mutate: deleteTrack } = useDeleteTrack();

  const handleDelete = useCallback(async () => {
    try {
      await deleteTrack(track.id);
      console.log('Track deleted successfully');
    } catch (error) {
      console.error('Failed to delete track:', error);
    }
  }, [deleteTrack, track.id]);

  const handleNextTrack = useCallback(() => {
    if (trackList) {
      let nextTrackIndex = trackList.findIndex(t => t.id === activeTrack?.id) + 1;
      if (nextTrackIndex >= trackList.length) {
        nextTrackIndex = 0;
      }
      const nextTrack = trackList[nextTrackIndex];
      setActiveTrack(nextTrack);
    }
  }, [trackList, activeTrack, setActiveTrack]);

  const setAudio = useCallback(() => {
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
  }, [activeTrack, audio, volume, handleNextTrack]);

  useEffect(() => {
    if (activeTrack?.id === track.id && audio) {
      setAudio();
      audio.play().catch(error => {
        console.error('Failed to play audio:', error);
      });
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
