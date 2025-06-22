import { useState, useCallback, useMemo, memo } from 'react';
import styles from './MixIcon.module.scss';
import mixIcon from './assets/mixIcon.svg';
import mixFillIcon from './assets/mixFillIcon.svg';
import useActiveTrackListStore from '../../model/ActiveTrackListStore';
import { ITrack } from '../../types/Track';
import { mixTracks } from '../../model/mixTracks';
import TrackSwitchManager from '../../model/TrackSwitchManager';
import usePlayerStore from '../../model/PlayerStore';

export const MixIcon = memo(() => {
  const activeTrackList = useActiveTrackListStore((state) => state.activeTrackList);
  const setActiveTrackList = useActiveTrackListStore((state) => state.setActiveTrackList);
  const { activeTrack, setActiveTrack, setPlay } = usePlayerStore();

  const [state, setState] = useState({
    prevTrackList: null as ITrack[] | null,
    isMix: false,
  });

  const handleMix = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      if (activeTrackList) {
        setState((prevState) => {
          const { isMix, prevTrackList } = prevState;

          if (isMix && prevTrackList) {
            setTimeout(() => {
              setActiveTrackList(prevTrackList);
              TrackSwitchManager.setProps({
                activeTrack,
                activeTrackList: prevTrackList,
                setActiveTrack,
                setPlay,
              });
            }, 0);
            return { prevTrackList: null, isMix: false };
          } else {
            const mixedTrackList = !prevTrackList ? mixTracks(activeTrackList) : activeTrackList;
            setTimeout(() => {
              setActiveTrackList(mixedTrackList);
              TrackSwitchManager.setProps({
                activeTrack,
                activeTrackList: mixedTrackList,
                setActiveTrack,
                setPlay,
              });
            }, 0);

            return {
              prevTrackList: prevTrackList || activeTrackList,
              isMix: !isMix,
            };
          }
        });
      }
    },
    [activeTrack, activeTrackList, setActiveTrack, setActiveTrackList, setPlay],
  );

  const currentIcon = useMemo(() => (state.isMix ? mixFillIcon : mixIcon), [state.isMix]);

  return (
    <div
      className={styles.mix_container}
      onClick={handleMix}
    >
      <img
        className={styles.mix_icon}
        src={currentIcon}
        alt="mix"
      />
    </div>
  );
});

MixIcon.displayName = 'MixIcon';
