import { FC, memo } from "react";
import styles from './PlayPauseBtns.module.scss'
import { useTypedSelector } from "@/hooks/useTypedSelector";
import playBtnBg from '@/assets/playBtnBg.svg'
import pauseBtnBg from '@/assets/pauseBtnBg.svg'

interface PlayPauseBtnsProps {
  onClick: () => void;
}

const PlayPauseBtns: FC<PlayPauseBtnsProps> = ({ onClick}) => {

  const {pause} = useTypedSelector(state => state.playerReducer)

  console.log('pause', pause)

  return (
    <div className={styles.circle} onClick={onClick}>
      <img 
        src={pause ? playBtnBg : pauseBtnBg}
        className={styles.image}/>
    </div>
  );
};

export default memo(PlayPauseBtns);