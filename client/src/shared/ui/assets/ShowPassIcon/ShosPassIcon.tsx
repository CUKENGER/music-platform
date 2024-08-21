import {  FC} from "react";
import styles from './ShowPassIcon.module.scss'
import eye from './eye.svg'
import eye_off from './eye_off.svg'

interface ShowPassIconProps {
  isShow: boolean
}

export const ShowPassIcon:FC<ShowPassIconProps> = ({isShow}) => {
  return (
    <div className={styles.ShowPassIcon}>
      <img src={isShow ? eye : eye_off} alt="show password" />
    </div>
  );
};
