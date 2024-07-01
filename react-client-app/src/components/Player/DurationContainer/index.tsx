import { FC, memo} from "react";
import styles from './DurationContainer.module.scss'
import { formatTime } from "@/services/formatTime";
import { useTypedSelector } from "@/hooks/useTypedSelector";

interface DurationContainerProps{
  duration: string | undefined
  isItem?:boolean
}

const DurationContainer:FC<DurationContainerProps> = ({duration, isItem=true}) => {

  const currentTime = isItem ? undefined : useTypedSelector(state => state.trackTimeReducer.currentTime);

  return (
    <div className={styles.duration_container}>
      {isItem 
      ? (<p className={styles.duration}>{duration}</p>)
      : (<p className={styles.duration}>{currentTime ? formatTime(currentTime) : '0:00'} / {duration}</p>)
      }
    </div>
  );
};

export default memo(DurationContainer);