import { FC } from "react";
import styles from './SwitchTrackBtns.module.scss'
import nextBtnBg from './nextBtnBg.svg'
import prevBtnBg from './prevBtnBg.svg'
import { useActiveTrackListStore, usePlayerStore } from "@/entities";

interface SwitchTrackBtnsProps {
  isNextBtn: boolean
}

export const SwitchTrackBtns: FC<SwitchTrackBtnsProps> = ({isNextBtn}) => {

  const {activeTrack, setActiveTrack} = usePlayerStore()
  const {activeTrackList} = useActiveTrackListStore()

  const handleBtn = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    const tracks = activeTrackList;
    if (tracks) { 
      const currentIndex = tracks.findIndex(track => track.id === activeTrack?.id);
      let nextIndex;
      if (isNextBtn) {
        nextIndex = (currentIndex + 1) % tracks.length;
      } else {
        nextIndex = (currentIndex - 1 + tracks.length) % tracks.length;
      }
      const nextTrack = tracks[nextIndex];
      if (nextTrack) {
        setActiveTrack(nextTrack);
      }
    }
  }

  return (
    <>
      {isNextBtn ? (
          <div className={styles.icon_container}>
            <img
              onClick={(e) => handleBtn(e)}
              className={styles.nextBtnIcon}
              src={nextBtnBg}
              alt='nextBtnPlayer'
            />
          </div>
        ) : (
          <div className={styles.icon_container}>
            <img
              onClick={(e) => handleBtn(e)}
              className={styles.prevBtnIcon}
              src={prevBtnBg}
              alt='prevBtnPlayer'
            />
          </div>)}
    </>

  )
};