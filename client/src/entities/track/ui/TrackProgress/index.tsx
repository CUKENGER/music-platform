import { useCallback } from 'react';
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

  const onMouseOver = handleMouseOver;
  const onMouseLeave = handleMouseLeave;
  const onMouseMove = useCallback(handleMouseMove, [handleMouseMove]);
  const onChangeTime = useCallback(changeCurrentTime, [changeCurrentTime, currentTime]);

  return (
    <div className={styles.input_duration_container}>
      {hoverTime && (
        <div className={styles.hover_time} style={hoverTimeStyle}>
          {hoverTime}
        </div>
      )}
      <div
        className={styles.input_duration_fill}
        style={{ width: `${(currentTime / duration) * 100}%` }}
      ></div>
      <input
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        onChange={onChangeTime}
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
