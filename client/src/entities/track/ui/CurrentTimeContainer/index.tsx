import useTrackTimeStore from '../../model/TrackTimeStore';
import styles from './CurrentTimeContainer.module.scss';

interface CurrentTimeContainerProps {
  duration: string | undefined;
}

export const CurrentTimeContainer = ({ duration }: CurrentTimeContainerProps) => {
  const currentTime = useTrackTimeStore(state => state.currentTime);

  return (
    <div className={styles.duration_container}>
      <p>
        {currentTime ? convertDurationToTimeString(currentTime) : '0:00'} / {duration}
      </p>
    </div>
  )
}
