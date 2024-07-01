import { FC, memo, useCallback, useEffect, useState } from "react";
import styles from './TrackItem.module.scss';
import { ITrack } from "@/types/track";
import TrackItemCover from "./TrackItemCover";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import usePlayer from "@/hooks/usePlayer";
import useActions from "@/hooks/useActions";
import NameContainer from "@/UI/NameContainer";
import TrackListens from "./TrackListens";
import { isAdmin } from "@/services/isAdmin";
import DeleteContainer from "@/UI/DeleteContainer";
import { useDeleteTrackMutation } from "@/api/Track/TrackService";
import DurationContainer from "@/components/Player/DurationContainer";
import audioManager from "@/services/AudioManager";
import usePlayTrack from "@/hooks/usePlayTrack";

interface TrackItemProps {
  track: ITrack;
  trackList: ITrack[];
}

const TrackItem: FC<TrackItemProps> = ({ track, trackList }) => {
  const [isVisible, setIsVisible] = useState(false)
  const audio = audioManager.audio
  
  const {setActiveTrackList } = useActions();
  const { activeTrack } = useTypedSelector(state => state.playerReducer)
  const {activeTrackList} = useTypedSelector(state => state.activeTrackListReducer)

  const {setAudio} = usePlayer(activeTrackList);
  const {handlePlay} = usePlayTrack(track)

  const [deleteTrack] = useDeleteTrackMutation();

  const handleDelete = useCallback(async () => {
    try {
      await deleteTrack(track.id).unwrap();
      console.log('Track deleted successfully');
    } catch (error) {
      console.error('Failed to delete track:', error);
    } finally {
    }
  }, [deleteTrack, track.id]);

  useEffect(() => {
    if (activeTrack?.id !== track.id) {
      if (audio && activeTrack) {
        setAudio();
      }
    }
  }, [activeTrack, audio, track.id]);

  const clickPlay = () => {
    setActiveTrackList(trackList);
    handlePlay()
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.main_container}>
        <TrackItemCover
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
          <DeleteContainer
            onClick={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default memo(TrackItem);
