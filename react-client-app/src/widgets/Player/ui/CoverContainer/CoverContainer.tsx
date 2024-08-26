import { FC, memo } from "react";
import styles from './CoverContainer.module.scss'
import { apiUrl } from "@/shared/config/apiUrl";

interface CoverContainerProps{
  cover: string | undefined
}

const CoverContainer:FC<CoverContainerProps> = ({cover}) => {

  return (
    <div className={styles.cover_container}>
      <img
        className={styles.cover} 
        src={ apiUrl + cover}
        alt="cover" 
      />
    </div>
  );
};

export default memo(CoverContainer);