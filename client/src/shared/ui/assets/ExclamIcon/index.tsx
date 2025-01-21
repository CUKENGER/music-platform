import styles from "./ExclamIcon.module.scss"
import exclamIcon from './exclamError.svg'
import exclamRed from './exclam_red.svg'
import cn from 'classnames'

interface ExclamIconProps {
  isRed?: boolean
  className?: string
}

export const ExclamIcon = ({isRed=true, className}: ExclamIconProps) => {

  const src = isRed ? exclamRed : exclamIcon

  return (
    <div className={cn(className, styles.ExclamIcon)}>
      <img src={src} alt="exclam" />
    </div>
  );
};

