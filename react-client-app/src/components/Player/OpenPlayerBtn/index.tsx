import { FC, memo } from "react";
import openPlayerBtn from '@/assets/openPlayerBtn.svg'
import styles from './OpenPlayerBtn.module.scss'

interface OpenPlayerBtnProps{
  onClick: () => void
}

const OpenPlayerBtn:FC<OpenPlayerBtnProps> = ({onClick}) => {
  return (
    <div className={styles.openBtn_container} onClick={onClick}>
      <img
        className={styles.openBtn}
        src={openPlayerBtn}
        alt="openPlayerBtn"
      />
    </div>
  );
};

export default memo(OpenPlayerBtn);