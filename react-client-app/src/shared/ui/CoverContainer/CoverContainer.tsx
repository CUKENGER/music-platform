// import pauseIcon from '../assets/pauseImageIcon.svg';
// import playIcon from '../assets/playImageIcon.svg';
import { apiUrl } from '@/shared/config/apiUrl';
import { useTypedSelector } from '@/shared/hooks/useTypedSelector';
import { FC, memo, useState } from "react";
import MusicWaves from "../../../entities/track/ui/MusicWaves/MusicWaves";
import styles from './CoverContainer.module.scss';

interface CoverContainerProps {
  cover: string
  handlePlay: () => void
  trackId: number
}

const CoverContainer: FC<CoverContainerProps> = ({ cover, handlePlay, trackId }) => {

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
        alt="cover"
      />
      
      {showPlayIcon && (
        <div className={showPlayIcon ? (!pause ? styles.pause_icon : styles.play_icon) : styles.play_icon_disabled}>
          {activeTrack?.id === trackId ? (
            <img
              className={styles.play}
              // src={pause ? playIcon : pauseIcon}
              alt="play"
              onClick={handlePlay}
            />) : (
            <img
              className={styles.play}
              // src={playIcon}
              alt="play"
              onClick={handlePlay}
            />)}
          
        </div>
      )}
      {activeTrack?.id == trackId && !showPlayIcon && (
        <MusicWaves />
      )
      }
    </div>
  );
};

export default memo(CoverContainer);