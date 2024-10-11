import { FC } from "react";
import styles from './PlayPauseBtn.module.scss'
import { audioManager} from "@/shared";
import pauseBtnBg from './pauseBtnBg.svg';
import playBtnBg from './playBtnBg.svg'
import { usePlayerStore } from "@/entities";

export const PlayPauseBtn: FC = () => {
  const audio = audioManager.audio
  const {pause, setPlay, setPause} = usePlayerStore()

  const playBtn = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
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
