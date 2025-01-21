import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from './Btn.module.scss'
import classNames from "classnames";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string | ReactNode;
  isSubmit?: boolean;
  isLoading?: boolean;
  small?: boolean;
  className?: string;
}

export const Btn = ({ children, isLoading = false, small, className, ...rest }: BtnProps) => {
  return (
    <button className={classNames(
      className,
      styles.btn,
      small && styles.small_btn,
    )}
      {...rest}>
      {children}
      {isLoading && (
        <span
          className={classNames(
            styles.loader,
            small && styles.small_loader
          )}
        >
        </span>
      )}
    </button>
  );
};
