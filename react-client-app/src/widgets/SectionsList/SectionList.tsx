import { memo } from "react";
import styles from './SectionsList.module.scss'
import Btn from "@/shared/ui/Btn/Btn";

const SectionsList = () => {

  const list = [1,2,3,4,5]

  return (
    <div className={styles.container}>

      {list.map((i, index) => (
        <div className={styles.container} key={index}>
        <div className={styles.header}>
          <p>title</p>
          <Btn>Еще</Btn>
        </div>
        <div className={styles.list}>
          <div className={styles.cover}></div>
          <div className={styles.cover}></div>
          <div className={styles.cover}></div>
          <div className={styles.cover}></div>
        </div>
      </div>
      ))}
    </div>
  );
};

export default memo(SectionsList);