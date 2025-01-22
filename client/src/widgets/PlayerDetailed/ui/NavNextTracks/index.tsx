import { ITrack, useActiveTrackListStore } from '@/entities/track';
import styles from './NavNextTracks.module.scss';
import { Reorder } from 'framer-motion';
import { NavNextTrackItem } from '../NavNextTrackItem';

export const NavNextTracks = () => {
  const { activeTrackList, setActiveTrackList } = useActiveTrackListStore();

  return (
    <div className={styles.navNextTracks_container}>
      {activeTrackList && (
        <Reorder.Group
          axis="y"
          values={activeTrackList}
          onReorder={(newValues: ITrack[]) => setActiveTrackList(newValues)}
        >
          {activeTrackList.map((track) => (
            <NavNextTrackItem key={track.id} track={track} />
          ))}
        </Reorder.Group>
      )}
    </div>
  );
};
