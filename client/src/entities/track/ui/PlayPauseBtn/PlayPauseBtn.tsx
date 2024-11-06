import { FC, useCallback } from "react";
import styles from './PlayPauseBtn.module.scss';
import { audioManager } from "@/shared";
import pauseBtnBg from './pauseBtnBg.svg';
import playBtnBg from './playBtnBg.svg';
import { usePlayerStore } from "@/entities";
import React from "react";

export const PlayPauseBtn: FC = React.memo(() => {
  const audio = audioManager.audio;

  const pause = usePlayerStore(state => state.pause);
  const setPlay = usePlayerStore(state => state.setPlay);
  const setPause = usePlayerStore(state => state.setPause);

  const playBtn = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (!audio) return;

    if (pause) {
      audio.play();
      setPlay();
    } else {
      audio.pause();
      setPause();
    }
  }, [audio, pause, setPlay, setPause]);

  const btnIcon = pause ? playBtnBg : pauseBtnBg;

  return (
    <div className={styles.circle} onClick={playBtn}>
      <img 
        src={btnIcon}
        className={styles.image}
        alt={pause ? "Play" : "Pause"}
      />
    </div>
  );
});
