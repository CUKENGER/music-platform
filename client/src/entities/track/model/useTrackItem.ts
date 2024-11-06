import { useEffect, useCallback, useState } from "react";
import { ITrack } from "../types/Track";
import useActiveTrackListStore from "./ActiveTrackListStore";
import usePlayerStore from "./PlayerStore";
import { useDeleteTrack } from "../api/useTrackApi";
import { audioManager, useModal } from "@/shared";
import { useAudio } from "./useAudio";
import { usePlayTrack } from "./usePlayTrack";

export const useTrackItem = (track: ITrack, trackList: ITrack[]) => {
  const [isVisible, setIsVisible] = useState(false)
  const { showModal, modal, hideModal } = useModal();
  const setActiveTrackList = useActiveTrackListStore(state => state.setActiveTrackList);
  const activeTrack = usePlayerStore(state => state.activeTrack);

  const { setAudio } = useAudio(trackList);
  const { handlePlay } = usePlayTrack(track);
  const audio = audioManager.audio;

  const { mutate: deleteTrack } = useDeleteTrack();

  const handleDelete = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    await deleteTrack(track.id, {
      onSuccess: (res) => showModal(`Трек ${res.name} успешно удален`),
      onError: (error) => showModal(`Произошла ошибка при удалении: ${error}`),
    });
  }, [deleteTrack, showModal, track.id]);

  useEffect(() => {
    if (activeTrack?.id === track.id && audio) {
      setAudio();
    }
  }, [activeTrack?.id, track.id, audio]);

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

  return {
    clickPlay,
    isVisible,
    handleDelete,
    modal,
    hideModal,
  };
};
