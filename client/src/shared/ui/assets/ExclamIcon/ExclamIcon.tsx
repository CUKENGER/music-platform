import {  FC} from "react";
import styles from "./ExclamIcon.module.scss"
import exclamIcon from './exclamError.svg'
import exclamRed from './exclam_red.svg'

interface ExclamIconProps {
  isRed?: boolean
}

export const ExclamIcon:FC<ExclamIconProps> = ({isRed=false}) => {
  return (
    <div className={styles.ExclamIcon}>
      <img src={isRed ? exclamRed : exclamIcon} alt="exclam" />
    </div>
  );
};

