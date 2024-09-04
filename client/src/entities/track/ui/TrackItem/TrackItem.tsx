import { FC, memo } from 'react'
import styles from './TrackItem.module.scss'
import { ITrack } from '../../types/Track'
import { CoverContainer } from '../CoverContainer/CoverContainer'
import { NameContainer } from '../NameContainer/NameContainer'
import { DeleteContainer, isAdmin, playsIcon } from '@/shared'
import { useTrackItem } from '../../model/useTrackItem'

interface TrackItemProps {
  track: ITrack;
  trackList: ITrack[]
}

export const TrackItem: FC<TrackItemProps> = memo(({ track, trackList }) => {

  const { clickPlay, handleDelete, isVisible} = useTrackItem(track, trackList)

  return (
    <div className={`${styles.container} ${isVisible && styles.visible}`}>
      <div className={styles.main_container}>
        <CoverContainer
          handlePlay={clickPlay}
          track={track}
        />
        <NameContainer
          name={track.name}
          artist={track.artist.name}
        />
      </div>
      <div className={styles.right_container}>
        <div className={styles.plays_container}>
          <div className={styles.plays_container_icon}>
            <img className={styles.plays_icon} src={playsIcon} alt="count plays" />
          </div>
          <p className={styles.listens}>{track.listens}</p>
        </div>
        <div>
          <div className={styles.duration_container}>
            <p className={styles.duration}>{track.duration}</p>
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
    </div>
  )
})