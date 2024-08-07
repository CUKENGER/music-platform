import { FC, memo, ReactNode } from "react";
// import styles from './Btn.module.scss'

interface BtnProps{
  onClick?: () => void;
  children: string | ReactNode;
  isSubmit?: boolean;
  className?: string
}

const Btn:FC<BtnProps> = ({onClick, children, isSubmit=false, className}) => {
  return (
    <button type={isSubmit ? 'submit' : 'button'} onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default memo(Btn);