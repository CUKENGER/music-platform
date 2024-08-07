import { FC, memo, ReactNode } from "react";
import styles from './UploadBtn.module.scss'
import BtnLoader from "../BtnLoader";

interface UploadBtnProps{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (e:any)=> void
  isLoading?: boolean;
  isEmpty?: boolean;
  children?: string | ReactNode;
  className?: string
}

const UploadBtn:FC<UploadBtnProps> = ({onClick, isLoading=false, isEmpty=false, children, className}) => {
  return (
    <button 
      type="submit"
      disabled={isEmpty}
      onClick={onClick}
      className={`${styles.btn} ${className}`}
    >
      {isLoading &&(<BtnLoader/>)}
      {children 
      ? (
        children
      )
      : ( <p>Отправить</p>)
      }
    </button>
  );
};

export default memo(UploadBtn);