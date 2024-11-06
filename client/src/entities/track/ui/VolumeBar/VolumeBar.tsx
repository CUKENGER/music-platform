import muteIcon from './muteIcon.svg';
import volumeIcon from './volumeIcon.svg';
import styles from './VolumeBar.module.scss';
import { useVolumeBar } from '../../model/useVolumeBar';

export const VolumeBar = () => {
  const {
    handleMute,
    isMute,
    volume,
    changeVolume,
  } = useVolumeBar();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  return (
    <div className={styles.input_volume_container} onClick={handleClick}>
      <img
        onClick={handleMute}
        className={styles.volume_icon}
        src={isMute ? muteIcon : volumeIcon}
        alt="Volume Icon"
      />
      <input
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={changeVolume}
        className={styles.input_volume}
        style={{ '--value': `${volume}%` } as React.CSSProperties} // Простое вычисление напрямую
      />
    </div>
  );
};
