import { useState } from "react";
import styles from './MixIcon.module.scss'
import mixIcon from './assets/mixIcon.svg'
import mixFillIcon from './assets/mixFillIcon.svg'
import { ITrack, mixTracks, useActiveTrackListStore } from "@/entities";

export const MixIcon = () => {
  const {activeTrackList, setActiveTrackList} = useActiveTrackListStore()

  const [prevTrackList] = useState<ITrack[] | null>(activeTrackList)
  const [isMix, setIsMix] = useState(false)

  const handleMix = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
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
