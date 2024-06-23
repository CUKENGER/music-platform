import { FC, memo } from "react";
import styles from './MainInput.module.scss'

interface MainInputProps{
  placeholder: string
}

const MainInput:FC<MainInputProps> = ({placeholder}) => {
  return (
    <>
      <input className={styles.input} type="text" placeholder={placeholder}/> 
    </>
  );
};

export default memo(MainInput);