import { useState } from "react";
import styles from './MixIcon.module.scss'
import mixIcon from './assets/mixIcon.svg'
import mixFillIcon from './assets/mixFillIcon.svg'
import useActiveTrackListStore from "../../model/ActiveTrackListStore";
import { ITrack } from "../../types/Track";
import { mixTracks } from "../../model/mixTracks";

export const MixIcon = () => {
  const {activeTrackList, setActiveTrackList} = useActiveTrackListStore()

  const [prevTrackList, setPrevTrackList] = useState<ITrack[] | null>(activeTrackList)
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
