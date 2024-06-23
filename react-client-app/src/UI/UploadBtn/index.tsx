import { FC, memo } from "react";
import styles from './UploadBtn.module.scss'
import BtnLoader from "../BtnLoader";

interface UploadBtnProps{
  onClick?: (e:any)=> void
  isLoading?: boolean;
  isEmpty?: boolean
}

const UploadBtn:FC<UploadBtnProps> = ({onClick, isLoading=false, isEmpty=false}) => {
  return (
    <button 
      type="submit"
      disabled={isEmpty}
      onClick={onClick}
      className={styles.btn}
    >
      {isLoading &&(<BtnLoader/>)}
      Отправить
    </button>
  );
};

export default memo(UploadBtn);