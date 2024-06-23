import { FC, memo, useEffect, useState } from "react";
import styles from './LikeContainer.module.scss'
import likeIcon from '@/assets/likeIcon.svg'
import likeFillIcon from '@/assets/likeFillIcon.svg'

interface LikeContainerProps {
  deleteLike: (id:number) => void;
  addLike: (id: number) => void;
  likes: number | undefined
  id:number
}

const LikeContainer: FC<LikeContainerProps> = ({deleteLike, addLike, likes, id}) => {

  const [isLike, setIsLike] = useState(false);
  const [localLikes, setLocalLikes] = useState(0);

  const handleLike = async () => {
    try {
      if (isLike) {
        await deleteLike(id);
        setLocalLikes(prevLikes => prevLikes - 1);
      } else {
        await addLike(id);
        setLocalLikes(prevLikes => prevLikes + 1);
      }
      setIsLike(prevIsLike => !prevIsLike);
    } catch (e) {
      console.log('Error handling like:', e);
    }
  };

  useEffect(() => {
    if (likes) {
      setLocalLikes(likes)
    }
  }, [likes])

  return (
    <div className={styles.like_container} onClick={handleLike}>
      <img
        className={styles.like}
        src={isLike ? likeFillIcon : likeIcon}
        alt="like icon"
      />
      <p className={styles.like_count}>
        {localLikes}
      </p>
    </div>
  );
};

export default memo(LikeContainer);