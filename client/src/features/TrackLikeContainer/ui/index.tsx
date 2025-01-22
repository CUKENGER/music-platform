import { useEffect, useState, useCallback } from 'react';
import styles from './TrackLikeContainer.module.scss';
import likeIcon from './assets/likeIcon.svg';
import likeFillIcon from './assets/likeFillIcon.svg';
import {
  useAddLikeTrack,
  useDeleteLikeTrack,
  useGetOneTrack,
  usePlayerStore,
} from '@/entities/track';
import { useUserStore } from '@/entities/user';

interface TrackLikeContainerProps {
  id: number;
  likes: number;
}

export const TrackLikeContainer = ({ id, likes }: TrackLikeContainerProps) => {
  const [isLike, setIsLike] = useState<boolean>(false);
  const [localLikes, setLocalLikes] = useState<number>(likes);

  const { setActiveTrack } = usePlayerStore();
  const { user } = useUserStore();

  const { mutate: deleteLike } = useDeleteLikeTrack();
  const { mutate: addLike } = useAddLikeTrack();
  const { refetch } = useGetOneTrack(id);

  useEffect(() => {
    if (user && id) {
      if (user.likedTracks) {
        setIsLike(user.likedTracks.some((track) => track.id === id));
      }
    }
  }, [user, id]);

  useEffect(() => {
    setLocalLikes(likes);
  }, [likes]);

  const handleLike = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      if (!id) return;

      if (isLike) {
        deleteLike(id, {
          onSuccess: () => {
            setIsLike(false);
            setLocalLikes((prevLikes) => prevLikes - 1);
            refetch().then(({ data: updatedTrack }) => {
              if (Array.isArray(updatedTrack)) {
                setActiveTrack(updatedTrack[0]);
              } else if (updatedTrack) {
                setActiveTrack(updatedTrack);
              }
            });
          },
          onError: (error) => {
            console.error('Error deleting like:', error);
          },
        });
      } else {
        addLike(id, {
          onSuccess: () => {
            setIsLike(true);
            setLocalLikes((prevLikes) => prevLikes + 1);
            refetch().then(({ data: updatedTrack }) => {
              if (Array.isArray(updatedTrack)) {
                setActiveTrack(updatedTrack[0]);
              } else if (updatedTrack) {
                setActiveTrack(updatedTrack);
              }
            });
          },
          onError: (error) => {
            console.error('Error adding like:', error);
          },
        });
      }
    },
    [id, isLike, deleteLike, addLike, refetch, setActiveTrack],
  );

  return (
    <div className={styles.like_container} onClick={(e) => handleLike(e)}>
      <img className={styles.like} src={isLike ? likeFillIcon : likeIcon} alt="like icon" />
      <p className={styles.like_count}>{localLikes}</p>
    </div>
  );
};
