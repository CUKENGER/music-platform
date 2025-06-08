import { useTrackProgress } from '../../model/useTrackProgress';
import styles from './TrackProgress.module.scss';

export const TrackProgress = () => {
  const {
    hoverTime,
    handleMouseLeave,
    handleMouseOver,
    handleMouseMove,
    duration,
    currentTime,
    changeCurrentTime,
    inputDurationStyle,
    hoverTimeStyle,
    loadedTime,
  } = useTrackProgress();

  return (
    <div className={styles.input_duration_container}>
      {hoverTime && (
        <div
          className={styles.hover_time}
          style={hoverTimeStyle}
        >
          {hoverTime}
        </div>
      )}
      <div
        className={styles.input_duration_fill}
        style={{ width: `${(currentTime / duration) * 100}%` }}
      ></div>
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
      <div
        className={styles.loadedTime}
        style={{ width: `${(loadedTime / duration) * 100}%` }}
      ></div>
    </div>
  );
};
