import { Link, useNavigate } from 'react-router-dom'
import styles from './AlbumInfo.module.scss'
import {  useCallback, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { IAlbum } from '../../types/Album';
import { useOpenCommentsStore } from '@/entities/comment';
import { useUserStore } from '@/entities/user';
import { useAddLikeAlbum, useDeleteAlbum, useDeleteLikeAlbum, useGetOneAlbum } from '../../api/useAlbumApi';
import { API_URL, PRIVATE_ROUTES } from '@/shared/consts';
import { Btn, LikeIcon, ListensIcon, Loader, Portal } from '@/shared/ui';
import { ChildrenTrack } from '@/entities/track';
import { AlbumComments } from '../AlbumComments';

interface AlbumInfoProps {
  album: IAlbum | null | undefined
}

export const AlbumInfo = ({ album }: AlbumInfoProps) => {

  const [isLike, setIsLike] = useState(false)
  const [localLikes, setLocalLikes] = useState<number>(album?.likes ?? 0);
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasGradient, setHasGradient] = useState(false);

  const { isOpen: isCommentsOpen, setIsOpen: setIsCommentsOpen } = useOpenCommentsStore()
  const { user } = useUserStore();

  const navigate = useNavigate()

  const { mutate: addLike } = useAddLikeAlbum()
  const { mutate: deleteLike } = useDeleteLikeAlbum()
  const { refetch, isLoading, isError } = useGetOneAlbum(album?.id ?? 1)
  const { mutate: deleteAlbum } = useDeleteAlbum()
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
  }, [album]);

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

  const handleDeleteAlbum = () => {
    deleteAlbum(album?.id, {
      onSuccess: () => {
        navigate(PRIVATE_ROUTES.ALBUMS + '/' + album?.id)
      },
      onError: (error) => {
        console.error('Error deleting album:', error);
      }
    })
  }

  if (isLoading) {
    return <Loader />
  }

  if (isError || !album) {
    return (
      <div className={styles.albumNotFound}>
        <p>Альбом не найден или произошла ошибка.</p>
        <Link to={PRIVATE_ROUTES.ALBUMS}>
          <Btn small={true}>Назад к альбомам</Btn>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.albumInfo}>
      <div className={styles.header}>
        <Btn small={true} onClick={() => navigate(-1)}>
          Назад
        </Btn>
        <div className={styles.edit_btn}>
          <Btn small={true} onClick={handleDeleteAlbum}>
            Удалить
          </Btn>
          <Link to={PRIVATE_ROUTES.ALBUMS + `/${album?.id}/edit`}>
            <Btn small={true}>
              Изменить
            </Btn>
          </Link>
        </div>
      </div>
      <div className={styles.albumDetails}>
        <div className={styles.albumCover}>
          <img src={API_URL + album?.picture} alt={`${album?.name} cover`} />
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
              needStopPropagation={false}
            />
          </Btn>
        </div>
      </div>
      <div className={styles.trackList}>
        {album?.tracks.map((track, index) => (
          <ChildrenTrack
            trackList={album.tracks}
            track={track}
            trackIndex={index}
            key={track.id}
          />
        ))}
      </div>
      <Btn small={true} onClick={() => setIsCommentsOpen(!isCommentsOpen)}>
        Комментарии
        <span>({album?.comments.length})</span>
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
