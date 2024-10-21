import {  FC } from "react";
import styles from "./ClearIcon.module.scss"
import crossBg from './crossBg.svg'

interface ClearIconProps {
  handleClear:()=> void
}

export const ClearIcon: FC<ClearIconProps> = ({handleClear}) => {
  return (
    <div onClick={handleClear} className={styles.ClearIcon}>
      <img src={crossBg} alt="clear icon"/>
    </div>
  );
};
