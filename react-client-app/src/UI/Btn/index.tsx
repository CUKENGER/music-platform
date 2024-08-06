import { FC, memo, ReactNode } from "react";
// import styles from './Btn.module.scss'

interface BtnProps{
  onClick?: () => void;
  children: string | ReactNode;
  isSubmit?: boolean
}

const Btn:FC<BtnProps> = ({onClick, children, isSubmit=false}) => {
  return (
    <button type={isSubmit ? 'submit' : 'button'} onClick={onClick}>
      {children}
    </button>
  );
};

export default memo(Btn);