import { FC, memo } from "react";
import styles from './SwitchTrackBtns.module.scss'
import { useTypedSelector } from "@/hooks/useTypedSelector";
import useActions from "@/hooks/useActions";
import nextBtnBg from '@/assets/nextBtnBg.svg'
import prevBtnBg from '@/assets/prevBtnBg.svg'

interface SwitchTrackBtnsProps {
  isNextBtn: boolean
}

const SwitchTrackBtns: FC<SwitchTrackBtnsProps> = ({isNextBtn}) => {
  const { activeTrack } = useTypedSelector(state => state.playerReducer)
  const {activeTrackList} = useTypedSelector(state => state.activeTrackListReducer)
  const { setActiveTrack } = useActions()

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
      {isNextBtn
        ? (
          <div className={styles.icon_container}>
            <img
              onClick={(e) => handleBtn(e)}
              className={styles.nextBtnIcon}
              src={nextBtnBg}
              alt='nextBtnPlayer'
            />
          </div>
        )
        : (
          <div className={styles.icon_container}>
            <img
              onClick={(e) => handleBtn(e)}
              className={styles.prevBtnIcon}
              src={prevBtnBg}
              alt='prevBtnPlayer'
            />
          </div>
        )
      }
    </>

  )
};

export default memo(SwitchTrackBtns);