import { FC, memo } from "react";
import styles from './DurationContainer.module.scss'

interface DurationContainerProps{
  duration: string
}

const DurationContainer:FC<DurationContainerProps> = ({duration}) => {

  return (
    <div className={styles.duration_container}>
      <p className={styles.duration}>
        {duration}
      </p>
      
    </div>
  );
};

export default memo(DurationContainer);