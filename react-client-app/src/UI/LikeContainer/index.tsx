import { FC, memo, useCallback, useEffect, useState } from "react";
import styles from './LikeContainer.module.scss'
import likeIcon from '@/assets/likeIcon.svg'
import likeFillIcon from '@/assets/likeFillIcon.svg'
import useActions from "@/hooks/useActions";
import { ITrack } from "@/types/track";

interface LikeContainerProps {
  deleteLike: (id:number) => void;
  addLike: (id: number) => void;
  track: ITrack
}

const LikeContainer: FC<LikeContainerProps> = ({deleteLike, addLike, track}) => {

  const [isLike, setIsLike] = useState(false);

  const {setActiveTrack} = useActions()

  const handleLike = async () => {
    try {
      if(track) {
        if (isLike) {
          await deleteLike(track?.id);
        } else {
          await addLike(track?.id);
        }
        setIsLike(prevIsLike => !prevIsLike);
  
        if(track) {
          // Fetch updated likes count
          const updatedTrack = track
          // Update the likes count in the state
          setActiveTrack(updatedTrack);
        }
      }
    } catch (e) {
      console.log('Error handling like:', e);
    }
  }

  return (
    <div className={styles.like_container} onClick={handleLike}>
      <img
        className={styles.like}
        src={isLike ? likeFillIcon : likeIcon}
        alt="like icon"
      />
      <p className={styles.like_count}>
        {track?.likes > 0 ? track?.likes : 0}
      </p>
    </div>
  );
};

export default memo(LikeContainer);