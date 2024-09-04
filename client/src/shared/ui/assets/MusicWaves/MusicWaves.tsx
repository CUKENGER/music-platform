import styles from './MusicWaves.module.scss'

export const MusicWaves = () => {
  return (
    <div className={styles.music_play_container}>
      <div className={styles.bar}></div>
      <div className={styles.bar}></div>
      <div className={styles.bar}></div>
    </div>
  )
}