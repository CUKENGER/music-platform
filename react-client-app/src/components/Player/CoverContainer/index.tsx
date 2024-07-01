import { FC, memo } from "react";
import styles from './CoverContainer.module.scss'
import { apiUrl } from "@/api/apiUrl";

interface CoverContainerProps{
  cover: string | undefined
}

const CoverContainer:FC<CoverContainerProps> = ({cover}) => {

  const handleClick = () => {
    
  }

  return (
    <div className={styles.cover_container}>
      <img
        className={styles.cover} 
        src={ apiUrl + cover}
        alt="cover icon" 
      />
    </div>
  );
};

export default memo(CoverContainer);