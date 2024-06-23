import { memo, useEffect, useState } from "react";
import styles from './MixContainer.module.scss'
import mixIcon from '@/assets/mixIcon.svg'
import mixFillIcon from '@/assets/mixFillIcon.svg'
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { ITrack } from "@/types/track";
import useActions from "@/hooks/useActions";
import { mixTracks } from "@/services/mixTracks";

const MixContainer = () => {
  const { activeTrackList } = useTypedSelector(state => state.playerReducer)
  const { setActiveTrackList } = useActions()

  const [prevTrackList, setPrevTrackList] = useState<ITrack[] | null>(activeTrackList)
  const [isMix, setIsMix] = useState(false)

  useEffect(() => {
    if (isMix && prevTrackList === null) {
      setPrevTrackList(activeTrackList)
    }
  }, [isMix, activeTrackList, prevTrackList])

  const handleMix = () => {
    if (activeTrackList) {
      if (isMix && prevTrackList) {
        setActiveTrackList(prevTrackList);
        setPrevTrackList(null);
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
        alt="mix icon"
      />
    </div>
  );
};


export default memo(MixContainer);