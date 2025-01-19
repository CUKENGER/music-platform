import React, { FC, useCallback } from "react";
import styles from './SwitchTrackBtns.module.scss';
import nextBtnBg from './nextBtnBg.svg';
import prevBtnBg from './prevBtnBg.svg';
import { useActiveTrackListStore, usePlayerStore, useTrackTimeStore } from "@/entities";
import { audioManager } from "@/shared";
import useAudioChunkStore from "../../model/AudioChunkStore";

interface SwitchTrackBtnsProps {
  isNextBtn: boolean;
}

export const SwitchTrackBtns: FC<SwitchTrackBtnsProps> = React.memo(({ isNextBtn }) => {
  const chunkSize = 1000000
  const {activeTrack, setPlay, setActiveTrack} = usePlayerStore()
  const {setStart, setEnd, setLoadedTime} = useAudioChunkStore()
  const setCurrentTime = useTrackTimeStore(state => state.setCurrentTime)
  const activeTrackList = useActiveTrackListStore(state => state.activeTrackList);

  const handleBtn = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (activeTrackList) {
      const currentIndex = activeTrackList.findIndex(track => track.id === activeTrack?.id);
      const nextIndex = isNextBtn 
        ? (currentIndex + 1) % activeTrackList.length 
        : (currentIndex - 1 + activeTrackList.length) % activeTrackList.length;

      const nextTrack = activeTrackList[nextIndex];
      if (nextTrack) {
        audioManager.cleanup();
        audioManager.seekTo(0);
        setCurrentTime(0)
        setStart(0);
        setEnd(chunkSize - 1);
        setLoadedTime(0);
        setActiveTrack(nextTrack);
        setPlay();
      }
    }
  }, [activeTrack, activeTrackList, isNextBtn, setActiveTrack]);

  const btnBg = isNextBtn ? nextBtnBg : prevBtnBg;
  const btnClass = isNextBtn ? styles.nextBtnIcon : styles.prevBtnIcon;

  return (
    <div className={styles.icon_container}>
      <img
        onClick={handleBtn}
        className={btnClass}
        src={btnBg}
        alt={isNextBtn ? 'nextBtnPlayer' : 'prevBtnPlayer'}
      />
    </div>
  );
});
