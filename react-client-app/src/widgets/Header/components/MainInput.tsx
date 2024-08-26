import { FC, memo } from "react";
import styles from '../Header.module.scss'

interface MainInputProps{
  placeholder: string
}

const MainInput:FC<MainInputProps> = ({placeholder}) => {
  return (
    <>
      <input name="main_input" className={styles.input} type="text" placeholder={placeholder}/> 
    </>
  );
};

export default memo(MainInput);