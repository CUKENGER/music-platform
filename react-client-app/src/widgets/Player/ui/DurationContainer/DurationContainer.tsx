import { FC, memo} from "react";
import styles from './DurationContainer.module.scss'
import { formatTime } from "@/services/formatTime";
import { useTypedSelector } from "@/shared/hooks/useTypedSelector";

interface DurationContainerProps{
  duration: string | undefined
}

const DurationContainer:FC<DurationContainerProps> = ({duration}) => {

  const currentTime = useTypedSelector(state => state.trackTimeReducer.currentTime);

  return (
    <div className={styles.duration_container}>
      <p className={styles.duration}>
        {formatTime(currentTime)} / {duration}
      </p>
      
    </div>
  );
};

export default memo(DurationContainer);