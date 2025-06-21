import styles from './PlayPauseBtn.module.scss';
import pauseBtnBg from './pauseBtnBg.svg';
import playBtnBg from './playBtnBg.svg';
import { memo } from 'react';
import usePlayerStore from '../../model/PlayerStore';
import { audioManager } from '@/shared/model';

export const PlayPauseBtn = memo(() => {
  const pause = usePlayerStore((state) => state.pause);
  const setPlay = usePlayerStore((state) => state.setPlay);
  const setPause = usePlayerStore((state) => state.setPause);
  const activeTrack = usePlayerStore((state) => state.activeTrack);

  const playBtn = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const audio = audioManager.getAudio();
    if (!audio) {
      setPause();
      return;
    }

    if (!activeTrack || !audio.src) {
      setPause();
      return;
    }

    try {
      if (!pause) {
        audioManager.pause();
        setPause();
      } else {
        await audioManager.play();
        setPlay();
      }
    } catch (error) {
      console.error('PlayPauseBtn: Ошибка воспроизведения:', error);
      setPause();
    }
  };

  const btnIcon = pause ? playBtnBg : pauseBtnBg;

  return (
    <div
      className={styles.circle}
      onClick={playBtn}
    >
      <img
        src={btnIcon}
        className={styles.image}
        alt={pause ? 'Play' : 'Pause'}
      />
    </div>
  );
});

PlayPauseBtn.displayName = 'PlayPauseBtn';
