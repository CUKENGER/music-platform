import { useEffect, useState } from 'react';
import { useOpenPlayerStore } from '../../model/openPlayerStore';
import {
  CurrentTimeContainer,
  MixIcon,
  PlayPauseBtn,
  SwitchTrackBtns,
  TrackProgress,
  useAddListenTrack,
  usePlayerStore,
  VolumeBar,
} from '@/entities/track';
import { API_URL } from '@/shared/consts';
import { PlayerNameContainer } from '../PlayerNameContainer';
import { Portal } from '@/shared/ui';
import { PlayerDetailed } from '@/widgets/PlayerDetailed';
import openPlayerBtn from './assets/openPlayerBtn.svg';
import { TrackLikeContainer } from '@/features/TrackLikeContainer';
import styles from './Player.module.scss';

export const Player = () => {
  const [hasListen, setHasListen] = useState(false);
  const activeTrack = usePlayerStore((state) => state.activeTrack);
  const { isOpen: isOpenPlayer, setIsOpen: setIsOpenPlayer } = useOpenPlayerStore();
  const { mutate: addListen } = useAddListenTrack();

  const handleOpen = () => {
    setIsOpenPlayer(!isOpenPlayer);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (activeTrack?.id && !hasListen) {
      timeoutId = setTimeout(() => {
        addListen(activeTrack.id);
        setHasListen(true);
      }, 30000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeTrack?.id, hasListen, addListen]);

  // Convert hex color to RGB for gradient transparency
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };

  // Установка глобальных CSS-переменных
  useEffect(() => {
    if (activeTrack?.coverColor) {
      document.documentElement.style.setProperty('--track-color', activeTrack.coverColor);
      document.documentElement.style.setProperty(
        '--track-color-rgb',
        hexToRgb(activeTrack.coverColor),
      );
    } else {
      document.documentElement.style.setProperty('--track-color', 'var(--prm)');
      document.documentElement.style.setProperty('--track-color-rgb', 'var(--prm-rgb)');
    }
  }, [activeTrack?.coverColor]);

  if (!activeTrack) return null;

  return (
    <>
      <div className={styles.container}>
        <TrackProgress />
        <div
          className={styles.main_container}
          onClick={handleOpen}
        >
          <div className={styles.main_info_container}>
            <div className={styles.cover_container}>
              <img
                src={API_URL + activeTrack?.picture}
                alt="cover"
              />
            </div>
            <div className={styles.duration}>
              <CurrentTimeContainer duration={activeTrack?.duration} />
            </div>
            <PlayerNameContainer
              name={activeTrack?.name}
              artist={activeTrack?.artist.name ?? 'Unknown artist'}
            />
            <TrackLikeContainer
              likes={activeTrack.likes}
              id={activeTrack.id}
            />
          </div>
          <div className={styles.play_btns}>
            <SwitchTrackBtns isNextBtn={false} />
            <PlayPauseBtn />
            <SwitchTrackBtns isNextBtn={true} />
          </div>
          <div className={styles.right_container}>
            <MixIcon />
            <VolumeBar />
            <div onClick={handleOpen}>
              <img
                className={styles.openBtn}
                src={openPlayerBtn}
                alt="openPlayerBtn"
              />
            </div>
          </div>
        </div>
      </div>
      {isOpenPlayer && (
        <Portal
          selector="#portal-root"
          isOpen={isOpenPlayer}
        >
          <PlayerDetailed />
        </Portal>
      )}
    </>
  );
};
