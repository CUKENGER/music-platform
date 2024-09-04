import { FC } from "react";
import styles from './PlayPauseBtn.module.scss'
import { audioManager, pauseBtnBg, playBtnBg } from "@/shared";
import usePlayerStore from "../../model/PlayerStore";

export const PlayPauseBtn: FC = () => {
  const audio = audioManager.audio
  const {pause, setPlay, setPause} = usePlayerStore()

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
