import { ApiUrl, Btn, LikeIcon, ListensIcon, Loader } from '@/shared'
import styles from './ArtistPage.module.scss'
import { ChildrenTrack, useGetOneArtist } from '@/entities'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'

export const ArtistPage = () => {

  const [isExpanded, setIsExpanded] = useState(false)
  const [hasGradient, setHasGradient] = useState(false);
  const { id } = useParams()
  const descriptionRef = useRef<HTMLDivElement>(null);
  
  const { data: artist, isLoading, isError, error } = useGetOneArtist(Number(id))

  useEffect(() => {
    if (descriptionRef.current) {
      const isLongDescription = descriptionRef.current.scrollHeight > 108;
      setHasGradient(isLongDescription && !isExpanded);
    }
  }, [artist?.description, isExpanded]);

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return (
      <div>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.main_container}>
        <div className={styles.cover}>
          <img src={ApiUrl + artist?.picture} />
        </div>
        <div className={styles.main_info}>
          <p className={styles.name}>{artist?.name}</p>
          <div className={classNames(
            styles.artistDescription,
            { [styles.expanded]: isExpanded },
            { [styles.hasGradient]: hasGradient }
          )}
            ref={descriptionRef}
          >
            <p>
              {artist?.description}
            </p>
          </div>
          {artist?.description && descriptionRef.current && descriptionRef.current.scrollHeight > 108 && (
            <span
              className={styles.showMoreBtn}
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              {isExpanded ? 'Показать меньше' : 'Показать еще'}
            </span>
          )}
          <div className={styles.listens_container}>
            <ListensIcon
              className={styles.listens}
              listens={artist?.listens}
            />
            <p>{artist?.genre}</p>
          </div>
          <Btn 
            small={true}
            className={styles.like_btn}
          >
            <LikeIcon
              likes={artist?.likes}
            />
          </Btn>
        </div>
      </div>
      <div className={styles.tracks}>
        <div className={styles.header}>
          <p>Популярные треки</p>
          <Link to={'popular_tracks'}>
            <Btn small={true}>
              Ещё
            </Btn>
          </Link>
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
    </div>
  )
}