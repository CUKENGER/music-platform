import { CoverContainer, ITrack, NameContainer, usePlayerStore, usePlayTrack } from "@/entities";
import { Reorder } from "framer-motion";
import { FC } from "react";
import styles from './NavNextTrackItem.module.scss'

interface NavNextTrackItemProps {
  track: ITrack
}

export const NavNextTrackItem: FC<NavNextTrackItemProps> = ({ track }) => {

  const activeTrack = usePlayerStore(state => state.activeTrack)

  const {play} = usePlayTrack(track)

  return (
    <Reorder.Item
      value={track}
      className={`${styles.reorder_item} ${activeTrack?.id === track.id && styles.active}`}
      whileDrag={{
          border: '2px solid var(--prm)',
          borderRadius: '10px'
      }}
    >
      <div className={styles.container}>
        <div className={styles.left_container}>
          <CoverContainer
            handlePlay={play}
            track={track}
          />
          <NameContainer
            artist={track.artist.name}
            name={track.name}
            artistId={track.artist.id}
          />
        </div>
        <div className={styles.right_container}>
          <div className={styles.duration_container}>
            <p>{track.duration}</p>
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
};
