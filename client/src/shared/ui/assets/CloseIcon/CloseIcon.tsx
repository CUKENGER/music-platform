import { FC, useState } from 'react'
import styles from './CloseIcon.module.scss'
import classNames from 'classnames';
import closeIcon from './close_icon.svg'
import closeIconActive from './close_icon_active.svg'

interface CloseIconProps{
  onClick?: () => void;
  className?: string
}

export const CloseIcon: FC<CloseIconProps> = ({onClick, className}) => {

  const [isHover, setIsHover] = useState(false)

  return (
    <div 
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={classNames(
        className,
        styles.CloseIcon
      )}
      onClick={onClick}
    >
      <img 
        src={isHover ? closeIconActive : closeIcon} 
        alt="close" 
      />
    </div>
  )
}