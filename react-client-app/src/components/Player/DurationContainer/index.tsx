import { FC, memo } from "react";
import styles from './DurationContainer.module.scss'
import { formatTime } from "@/services/formatTime";
import { useTypedSelector } from "@/hooks/useTypedSelector";

interface DurationContainerProps{
  isItem?:boolean
  duration: string | undefined
}

const DurationContainer:FC<DurationContainerProps> = ({duration, isItem}) => {
  const { currentTime } = useTypedSelector(state => state.playerReducer)

  return (
    <div className={styles.duration_container}>
      {isItem 
      ? (<p className={styles.duration}>{duration}</p>)
      : (<p className={styles.duration}>{currentTime ? formatTime(currentTime) : ''} / {duration}</p>)
      }
      
    </div>
  );
};

export default memo(DurationContainer);