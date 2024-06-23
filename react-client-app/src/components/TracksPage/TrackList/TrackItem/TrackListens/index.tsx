import { FC, memo } from "react";
import styles from './TrackListens.module.scss'
import playsIcon from '@/assets/playsIcon.svg'

interface TrackListensProps{
  listens: number
}

const TrackListens:FC<TrackListensProps> = ({listens}) => {
  return (
    <div className={styles.plays_container}>
      <div className={styles.plays_container_icon}>
        <img className={styles.plays_icon} src={playsIcon} alt=" count plays icon "/>
      </div>
      <p className={styles.listens}>{listens}</p>
    </div>
  );
};

export default memo(TrackListens);