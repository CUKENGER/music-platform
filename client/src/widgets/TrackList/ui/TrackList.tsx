import { Loader, PrivateRoutes } from "@/shared"
import { PageHeader } from "@/widgets"
import styles from './TrackList.module.scss'
import { useTrackList } from "../model/useTrackList"
import 'react-loading-skeleton/dist/skeleton.css';
import { TrackItem } from "@/entities/track/ui/TrackItem/TrackItem";

export const TrackList = () => {

  const { tracks, isLoading, error, isError, isLoader, hasMoreTracks } = useTrackList();

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <p>
      {error?.message}
    </p>
  }

  return (
    <div className={styles.TrackList}>
      <PageHeader toCreate={PrivateRoutes.CREATE_TRACK} />
      {tracks.map((track) => (
        <TrackItem
          key={track.id}
          trackList={tracks}
          track={track}
        />
      ))}
      {isLoader && (
        <p>...Loader</p>
      )}
       {!hasMoreTracks && <p>No more tracks to load.</p>}
    </div>
  )
}