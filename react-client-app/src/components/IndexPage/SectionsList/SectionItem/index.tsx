import { FC, memo } from "react";
import styles from './SectionItem.module.scss'

interface SectionItemProps{
  title:string
}

const SectionItem:FC<SectionItemProps> = ({title}) => {
  return (
    <div className={styles.container}>
        <div className={styles.header}>
          <p>{title}</p>
          <button>Еще</button>
        </div>
        <div className={styles.list}>
          <div className={styles.cover}></div>
          <div className={styles.cover}></div>
          <div className={styles.cover}></div>
          <div className={styles.cover}></div>
        </div>
      </div>
  );
};

export default memo(SectionItem);