import { FC, memo, useCallback } from "react";
import styles from './NavNextTrackItem.module.scss'
import { ITrack } from "@/types/track";
import TrackItemCover from "@/components/TracksPage/TrackList/TrackItem/TrackItemCover";
import { apiUrl } from "@/api/apiUrl";
import usePlayer from "@/hooks/usePlayer";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import audioManager from "@/services/AudioManager";
import useActions from "@/hooks/useActions";
import NameContainer from "@/UI/NameContainer";
import DurationContainer from "@/components/Player/DurationContainer";

interface NavNextTrackItemProps {
  track: ITrack
}

const NavNextTrackItem: FC<NavNextTrackItemProps> = ({ track }) => {

  const { pause} = useTypedSelector(state => state.playerReducer)
  const { setPlay, setPause, setActiveTrack } = useActions()

  const audio = audioManager.audio

  const handlePlay = useCallback(async () => {
    await setActiveTrack(track);
    if (pause) {
      audio?.play();
      setPlay();
    } else {
      audio?.pause();
      setPause();
    }
  }, [audio, pause, setActiveTrack, setPlay, setPause, track]);

  return (
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
  );
};

export default memo(NavNextTrackItem);