import { useEffect, useCallback, useState } from "react";
import { ITrack } from "../types/Track";
import { useDeleteTrack } from "../api/useTrackApi";
import { useModal } from "@/shared/hooks";
import { usePlayTrack } from "./usePlayTrack";

export const useTrackItem = (track: ITrack, trackList: ITrack[]) => {
  const [isVisible, setIsVisible] = useState(false);

  const { showModal, modal, hideModal } = useModal();

  const { mutate: deleteTrack } = useDeleteTrack();

  const {play} = usePlayTrack(track, trackList)

  const handleDelete = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      deleteTrack(track.id, {
        onSuccess: (res) => showModal(`Трек ${res.name} успешно удален`),
        onError: (error) =>
          showModal(`Произошла ошибка при удалении: ${error}`),
      });
    },[deleteTrack, showModal, track.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isVisible) {
        setIsVisible(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isVisible]);

  return {
    play,
    isVisible,
    handleDelete,
    modal,
    hideModal,
  };
};
