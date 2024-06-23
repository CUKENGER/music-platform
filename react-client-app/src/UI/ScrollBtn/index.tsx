import { FC, memo } from "react";
import styles from './ScrollBtn.module.scss'
import arrowUp from '@/assets/scrollUp.svg'

interface ScrollBtnProps{
  onClick:() => void
}

const ScrollBtn:FC<ScrollBtnProps> = ({onClick}) => {
  return (
    <div className={styles.scrollButton} onClick={onClick}>
      <div className={styles.arrow_container}>
        <img
          className={styles.arrowUp}
          src={arrowUp}
          alt="button up icon"
        />
      </div>
    </div>
  );
};

export default memo(ScrollBtn);