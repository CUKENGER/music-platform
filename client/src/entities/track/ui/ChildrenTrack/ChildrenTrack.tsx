import { FC, useEffect, useState } from 'react';
import styles from './ChildrenTrack.module.scss'
import { audioManager, LikeIcon, ListensIcon } from '@/shared';
import playIcon from './play.svg'
import pauseIcon from './pause.svg'
import { ITrack, useActiveTrackListStore, useAudio, usePlayerStore, usePlayTrack } from '@/entities';

interface ChildrenTrackProps {
  track: ITrack;
  trackList: ITrack[]
  trackIndex: number
}

export const ChildrenTrack:FC<ChildrenTrackProps> = ({track, trackIndex, trackList}) => {

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
        <LikeIcon
          likes={track.likes}
        />
        <ListensIcon
          listens={track.listens}
        />
        <p className={styles.trackDuration}>{track.duration}</p>
      </div>
    </div>
  )
}