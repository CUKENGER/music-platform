import { memo } from "react";
import styles from './MusicWaves.module.scss'

const MusicWaves = () => {
  return (
    <div className={styles.music_play_container}>
      <div className={styles.bar}></div>
      <div className={styles.bar}></div>
      <div className={styles.bar}></div>
    </div>
  );
};

export default memo(MusicWaves);