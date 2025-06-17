import useActiveTrackListStore from '../../model/ActiveTrackListStore';
import usePlayerStore from '../../model/PlayerStore';
import TrackSwitchManager from '../../model/TrackSwitchManager';
import styles from './SwitchTrackBtns.module.scss';
import nextBtnBg from './nextBtnBg.svg';
import prevBtnBg from './prevBtnBg.svg';

interface SwitchTrackBtnsProps {
  isNextBtn: boolean;
}

export const SwitchTrackBtns = ({ isNextBtn }: SwitchTrackBtnsProps) => {
  const { activeTrack, setPlay, setActiveTrack } = usePlayerStore();
  const activeTrackList = useActiveTrackListStore((state) => state.activeTrackList);

  console.log('activeTrack', activeTrack);

  const handleBtn = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    TrackSwitchManager.switchTrack(isNextBtn, {
      activeTrack,
      activeTrackList,
      setActiveTrack,
      setPlay,
    });
  };

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
};
