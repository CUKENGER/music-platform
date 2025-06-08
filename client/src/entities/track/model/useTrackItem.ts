import { useCallback} from 'react';
import { ITrack } from '../types/Track';
import { useDeleteTrack } from '../api/useTrackApi';
import { useModal } from '@/shared/hooks';
import { usePlayTrack } from './usePlayTrack';

export const useTrackItem = (track: ITrack) => {

  const { showModal, modal, hideModal } = useModal();

  const { mutate: deleteTrack } = useDeleteTrack();

  const { play } = usePlayTrack(track);

  const handleDelete = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      deleteTrack(track.id, {
        onSuccess: (res) => showModal(`Трек ${res.name} успешно удален`),
        onError: (error) => showModal(`Произошла ошибка при удалении: ${error}`),
      });
    },
    [deleteTrack, showModal, track.id],
  );

  return {
    play,
    handleDelete,
    modal,
    hideModal,
  };
};
