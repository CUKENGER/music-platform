import nextBtnBg from '../assets/nextBtnBg.svg';
import prevBtnBg from '../assets/prevBtnBg.svg';
import useActions from "@/shared/hooks/useActions";
import { FC, memo } from "react";
import styles from './SwitchTrackBtns.module.scss';
import { useTypedSelector } from '@/shared/hooks/useTypedSelector';

interface SwitchTrackBtnsProps {
  isNextBtn: boolean
}

const SwitchTrackBtns: FC<SwitchTrackBtnsProps> = ({ isNextBtn }) => {
  const { activeTrack } = useTypedSelector(state => state.playerReducer)
  const { activeTrackList } = useTypedSelector(state => state.activeTrackListReducer)
  const { setActiveTrack } = useActions()

  const btnBg = isNextBtn ? nextBtnBg : prevBtnBg;
  const btnClass = isNextBtn ? styles.nextBtnIcon : styles.prevBtnIcon;

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
    <div className={styles.icon_container}>
      <img
        onClick={(e) => handleBtn(e)}
        className={btnClass}
        src={btnBg}
        alt='nextBtnPlayer'
      />
    </div>
  )
};

export default memo(SwitchTrackBtns);