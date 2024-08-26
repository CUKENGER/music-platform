import mixFillIcon from '../assets/mixFillIcon.svg';
import mixIcon from '../assets/mixIcon.svg'
import { mixTracks } from "@/widgets/Player/model/mixTracks";
import useActions from "@/shared/hooks/useActions";
import { ITrack } from "@/types/track";
import { memo, useState } from "react";
import styles from './MixContainer.module.scss';
import { useTypedSelector } from '@/shared/hooks/useTypedSelector';

const MixContainer = () => {
  const { activeTrackList } = useTypedSelector(state => state.activeTrackListReducer)
  const { setActiveTrackList } = useActions()

  const [prevTrackList] = useState<ITrack[] | null>(activeTrackList)
  const [isMix, setIsMix] = useState(false)

  // useEffect(() => {
  //   if (isMix && prevTrackList === null) {
  //     setPrevTrackList(activeTrackList)
  //   }
  // }, [isMix, activeTrackList, prevTrackList])

  const handleMix = () => {
    if (activeTrackList) {
      if (isMix && prevTrackList) {
        setActiveTrackList(prevTrackList);
        // setPrevTrackList(null);
      } else {
        const mixedTrackList = mixTracks(activeTrackList);
        setActiveTrackList(mixedTrackList);
      }
      setIsMix(!isMix);
    }
  };

  return (
    <div className={styles.mix_container} onClick={handleMix}>
      <img
        className={styles.mix_icon}
        src={isMix ? mixFillIcon : mixIcon}
        alt="mix"
      />
    </div>
  );
};


export default memo(MixContainer);