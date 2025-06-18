import { ForwardedRef, forwardRef, useCallback } from 'react';
import styles from './TrackItem.module.scss';
import { ITrack } from '../../types/Track';
import { DeleteContainer, ModalContainer, ListensContainer } from '@/shared/ui';
import { useUserStore } from '@/entities/user';
import { CoverContainer } from '../CoverContainer';
import { NameContainer } from '../NameContainer';
import { usePlayTrack } from '../../model/usePlayTrack';
import { useModal } from '@/shared/hooks';
import { useDeleteTrack } from '../../api/useTrackApi';
import usePlayerStore from '../../model/PlayerStore';
import cn from 'classnames';

interface TrackItemProps {
  item: ITrack;
  itemList: ITrack[];
  needDeleteIcon?: boolean;
  needClick?: boolean;
}

const TrackItemComponent = (
  { item: track, itemList: trackList, needDeleteIcon = true, needClick = true }: TrackItemProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const activeTrack = usePlayerStore((state) => state.activeTrack);
  const { showModal, modal, hideModal } = useModal();

  const { mutate: deleteTrack } = useDeleteTrack();

  const { play } = usePlayTrack(track, trackList);

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
  const isAdmin = useUserStore((state) => state.isAdmin);
  const isActive = track.id === activeTrack?.id;

  return (
    <div
      ref={ref}
      className={cn(styles.container, styles.visible, isActive && styles.container_active)}
      onClick={needClick ? play : undefined}
    >
      <div className={styles.main_container}>
        <CoverContainer
          handlePlay={play}
          track={track}
        />
        <NameContainer
          name={track.name}
          artist={track.artist.name}
          artistId={track.artist.id}
        />
      </div>
      <div className={styles.right_container}>
        <div className={styles.meta_container}>
          <ListensContainer listens={track.listens} />
          <div className={styles.duration_container}>
            <p>{track.duration}</p>
          </div>
        </div>
        {isAdmin && needDeleteIcon && (
          <div className={styles.delete}>
            <DeleteContainer onClick={handleDelete} />
          </div>
        )}
      </div>
      <ModalContainer
        hideModal={hideModal}
        modal={modal}
      />
    </div>
  );
};

export const TrackItem = forwardRef(TrackItemComponent);
