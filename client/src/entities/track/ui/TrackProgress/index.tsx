import { memo } from 'react';
import { useTrackProgress } from '../../model/useTrackProgress';
import styles from './TrackProgress.module.scss';
import cn from 'classnames';

export const TrackProgress = memo(() => {
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
    isSeeking,
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
        className={cn(styles.input_duration_fill, { [styles.no_transition]: isSeeking })}
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
});

TrackProgress.displayName = 'TrackProgress';
