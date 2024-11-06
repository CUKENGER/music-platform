import { useTrackProgress } from '../../model/useTrackProgress';
import { useCallback, CSSProperties } from 'react';
import styles from './TrackProgress.module.scss';

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
  } = useTrackProgress();

  const onMouseOver = useCallback(handleMouseOver, [handleMouseOver]);
  const onMouseLeave = useCallback(handleMouseLeave, [handleMouseLeave]);
  const onMouseMove = useCallback(handleMouseMove, [handleMouseMove]);
  const onChangeTime = useCallback(changeCurrentTime, [changeCurrentTime, currentTime]);

  const hoverTimeStyle: CSSProperties = {
    left: `${x - 13}px`,
  };

  return (
    <div className={styles.input_duration_container}>
      {hoverTime && (
        <div className={styles.hover_time} style={hoverTimeStyle}>
          {hoverTime}
        </div>
      )}

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
    </div>
  );
};
