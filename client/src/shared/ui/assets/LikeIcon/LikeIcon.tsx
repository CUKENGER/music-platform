import { FC, useState } from 'react'
import styles from './LikeIcon.module.scss'
import likeIcon from './like.svg'
import likeActive from './like_active.svg'
import likeFill from './like_fill.svg'
import classNames from 'classnames'

interface LikeIconProps{
  className?: string;
  onClick?: () => void;
  isLike?: boolean;
  likes?: number;
  needStopPropagation?: boolean
}

export const LikeIcon: FC<LikeIconProps> = ({className, onClick, isLike, likes, needStopPropagation=true}) => {

  const [isHover, setIsHover] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if(needStopPropagation) {
      e.stopPropagation()
    }
    if(onClick) {
      onClick()
    }
  }

  return (
    <div 
      onClick={handleClick}
      className={classNames(
      className,
      styles.LikeIcon,
      )}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <img 
        src={isLike ? likeFill : (isHover ? likeActive : likeIcon)} 
        alt="like" 
      />
      <p>
        {likes}
      </p>
    </div>
  )
}