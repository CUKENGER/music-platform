import { ApiUrl, audioManager, convertDurationToSeconds, Portal } from '@/shared';
import { CurrentTimeContainer, MixIcon, PlayPauseBtn, SwitchTrackBtns, TrackProgress, useAddListenTrack, useGetAudioChunks, usePlayerStore, VolumeBar } from '@/entities';
import styles from './Player.module.scss';
import { useEffect, useState } from 'react';
import useAudioChunkStore from '@/entities/track/model/AudioChunkStore';
import { useOpenPlayerStore } from '../../model/openPlayerStore';
import { PlayerNameContainer } from '../PlayerNameContainer/PlayerNameContainer';
import { TrackLikeContainer } from '@/features';
import { PlayerDetailed } from '@/widgets/PlayerDetailed/ui/PlayerDetailed';
import openPlayerBtn from './assets/openPlayerBtn.svg'

export const Player = () => {
  const [localLoadedTime, setLocalLoadedTime] = useState(0)
  const [hasListen, setHasListen] = useState(false);

  const activeTrack = usePlayerStore((state) => state.activeTrack);
  const { setLoadedTime, start, end, setFileSize, setIsChunkExist, setChunkDuration } = useAudioChunkStore()
  const { isOpen: isOpenPlayer, setIsOpen: setIsOpenPlayer } = useOpenPlayerStore();

  const totalDuration = convertDurationToSeconds(activeTrack?.duration ?? '0:00')

  const filename = activeTrack?.audio.split('/').slice(1).join('') ?? '';
  const { data: audioChunks } = useGetAudioChunks(filename, start, end);
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

  useEffect(() => {
    if (activeTrack?.id) {
      setHasListen(false);
    }
  }, [activeTrack?.id]);

  useEffect(() => {
    if (activeTrack && audioChunks?.data && audioChunks?.fileSize) {
      try {
        audioManager.appendAudioChunk(audioChunks.data);
        setFileSize(audioChunks?.fileSize);
        setChunkDuration(audioChunks.chunkDuration)
        const newLoadedTime = localLoadedTime + audioChunks.chunkDuration
        setLoadedTime(newLoadedTime)
        setLocalLoadedTime(newLoadedTime)
      } catch {
        setIsChunkExist(false)
      } finally {
        setIsChunkExist(true)
      }
    }
  }, [activeTrack, audioChunks, setFileSize, setIsChunkExist, setLoadedTime, totalDuration]);

  useEffect(() => {
    if (activeTrack) {
      setLocalLoadedTime(0);
      setLoadedTime(0)
    }
  }, [activeTrack, setLoadedTime]);

  if (!activeTrack) return null;

  return (
    <>
      <div className={styles.container} >
        <TrackProgress />
        <div className={styles.main_container} onClick={handleOpen}>
          <div className={styles.main_info_container}>
            <div className={styles.cover_container}>
              <img
                src={ApiUrl + activeTrack?.picture}
                alt="cover"
              />
            </div>
            <div className={styles.duration}>
              <CurrentTimeContainer
                duration={activeTrack?.duration}
              />
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
        <Portal selector="#portal-root" isOpen={isOpenPlayer}>
          <PlayerDetailed />
        </Portal>
      )}
    </>
  );
};
