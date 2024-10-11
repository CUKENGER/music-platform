import { audioManager, formatTime } from '@/shared'
import styles from './CurrentTimeContainer.module.scss'
import { FC, useEffect } from 'react'
import { usePlayerStore, useTrackTimeStore } from '@/entities'

interface CurrentTimeContainerProps{
  duration: string | undefined
}

export const CurrentTimeContainer:FC<CurrentTimeContainerProps> = ({duration}) => {

  const {currentTime, setCurrentTime, setDuration} = useTrackTimeStore()
  const {activeTrack, pause} = usePlayerStore()
  const audio = audioManager.audio

  const changeTimeTrack = async () => {
    if (activeTrack && audio && !pause) {
      audio.onloadedmetadata = async () => {
        await setDuration(Math.ceil(audio.duration));
      };
      audio.ontimeupdate = async () => {
        await setCurrentTime(Math.ceil(audio.currentTime));
      };
    }
  }

  useEffect(() => {
    changeTimeTrack()
  }, [activeTrack, audio, pause, setCurrentTime, setDuration])

  return (
    <div className={styles.duration_container}>
      <p>{currentTime ? formatTime(currentTime) : '0:00'} / {duration}</p>
    </div>
  )
}