import { DeleteContainer, ListensIcon, ModalContainer } from '@/shared';
import { ForwardedRef, forwardRef } from 'react';
import styles from './TrackItem.module.scss';
import { CoverContainer, ITrack, NameContainer, useTrackItem, useUserStore } from '@/entities';

interface TrackItemProps {
  item: ITrack;
  itemList: ITrack[];
  needDeleteIcon?: boolean;
  needClick?: boolean;
}

const TrackItemComponent = ({ item: track, itemList: trackList, needDeleteIcon=true, needClick= true }: TrackItemProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { play, handleDelete, isVisible, modal, hideModal } = useTrackItem(track, trackList);
  const isAdmin = useUserStore(state => state.isAdmin);

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
      {modal.isOpen && (
        <ModalContainer hideModal={hideModal} text={modal.message} />
      )}
    </div>
  );
};

export const TrackItem = forwardRef(TrackItemComponent);
