import { audioManager } from '@/shared/model';
import useActiveTrackListStore from '../../model/ActiveTrackListStore';
import useAudioChunkStore from '../../model/AudioChunkStore';
import usePlayerStore from '../../model/PlayerStore';
import useTrackTimeStore from '../../model/TrackTimeStore';
import styles from './SwitchTrackBtns.module.scss';
import nextBtnBg from './nextBtnBg.svg';
import prevBtnBg from './prevBtnBg.svg';

interface SwitchTrackBtnsProps {
  isNextBtn: boolean;
}

export const SwitchTrackBtns = ({ isNextBtn }: SwitchTrackBtnsProps) => {
  const chunkSize = 1000000
  const {activeTrack, setPlay, setActiveTrack} = usePlayerStore()
  const {setStart, setEnd, setLoadedTime} = useAudioChunkStore()
  const setCurrentTime = useTrackTimeStore(state => state.setCurrentTime)
  const activeTrackList = useActiveTrackListStore(state => state.activeTrackList);

  const handleBtn = (event: React.MouseEvent<HTMLDivElement>) => {
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
  }

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
