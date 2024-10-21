import muteIcon from './muteIcon.svg'
import volumeIcon from './volumeIcon.svg'
import styles from './VolumeBar.module.scss'
import { useVolumeBar } from '../../model/useVolumeBar'

export const VolumeBar = () => {
  const {
    handleMute,
    isMute,
    volume,
    changeVolume,
    inputVolumeStyle,
    clickVolume
  } = useVolumeBar()

  return (
    <div className={styles.input_volume_container}>
      <img
        onClick={handleMute}
        className={styles.volume_icon}
        src={isMute ? muteIcon : volumeIcon}
        alt='volume Icon'
      />
      <input
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={changeVolume}
        onClick={clickVolume}
        className={styles.input_volume}
        style={inputVolumeStyle}
      />
    </div>
  )
}
