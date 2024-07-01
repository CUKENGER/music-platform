import { memo, useEffect, useState } from "react";
import styles from './TrackList.module.scss'
import { useGetTracksQuery } from "@/api/Track/TrackService";
import TrackItem from "./TrackItem";
import TrackListLoading from "./TrackListLoading";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import TrackListError from "./TrackListError";
import { ITrack } from "@/types/track";
import { sortList } from "@/services/sortList";
import useActions from "@/hooks/useActions";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

const TrackList = () => {

  const [countTracks, setCountTracks] = useState(13)
  const [sortedTracks, setSortedTracks] = useState<ITrack[]>([])
  const { data:tracks, isLoading, refetch, error} = useGetTracksQuery({count:countTracks, offset:0 })
  
  const {setActiveTrackList} = useActions()

  useInfiniteScroll(() => {
    setCountTracks(countTracks + 10);
  });

  const selectedSort = useTypedSelector(state => state.dropdownReducer.selectedSort)

  useEffect(() => {
    if(tracks) {
      sortList(tracks, selectedSort, setSortedTracks)
      setActiveTrackList(sortedTracks)
    }
  },[selectedSort, tracks])

  if(isLoading) return <TrackListLoading/>

  return (
    <div className={styles.container}>
      {sortedTracks && sortedTracks.map((track) => (
        <TrackItem
          key={track.id}
          track={track}
          trackList={sortedTracks}
        />
      ))}
      {error && (
        <TrackListError refetch={refetch} error={error}/>
      )}
    </div>
  );
};

export default memo(TrackList);