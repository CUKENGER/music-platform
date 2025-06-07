// import { audioManager } from '@/shared/model';
// import useActiveTrackListStore from '../../model/ActiveTrackListStore';
// import usePlayerStore from '../../model/PlayerStore';
import styles from './SwitchTrackBtns.module.scss';
import nextBtnBg from './nextBtnBg.svg';
import prevBtnBg from './prevBtnBg.svg';

interface SwitchTrackBtnsProps {
  isNextBtn: boolean;
}

export const SwitchTrackBtns = ({ isNextBtn }: SwitchTrackBtnsProps) => {
  // const { activeTrack, setPlay, setActiveTrack } = usePlayerStore();
  // const activeTrackList = useActiveTrackListStore((state) => state.activeTrackList);

  const handleBtn = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    // if (activeTrackList) {
    //   const currentIndex = activeTrackList.findIndex((track) => track.id === activeTrack?.id);
    //   const nextIndex =
    //     isNextBtn ?
    //       (currentIndex + 1) % activeTrackList.length
    //     : (currentIndex - 1 + activeTrackList.length) % activeTrackList.length;
    //
    //   const nextTrack = activeTrackList[nextIndex];
    //   if (nextTrack) {
    //     audioManager.cleanup();
    //     setActiveTrack(nextTrack);
    //     audioManager.loadHlsSource(`http://localhost:5000/${nextTrack.audio}/master.m3u8`);
    //     await audioManager.play();
    //     setPlay();
    //   }
    // }
  };

  const btnBg = isNextBtn ? nextBtnBg : prevBtnBg;
  const btnClass = isNextBtn ? styles.nextBtnIcon : styles.prevBtnIcon;

  console.log('SwitchTrackBtns рендерится:');

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
