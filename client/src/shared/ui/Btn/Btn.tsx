import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import styles from './Btn.module.scss'
import classNames from "classnames";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  children: string | ReactNode;
  isSubmit?: boolean;
  isLoading?: boolean;
  s?:boolean;
  className?: string;
}

export const Btn:FC<BtnProps> = ({children, isLoading=false, s, className, ...rest}) => {
  return (
    <button className={classNames(
      styles.btn,
      s && styles.small_btn,
      className
    )}
    {...rest}>
      {children}
      {isLoading && (<span className={styles.loader}></span>)}
    </button>
  );
};
