import { memo } from "react";
import styles from './SectionsList.module.scss'
import SectionItem from "./SectionItem";

const SectionsList = () => {

  const list = [1,2,3,4,5]

  return (
    <div className={styles.container}>

      {list.map((i, index) => (
        <SectionItem
          key={index}
          title="Популярные треки"
        />
      ))}
    </div>
  );
};

export default memo(SectionsList);