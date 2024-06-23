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

interface TrackItemProps {
  track: ITrack;
  trackList: ITrack[];
}

const TrackItem: FC<TrackItemProps> = ({ track, trackList }) => { 
  const { setActiveTrack, setPlay, setPause, setActiveTrackList } = useActions();
  const {activeTrackList, activeTrack, pause } = useTypedSelector(state => state.playerReducer)

  const {setAudio } = usePlayer(activeTrackList);

  const audio = audioManager.audio

  const [deleteTrack] = useDeleteTrackMutation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteTrack(track.id).unwrap();
      console.log('Track deleted successfully');
    } catch (error) {
      console.error('Failed to delete track:', error);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTrack, track.id]);

  useEffect(() => {
    if (activeTrack?.id !== track.id) {
      if (audio && activeTrack) {
        setAudio();
      }
    }
  }, [activeTrack, audio, track.id]);

  const handlePlay = () => {
    setActiveTrack(track);
    setActiveTrackList(trackList);

    if (pause) {
      audio?.play();
      setPlay();
    } else {
      audio?.pause();
      setPause();
    }
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
          handlePlay={handlePlay}
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
            isItem={true}
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
