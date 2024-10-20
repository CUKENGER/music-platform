import { useState } from "react";
import styles from './MixIcon.module.scss';
import mixIcon from './assets/mixIcon.svg';
import mixFillIcon from './assets/mixFillIcon.svg';
import { ITrack, mixTracks, useActiveTrackListStore, usePlayerStore } from "@/entities";

export const MixIcon = () => {
  const { activeTrackList, setActiveTrackList } = useActiveTrackListStore();

  const [prevTrackList, setPrevTrackList] = useState<ITrack[] | null>(null);
  const {isMix, setIsMix} = usePlayerStore()

  const handleMix = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (activeTrackList) {
      if (isMix && prevTrackList) {
        setActiveTrackList(prevTrackList);
        setPrevTrackList(null);
      } else {
        if (!prevTrackList) {
          setPrevTrackList(activeTrackList);
        }
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
