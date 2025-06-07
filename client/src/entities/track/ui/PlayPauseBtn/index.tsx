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
    console.log('PlayPauseBtn: Клик, pause=', pause, 'activeTrack=', activeTrack?.id);

    const audio = audioManager.getAudio();
    if (!audio) {
      console.warn('PlayPauseBtn: Аудио элемент не инициализирован');
      setPause();
      return;
    }

    if (!activeTrack || !audio.src) {
      console.warn('PlayPauseBtn: Нет активного трека или источника, src=', audio.src);
      setPause();
      return;
    }

    try {
      if (!pause) {
        audioManager.pause();
        setPause();
        console.log('PlayPauseBtn: Пауза трека:', activeTrack.id);
      } else {
        console.log('PlayPauseBtn: Попытка воспроизведения, src=', audio.src);
        await audioManager.play();
        setPlay();
        console.log('PlayPauseBtn: Воспроизведение начато:', activeTrack.id);
      }
    } catch (error) {
      console.error('PlayPauseBtn: Ошибка воспроизведения:', error);
      setPause();
    }
  };

  const btnIcon = pause ? playBtnBg : pauseBtnBg;

  console.log('PlayPauseBtn рендерится:', { pause, activeTrack });

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
