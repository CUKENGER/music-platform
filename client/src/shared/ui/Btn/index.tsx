import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Btn.module.scss';
import cn from 'classnames';

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isSubmit?: boolean;
  isLoading?: boolean;
  className?: string;
  size?: 's' | 'm' | 'l';
  variant?: 'filled' | 'outlined';
}

export const Btn = ({
  children,
  isLoading = false,
  className,
  size = 'm',
  variant = 'filled',
  ...rest
}: BtnProps) => {
  return (
    <button
      className={cn(
        className,
        styles.btn,
        isLoading && styles.loading,
        styles[size],
        styles[variant],
      )}
      {...rest}
    >
      {children}
      {isLoading && <span className={cn(styles.loader, styles[size])}></span>}
    </button>
  );
};
