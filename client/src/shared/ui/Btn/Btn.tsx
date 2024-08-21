import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import styles from './Btn.module.scss'

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  children: string | ReactNode;
  isSubmit?: boolean;
  isLoading?: boolean;
  s?:boolean
}

export const Btn:FC<BtnProps> = ({children, isLoading=false, s, ...rest}) => {
  return (
    <button className={s ? styles.small_btn :styles.btn} {...rest}>
      {children}
      {isLoading && (<span className={styles.loader}></span>)}
    </button>
  );
};
