import { FC } from 'react';
import styles from './SectionArrow.module.scss'
import arrowIcon from './arrow.svg'
import grayArrowIcon from './grayArrow.svg'

interface SectionArrowProps {
  left?:boolean;
  onClick: () => void;
  isDisabled?: boolean
}

export const SectionArrow:FC<SectionArrowProps> = ({onClick, left=false, isDisabled=false}) => {
  return (
    <div className={styles.container}>
      <img 
        onClick={onClick}
        className={left ? styles.left : styles.right}
        src={isDisabled ? grayArrowIcon : arrowIcon} 
        alt="arrow" 
      />
    </div>
  );
}

