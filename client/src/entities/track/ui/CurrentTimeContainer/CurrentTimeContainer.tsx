import { audioManager, formatTime } from '@/shared'
import useTrackTimeStore from '../../model/TrackTimeStore'
import styles from './CurrentTimeContainer.module.scss'
import { FC, useEffect } from 'react'
import usePlayerStore from '../../model/PlayerStore'

interface CurrentTimeContainerProps{
  duration: string | undefined
}

export const CurrentTimeContainer:FC<CurrentTimeContainerProps> = ({duration}) => {

  const {currentTime, setCurrentTime, setDuration} = useTrackTimeStore()
  const {activeTrack, pause} = usePlayerStore()
  const audio = audioManager.audio

  useEffect(() => {
    if (activeTrack && audio && !pause) {
      audio.onloadedmetadata = () => {
        setDuration(Math.ceil(audio.duration));
      };
      audio.ontimeupdate = () => {
        setCurrentTime(Math.ceil(audio.currentTime));
      };
    }
  }, [activeTrack, audio, pause, setCurrentTime, setDuration])

  return (
    <div className={styles.duration_container}>
      <p className={styles.duration}>{currentTime ? formatTime(currentTime) : '0:00'} / {duration}</p>
    </div>
  )
}