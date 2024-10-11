import styles from './AlbumTrackItem.module.scss'
import { FC, useEffect, useState } from 'react'
import playIcon from '../assets/play.svg'
import pauseIcon from '../assets/pause.svg'
import { audioManager, ListensIcon } from '@/shared'
import { ITrack, useActiveTrackListStore, useAudio, usePlayerStore, usePlayTrack } from '@/entities'

interface AlbumTrackItemProps {
  track: ITrack;
  trackList: ITrack[]
  trackIndex: number
}

export const AlbumTrackItem: FC<AlbumTrackItemProps> = ({ track, trackIndex, trackList }) => {

  const [isHover, setIsHover] = useState(false)
  const { setActiveTrackList } = useActiveTrackListStore()
  const { activeTrack } = usePlayerStore()
  const { setAudio } = useAudio(trackList)
  const audio = audioManager.audio
  const { handlePlay } = usePlayTrack(track)

  useEffect(() => {
    if (activeTrack?.id === track.id && audio) {
      setAudio();
    }
  }, [activeTrack?.id, track.id, audio, setAudio]);

  const clickPlay = async () => {
    setActiveTrackList(trackList)
    await handlePlay()
  }

  return (
    <div
      className={styles.track}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={clickPlay}
    >
      <div className={styles.trackMainInfo}>
        <div className={styles.trackIndexPlay}>
          {isHover
            ? (
              <div className={styles.trackPlay}>
                <img src={playIcon} />
              </div>
            )
            : (
              activeTrack?.id === track.id
                ? (
                  <div className={styles.trackPlay}>
                    <img src={pauseIcon} />
                  </div>
                )
                : (<p className={styles.trackIndex}>{trackIndex + 1}</p>)
            )

          }
        </div>
        <p className={styles.trackName}>{track.name}</p>
      </div>
      <div className={styles.trackDetails}>
        <ListensIcon
          listens={track.listens}
        />
        <p className={styles.trackDuration}>{track.duration}</p>
      </div>
    </div>
  )
}