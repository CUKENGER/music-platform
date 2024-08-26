import { ITrack } from "@/entities/track/model/types/track";
import usePlayTrack from "@/shared/hooks/usePlayTrack";
import CoverContainer from "@/shared/ui/CoverContainer/CoverContainer";
import NameContainer from "@/shared/ui/NameContainer";
import { Reorder } from "framer-motion";
import { FC, memo } from "react";
import styles from './NavNextTrackItem.module.scss';
import DurationContainer from "@/shared/ui/DurationContainer/DurationContainer";

interface NavNextTrackItemProps {
  track: ITrack
}

const NavNextTrackItem: FC<NavNextTrackItemProps> = ({ track }) => {

  const {handlePlay} = usePlayTrack(track)

  return (
    <Reorder.Item
      value={track}
      className={styles.reorder_item}
      whileDrag={{
          border: '2px solid var(--pmr)',
          borderRadius: '10px'
      }}
    >
      <div className={styles.container}>
        <div className={styles.left_container}>
          <CoverContainer
            handlePlay={handlePlay}
            cover={track.picture}
            trackId={track.id}
          />
          <NameContainer
            artist={track.artist}
            name={track.name}
          />
        </div>
        <div className={styles.right_container}>
          <DurationContainer
            duration={track.duration}
          />
        </div>
      </div>
    </Reorder.Item>
  );
};

export default memo(NavNextTrackItem);