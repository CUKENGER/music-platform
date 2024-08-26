import { ButtonHTMLAttributes, FC, memo, ReactNode } from "react";
import styles from './Btn.module.scss'

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  children: string | ReactNode;
  isSubmit?: boolean;
  isLoading?: boolean
}

const Btn:FC<BtnProps> = ({children, isLoading=false, ...rest}) => {
  return (
    <button className={styles.btn} {...rest}>
      {children}
      {isLoading && (<span className={styles.loader}></span>)}
    </button>
  );
};

export default memo(Btn);