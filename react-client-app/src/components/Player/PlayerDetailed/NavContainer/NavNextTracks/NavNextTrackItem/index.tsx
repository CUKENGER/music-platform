import { FC, memo } from "react";
import styles from './NavNextTrackItem.module.scss';
import { ITrack } from "@/types/track";
import TrackItemCover from "@/components/TracksPage/TrackList/TrackItem/TrackItemCover";
import NameContainer from "@/UI/NameContainer";
import DurationContainer from "@/components/Player/DurationContainer";
import { Reorder } from "framer-motion";
import usePlayTrack from "@/hooks/usePlayTrack";

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
          <TrackItemCover
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
            isItem={true}
            duration={track.duration}
          />
        </div>
      </div>
    </Reorder.Item>
  );
};

export default memo(NavNextTrackItem);