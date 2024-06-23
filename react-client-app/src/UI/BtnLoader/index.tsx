import { memo } from "react";
import styles from './BtnLoader.module.scss'

const BtnLoader = () => {
  return (
    <span className={styles.loader}></span>
  );
};

export default memo(BtnLoader);