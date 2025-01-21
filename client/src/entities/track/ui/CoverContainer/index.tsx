import { useState } from 'react'
import styles from './CoverContainer.module.scss'
import pauseIcon from './pauseIcon.svg'
import playIcon from './playIcon.svg'
import { ITrack } from '../../types/Track';
import usePlayerStore from '../../model/PlayerStore';
import { API_URL } from '@/shared/consts';
import { MusicWaves } from '@/shared/ui';

interface CoverContainerProps {
  track: ITrack;
  handlePlay: () => void
}

export const CoverContainer = ({ track, handlePlay }: CoverContainerProps) => {

  const { pause, activeTrack } = usePlayerStore()

  const [showPlayIcon, setShowPlayIcon] = useState(false)

  return (
    <div
      className={styles.cover_container}
      onMouseEnter={() => setShowPlayIcon(true)}
      onMouseLeave={() => setShowPlayIcon(false)}
    >
      <img
        className={styles.cover}
        src={API_URL + track.picture}
        alt="cover icon"
      />

      {showPlayIcon && (
        <div className={showPlayIcon ? (!pause ? styles.pause_icon : styles.play_icon) : styles.play_icon_disabled}>
          {activeTrack?.id === track.id
            ? (
              <img
                className={styles.play}
                src={pause ? playIcon : pauseIcon}
                alt="play"
                onClick={handlePlay}
              />
            )
            : (
              <img
                className={styles.play}
                src={playIcon}
                alt="play"
                onClick={handlePlay}
              />
            )
          }

        </div>
      )}
      {activeTrack?.id == track.id && !showPlayIcon && (
        <MusicWaves />
      )
      }
    </div>
  )
}
