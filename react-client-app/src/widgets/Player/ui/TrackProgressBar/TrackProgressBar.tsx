import {  memo } from "react";
import styles from './TrackProgress.module.scss';
import { useTrackProgressBar } from "../../model/useTrackProgressBar";

const TrackProgressBar = () => {
  
  const {
    hoverTime,
    handleMouseOver,
    handleMouseLeave,
    handleMouseMove, 
    duration,
    currentTime,
    changeCurrentTime,
    inputDurationStyle,
    x
  } = useTrackProgressBar()

  return (
      <div className={styles.input_duration_container}>
        {hoverTime !== '' && (
            <div className={styles.hover_time}
              style={{
                left: `${x - 13}px`,
              }}
            >
              {hoverTime}
            </div>)}

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
  );
};

export default memo(TrackProgressBar);
