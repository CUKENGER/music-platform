import { useDeleteTrackMutation } from "@/api/Track/TrackService";
import { ITrack } from "@/entities/track/model/types/track";
import audioManager from "@/services/AudioManager";
import useActions from "@/shared/hooks/useActions";
import usePlayTrack from "@/shared/hooks/usePlayTrack";
import { useTypedSelector } from "@/shared/hooks/useTypedSelector";
import { useState, useCallback, useEffect } from "react";
import usePlayer from "./usePlayer";

export const useTrackItem = (track : ITrack, trackList: ITrack[]) => {
  const [isVisible, setIsVisible] = useState(false)
  const audio = audioManager.audio
  
  const {setActiveTrackList } = useActions();
  const { activeTrack } = useTypedSelector(state => state.playerReducer)
  const {activeTrackList} = useTypedSelector(state => state.activeTrackListReducer)

  const {setAudio} = usePlayer(activeTrackList);
  const {handlePlay} = usePlayTrack(track)

  const [deleteTrack] = useDeleteTrackMutation();

  const handleDelete = useCallback(async () => {
    try {
      await deleteTrack(track.id).unwrap();
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