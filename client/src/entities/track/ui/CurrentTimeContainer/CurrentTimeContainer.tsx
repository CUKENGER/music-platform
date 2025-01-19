import { convertDurationToTimeString } from '@/shared';
import styles from './CurrentTimeContainer.module.scss';
import { FC } from 'react';
import { useTrackTimeStore } from '@/entities';

interface CurrentTimeContainerProps {
  duration: string | undefined;
}

export const CurrentTimeContainer: FC<CurrentTimeContainerProps> = ({ duration }) => {
  const currentTime = useTrackTimeStore(state => state.currentTime);

  return (
    <div className={styles.duration_container}>
      <p>{currentTime ? convertDurationToTimeString(currentTime) : '0:00'} / {duration}</p>
    </div>
  );
};
