import { DeleteContainer, ListensIcon, ModalContainer } from '@/shared'
import { FC, memo } from 'react'
import styles from './TrackItem.module.scss'
import { CoverContainer, ITrack, NameContainer, useTrackItem, useUserStore } from '@/entities';

interface TrackItemProps {
  item: ITrack;
  itemList: ITrack[]
}

export const TrackItem: FC<TrackItemProps> = memo(({ item: track, itemList: trackList }) => {

  const { clickPlay, handleDelete, isVisible, modal, hideModal} = useTrackItem(track, trackList)

  const isAdmin = useUserStore(state => state.isAdmin)

  return (
    <div className={`${styles.container} ${isVisible && styles.visible}`} onClick={clickPlay}>
      <div className={styles.main_container}>
        <CoverContainer
          handlePlay={clickPlay}
          track={track}
        />
        <NameContainer
          name={track.name}
          artist={track.artist.name}
          artistId={track.artist.id}
        />
      </div>
      <div className={styles.right_container}>
        <ListensIcon
          className={styles.listens}
          listens={track.listens}
        />
        <div>
          <div className={styles.duration_container}>
            <p>{track.duration}</p>
          </div>
        </div>
        {isAdmin && (
          <div className={styles.delete}>
            <DeleteContainer
              onClick={handleDelete}
            />
          </div>
        )}
      </div>
      {modal.isOpen && (
        <ModalContainer
          hideModal={hideModal}
          text={modal.message}
        />
      )}
    </div>
  )
})