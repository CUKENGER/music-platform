import { useEffect, useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
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
import openPlayerBtn from './assets/openPlayerBtn.svg';
import { TrackLikeContainer } from '@/features/TrackLikeContainer';
import styles from './Player.module.scss';
import { PlayerDetailed } from '@/widgets/PlayerDetailed';

export const Player = () => {
  const playerDetailedRef = useRef<HTMLDivElement>(null);
  const [listenedTracks, setListenedTracks] = useState<Map<number, boolean>>(new Map());
  const activeTrack = usePlayerStore((state) => state.activeTrack);
  const { isOpen: isOpenPlayer, setIsOpen: setIsOpenPlayer } = useOpenPlayerStore();
  const { mutate: addListen } = useAddListenTrack();

  const handleOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOpenPlayer(!isOpenPlayer);
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (activeTrack?.id && !listenedTracks.get(activeTrack.id)) {
      timeoutId = setTimeout(() => {
        addListen(activeTrack.id);
        setListenedTracks((prev) => new Map(prev).set(activeTrack.id, true));
      }, 30000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeTrack?.id, listenedTracks, addListen]);

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };

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
      <div
        className={styles.container}
        onClick={handleOpen}
      >
        <TrackProgress />
        <div className={styles.main_container}>
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
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleOpen(e);
              }}
            >
              <img
                className={styles.openBtn}
                src={openPlayerBtn}
                alt="openPlayerBtn"
              />
            </div>
          </div>
        </div>
      </div>
      <CSSTransition
        nodeRef={playerDetailedRef}
        in={isOpenPlayer}
        timeout={300}
        classNames={{
          enter: styles['player-detailed-enter'],
          enterActive: styles['player-detailed-enter-active'],
          exit: styles['player-detailed-exit'],
          exitActive: styles['player-detailed-exit-active'],
        }}
        unmountOnExit
      >
        <PlayerDetailed ref={playerDetailedRef} />
      </CSSTransition>
    </>
  );
};
