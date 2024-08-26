import { ITrack } from "@/entities/track/model/types/track";
import { isAdmin } from "@/services/isAdmin";
import DeleteIcon from "@/shared/ui/DeleteIcon/DeleteIcon";
import NameContainer from "@/shared/ui/NameContainer";
import { FC, memo } from "react";
import TrackListens from "../../../entities/track/ui/TrackListens/TrackListens";
import CoverContainer from "../../../shared/ui/CoverContainer/CoverContainer";
import DurationContainer from "../../../shared/ui/DurationContainer/DurationContainer";
import { useTrackItem } from "../model/useTrackItem";
import styles from './TrackItem.module.scss';

interface TrackItemProps {
  track: ITrack;
  trackList: ITrack[];
}

const TrackItem: FC<TrackItemProps> = ({ track, trackList }) => {
  
  const {
    isVisible,
    clickPlay,
    handleDelete
  } = useTrackItem(track, trackList)

  return (
    <div className={`${styles.container} ${isVisible && styles.visible}`}>
      <div className={styles.main_container}>
        <CoverContainer
          handlePlay={clickPlay}
          cover={track.picture}
          trackId={track.id}
        />
        <NameContainer
          name={track.name}
          artist={track.artist}
        />
      </div>
      <div className={styles.right_container}>
        <TrackListens
          listens={track.listens}
        />
        <div>
          <DurationContainer
            duration={track.duration}
          />
        </div>
        {isAdmin && (
          <div className={styles.delete}>
              <DeleteIcon
                onClick={handleDelete}
              />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(TrackItem);
