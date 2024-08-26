import { useGetTracksQuery } from "@/api/Track/TrackService";
import { ITrack } from "@/entities/track/model/types/track";
import { sortList } from "@/services/sortList";
import useActions from "@/shared/hooks/useActions";
import { useTypedSelector } from "@/shared/hooks/useTypedSelector";
import { memo, useEffect, useState } from "react";
import useInfiniteScroll from "../../model/useInfiniteScroll";
import TrackListError from "../TrackListError/TrackListError";
import TrackListLoading from "../TrackListLoading/TrackListLoading";
import styles from './TrackList.module.scss';
import TrackItem from "@/features/TrackItem/ui/TrackItem";

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