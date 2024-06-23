import { FC, memo, useState } from "react";
import styles from './TrackItemCover.module.scss'
import { apiUrl } from "@/api/apiUrl";
import playIcon from '@/assets/playImageIcon.svg'
import pauseIcon from '@/assets/pauseImageIcon.svg'
import { useTypedSelector } from "@/hooks/useTypedSelector";
import MusicWaves from "./MusicWaves";

interface TrackItemCoverProps {
  cover: string
  handlePlay: () => void
  trackId: number
}

const TrackItemCover: FC<TrackItemCoverProps> = ({ cover, handlePlay, trackId }) => {

  const { pause, activeTrack } = useTypedSelector(state => state.playerReducer)

  const [showPlayIcon, setShowPlayIcon] = useState(false)

  return (
    <div
      className={styles.cover_container}
      onMouseEnter={() => setShowPlayIcon(true)}
      onMouseLeave={() => setShowPlayIcon(false)}
    >
      <img
        className={styles.cover}
        src={apiUrl + cover}
        alt="cover icon"
      />
      
      {showPlayIcon && (
        <div className={showPlayIcon ? (!pause ? styles.pause_icon : styles.play_icon) : styles.play_icon_disabled}>
          {activeTrack?.id === trackId
          ? (
            <img
              className={styles.play}
              src={pause ? playIcon : pauseIcon}
              alt="play icon"
              onClick={handlePlay}
            />
          )
          : (
            <img
              className={styles.play}
              src={playIcon}
              alt="play icon"
              onClick={handlePlay}
          />
          )
          }
          
        </div>
      )}
      {activeTrack?.id == trackId && !showPlayIcon && (
        <MusicWaves />
      )
      }
    </div>
  );
};

export default memo(TrackItemCover);