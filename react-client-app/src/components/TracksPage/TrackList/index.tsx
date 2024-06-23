import { memo } from "react";
import styles from './TrackList.module.scss'
import { useGetTracksQuery } from "@/api/Track/TrackService";
import TrackItem from "./TrackItem";
import TrackListLoading from "./TrackListLoading";

const TrackList = () => {

  const { data:tracks, isLoading} = useGetTracksQuery({count:50, offset:0 })

  if(isLoading) return <TrackListLoading/>

  return (
    <div className={styles.container}>
      {tracks && tracks.map((track) => (
        <TrackItem
          key={track.id}
          track={track}
          trackList={tracks}
        />
      ))}
    </div>
  );
};

export default memo(TrackList);