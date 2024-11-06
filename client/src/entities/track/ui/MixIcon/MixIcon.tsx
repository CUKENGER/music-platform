import { useState, useCallback, useMemo } from "react";
import styles from './MixIcon.module.scss';
import mixIcon from './assets/mixIcon.svg';
import mixFillIcon from './assets/mixFillIcon.svg';
import { ITrack, mixTracks, useActiveTrackListStore } from "@/entities";

export const MixIcon = () => {
  const { activeTrackList, setActiveTrackList } = useActiveTrackListStore();

  const [state, setState] = useState({
    prevTrackList: null as ITrack[] | null,
    isMix: false,
  });

  const handleMix = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (activeTrackList) {
      setState((prevState) => {
        const { isMix, prevTrackList } = prevState;

        if (isMix && prevTrackList) {
          setActiveTrackList(prevTrackList);
          return { prevTrackList: null, isMix: false };
        } else {
          const mixedTrackList = !prevTrackList ? mixTracks(activeTrackList) : activeTrackList;
          setActiveTrackList(mixedTrackList);

          return {
            prevTrackList: prevTrackList || activeTrackList,
            isMix: !isMix,
          };
        }
      });
    }
  }, [activeTrackList, setActiveTrackList]);

  const currentIcon = useMemo(() => (state.isMix ? mixFillIcon : mixIcon), [state.isMix]);

  return (
    <div className={styles.mix_container} onClick={handleMix}>
      <img
        className={styles.mix_icon}
        src={currentIcon}
        alt="mix"
      />
    </div>
  );
};
