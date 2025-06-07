import styles from './PlayPauseBtn.module.scss';
import pauseBtnBg from './pauseBtnBg.svg';
import playBtnBg from './playBtnBg.svg';
import { memo } from 'react';
import usePlayerStore from '../../model/PlayerStore';

export const PlayPauseBtn = memo(() => {

  const pause = usePlayerStore((state) => state.pause);
  const setPlay = usePlayerStore((state) => state.setPlay);
  const setPause = usePlayerStore((state) => state.setPause);

  const playBtn = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (pause) {
      setPlay();
    } else {
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
