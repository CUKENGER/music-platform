import { PrivateRoutes, Btn, ApiUrl, Portal, ListensIcon, LikeIcon, Loader } from '@/shared'
import { Link } from 'react-router-dom'
import styles from './AlbumInfo.module.scss'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { IAlbum, useAddLikeAlbum, useDeleteLikeAlbum, useGetOneAlbum, useOpenCommentsStore, useUserStore } from '@/entities'
import classNames from 'classnames'
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { AlbumTrackItem } from '../AlbumTrackItem/AlbumTrackItem'
import { AlbumComments } from '../AlbumComments/AlbumComments'

interface AlbumInfoProps {
  album: IAlbum | null | undefined
}

export const AlbumInfo: FC<AlbumInfoProps> = ({ album }) => {

  const [isLike, setIsLike] = useState(false)
  const [localLikes, setLocalLikes] = useState<number>(album?.likes ?? 0);
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasGradient, setHasGradient] = useState(false);
  
  const { isOpen: isCommentsOpen, setIsOpen: setIsCommentsOpen } = useOpenCommentsStore()
  const { user } = useUserStore();

  const { mutate: addLike } = useAddLikeAlbum()
  const { mutate: deleteLike } = useDeleteLikeAlbum()
  const { refetch, isLoading, isError } = useGetOneAlbum(album?.id)
  const descriptionRef = useRef<HTMLDivElement>(null);

  const formattedDate = album && format(new Date(album?.releaseDate), 'd MMMM yyyy', { locale: ru });

  useEffect(() => {
    if (descriptionRef.current) {
      const isLongDescription = descriptionRef.current.scrollHeight > 108;
      setHasGradient(isLongDescription && !isExpanded);
    }
  }, [album?.description, isExpanded]);

  useEffect(() => {
    if (user && album?.id) {
      const albumId = album?.id
      if (user.likedAlbums) {
        setIsLike(user.likedAlbums.some((album: IAlbum) => album?.id === albumId));
      }
    }
  }, [user, album?.id]);

  useEffect(() => {
    if (album) {
      setLocalLikes(album?.likes);
    }
  }, [album?.likes]);

  const handleLike = useCallback(() => {
    if (!album?.id) return;

    if (isLike) {
      deleteLike(album?.id, {
        onSuccess: () => {
          setIsLike(false);
          setLocalLikes(prevLikes => prevLikes - 1);
          refetch();
        },
        onError: (error) => {
          console.error('Error removing like:', error);
        }
      });
    } else {
      addLike(album?.id, {
        onSuccess: () => {
          setIsLike(true);
          setLocalLikes(prevLikes => prevLikes + 1);
          refetch()
        },
        onError: (error) => {
          console.error('Error adding like:', error);
        }
      });
    }
  }, [album?.id, isLike, deleteLike, addLike, refetch]);

  if(isLoading) {
    return <Loader/>
  }

  if (isError || !album) {
    return (
      <div className={styles.albumNotFound}>
        <p>Альбом не найден или произошла ошибка.</p>
        <Link to={PrivateRoutes.ALBUMS}>
          <Btn small={true}>Назад к альбомам</Btn>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.albumInfo}>
      <div className={styles.header}>
        <Link to={PrivateRoutes.ALBUMS}>
          <Btn small={true}>Назад</Btn>
        </Link>
        <Btn small={true}>
          Изменить
        </Btn>
      </div>
      <div className={styles.albumDetails}>
        <div className={styles.albumCover}>
          <img src={ApiUrl + album?.picture} alt={`${album?.name} cover`} />
        </div>
        <div className={styles.albumMainInfo}>
          <p className={styles.albumTitle}>{album?.name}</p>
          <p className={styles.albumArtist}>{album?.artist.name}</p>
          <div className={classNames(
            styles.albumDescription,
            { [styles.expanded]: isExpanded },
            { [styles.hasGradient]: hasGradient }
            )}
            ref={descriptionRef}
          >
            <p>
              {album?.description}
            </p>
          </div>
          {album?.description && descriptionRef.current && descriptionRef.current.scrollHeight > 108 && (
            <span
              className={styles.showMoreBtn}
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              {isExpanded ? 'Показать меньше' : 'Показать еще'}
            </span>
          )}
          <p className={styles.albumGenre}>{album?.genre}</p>
          <div className={styles.listensContainer}>
            <ListensIcon
              className={styles.albumListens}
              listens={album?.listens}
            />
          </div>
          <div className={styles.albumMeta}>
            <p>{album?.duration}</p>
            <p>{formattedDate}</p>
          </div>
          <Btn
            className={styles.albumLikes}
            small={true}
            onClick={handleLike}
          >
            <LikeIcon
              isLike={isLike}
              likes={localLikes}
            />
          </Btn>
        </div>
      </div>
      <div className={styles.trackList}>
        {album?.tracks.map((track, index) => (
          <AlbumTrackItem
            trackList={album.tracks}
            track={track}
            trackIndex={index}
            key={track.id}
          />
        ))}
      </div>
      <Btn small={true} onClick={() => setIsCommentsOpen(!isCommentsOpen)}>
        Комментарии
      </Btn>
      {
        isCommentsOpen && (
          <Portal selector="#portal-root" isOpen={isCommentsOpen}>
            <AlbumComments
              albumId={album?.id}
            />
          </Portal>
        )
      }
    </div >
  )
}