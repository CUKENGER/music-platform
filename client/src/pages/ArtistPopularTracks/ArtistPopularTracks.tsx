import { useParams } from 'react-router-dom'
import styles from './ArtistPopularTracks.module.scss'
import { ChildrenTrack, useGetArtistsPopularTracks } from '@/entities'
import { Loader } from '@/shared'

export const ArtistPopularTracks = () => {

  const { id } = useParams()

  const {data: artist, isLoading, isError, error} = useGetArtistsPopularTracks(Number(id))

  if(isLoading) {
    return <Loader/>
  }

  if(isError) {
    return (
      <div>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.title_container}>
        <div className={styles.title}>
          <p>Популярные треки</p>
          <span className={styles.artist}>{artist?.name}</span>
        </div>
        <span className={styles.count}>{artist?.tracks.length}</span>
      </div>
      {artist?.tracks.map((track, index) => (
        <ChildrenTrack
          track={track}
          trackIndex={index}
          trackList={artist?.tracks}
          key={track.id}
        />
      ))}
    </div>  
  )
}