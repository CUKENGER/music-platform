import { useVolumeControl } from '../../model/useVolumeControl'
import styles from './VolumeControl.module.scss'
import volumeIcon from '../assets/volumeIcon.svg'
import muteIcon from '../assets/muteIcon.svg'

export const VolumeControl = () => {

  const {
    handleMute,
    changeVolume,
    inputVolumeStyle,
    volume,
    isMute
  } = useVolumeControl()

  return (
    <div className={styles.input_volume_container}>
      <img
        onClick={handleMute}
        className={styles.volume_icon}
        src={isMute ? muteIcon : volumeIcon}
        alt='volume'
      />
      <input
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={changeVolume}
        className={styles.input_volume}
        style={inputVolumeStyle}
      />
    </div>
  )
}