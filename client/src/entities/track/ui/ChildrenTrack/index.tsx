import { useEffect, useState } from 'react';
import styles from './ChildrenTrack.module.scss';
import playIcon from './play.svg';
import pauseIcon from './pause.svg';
import { ITrack } from '../../types/Track';
import usePlayerStore from '../../model/PlayerStore';
import { usePlayTrack } from '../../model/usePlayTrack';
import { useUserStore } from '@/entities/user';
import { useAddLikeTrack, useDeleteLikeTrack } from '../../api/useTrackApi';
import { LikeIcon, ListensIcon } from '@/shared/ui';

interface ChildrenTrackProps {
  track: ITrack;
  trackList: ITrack[];
  trackIndex: number;
}

export const ChildrenTrack = ({ track, trackIndex, trackList }: ChildrenTrackProps) => {
  const [isLike, setIsLike] = useState(false);
  const [localLikes, setLocalLikes] = useState(track.likes);
  const [isHover, setIsHover] = useState(false);
  const activeTrack = usePlayerStore((state) => state.activeTrack);
  const { play } = usePlayTrack(track, trackList);
  const { user } = useUserStore();

  const { mutate: addLikeTrack } = useAddLikeTrack();
  const { mutate: deleteLikeTrack } = useDeleteLikeTrack();

  useEffect(() => {
    if (user && track.id) {
      setIsLike(user?.likedTracks?.some((t) => t.id === track.id) || false);
    }
  }, [user, track.id]);

  const handleLike = (id: number) => {
    if (isLike) {
      deleteLikeTrack(id);
    } else {
      addLikeTrack(id);
    }
    setIsLike(!isLike);
    setLocalLikes((prev) => (isLike ? prev - 1 : prev + 1));
  };

  return (
    <div
      className={styles.track}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={play}
    >
      <div className={styles.trackMainInfo}>
        <div className={styles.trackIndexPlay}>
          {isHover ?
            <div className={styles.trackPlay}>
              <img src={playIcon} />
            </div>
          : activeTrack?.id === track.id ?
            <div className={styles.trackPlay}>
              <img src={pauseIcon} />
            </div>
          : <p>{trackIndex + 1}</p>}
        </div>
        <p className={styles.trackName}>{track.name}</p>
      </div>
      <div className={styles.trackDetails}>
        <LikeIcon isLike={isLike} likes={localLikes} onClick={() => handleLike(track.id)} />
        <ListensIcon listens={track.listens} />
        <p className={styles.trackDuration}>{track.duration}</p>
      </div>
    </div>
  );
};
