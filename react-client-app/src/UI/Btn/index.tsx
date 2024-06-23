import { FC, memo } from "react";
import styles from './Btn.module.scss'

interface BtnProps{
  onClick: () => void;
  children: string
}

const Btn:FC<BtnProps> = ({onClick, children}) => {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
};

export default memo(Btn);