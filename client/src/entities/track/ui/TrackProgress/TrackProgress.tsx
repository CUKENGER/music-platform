import { useTrackProgress } from '../../model/useTrackProgress'
import styles from './TrackProgress.module.scss'

export const TrackProgress = () => {

  const {
    hoverTime,
    handleMouseLeave,
    handleMouseOver,
    handleMouseMove,
    x,
    duration,
    currentTime,
    changeCurrentTime,
    inputDurationStyle
  } = useTrackProgress()

  return (    
        <div className={styles.input_duration_container}>
          {hoverTime !== '' 
          ? (
            <div 
              className={styles.hover_time}   
              style={{
                left: `${x - 13}px`,
              }}
            >
              {hoverTime}
            </div>
          ) : ('')}
        
          <input
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={changeCurrentTime}
            className={styles.input_duration}
            style={inputDurationStyle}
          />
        </div>
  )
}