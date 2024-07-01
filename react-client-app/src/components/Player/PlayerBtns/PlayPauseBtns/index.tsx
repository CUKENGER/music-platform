import { FC, memo } from "react";
import styles from './PlayPauseBtns.module.scss'
import { useTypedSelector } from "@/hooks/useTypedSelector";
import playBtnBg from '@/assets/playBtnBg.svg'
import pauseBtnBg from '@/assets/pauseBtnBg.svg'
import audioManager from "@/services/AudioManager";
import useActions from "@/hooks/useActions";

interface PlayPauseBtnsProps {
}

const PlayPauseBtns: FC<PlayPauseBtnsProps> = () => {
  const audio = audioManager.audio
  const {pause} = useTypedSelector(state => state.playerReducer)
  const {setPlay, setPause} = useActions()

  const playBtn = () => {
    if (pause) {
      audio?.play()
      setPlay();
    } else {
      audio?.pause();
      setPause();
    }
  }

  return (
    <div className={styles.circle} onClick={playBtn}>
      <img 
        src={pause ? playBtnBg : pauseBtnBg}
        className={styles.image}/>
    </div>
  );
};

export default memo(PlayPauseBtns);