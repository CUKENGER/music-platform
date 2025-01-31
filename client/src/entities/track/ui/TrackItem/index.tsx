import { ForwardedRef, forwardRef, useState } from 'react';
import styles from './TrackItem.module.scss';
import { ITrack } from '../../types/Track';
import { useTrackItem } from '../../model/useTrackItem';
import { DeleteContainer, ListensIcon, ModalContainer } from '@/shared/ui';
import { useUserStore } from '@/entities/user';
import { CoverContainer } from '../CoverContainer';
import { NameContainer } from '../NameContainer';

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
	const { play, handleDelete, isVisible, modal, hideModal } = useTrackItem(track, trackList);
  const isAdmin = useUserStore((state) => state.isAdmin);

	const {} = usePara

  return (
    <div
      ref={ref}
      className={`${styles.container} ${isVisible && styles.visible}`}
      onClick={needClick ? play : undefined}
    >
      <div className={styles.main_container}>
        <CoverContainer handlePlay={play} track={track} />
        <NameContainer name={track.name} artist={track.artist.name} artistId={track.artist.id} />
      </div>
      <div className={styles.right_container}>
        <ListensIcon className={styles.listens} listens={track.listens} />
        <div>
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
      <ModalContainer hideModal={hideModal} modal={modal} />
    </div>
  );
};

export const TrackItem = forwardRef(TrackItemComponent);
