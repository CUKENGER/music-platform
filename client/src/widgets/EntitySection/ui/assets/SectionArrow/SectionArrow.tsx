import { FC } from 'react';
import styles from './SectionArrow.module.scss';
import arrowIcon from './arrow.svg';
import grayArrowIcon from './grayArrow.svg';
import classNames from 'classnames';

interface SectionArrowProps {
  left?: boolean;
  onClick: () => void;
  isDisabled?: boolean;
  className?: string;
}

export const SectionArrow: FC<SectionArrowProps> = ({
  onClick,
  left = false,
  isDisabled = false,
  className,
}) => {
  return (
    <div className={styles.container}>
      <img
        onClick={onClick}
        className={classNames(className, !left && styles.right)}
        src={isDisabled ? grayArrowIcon : arrowIcon}
        alt="arrow"
      />
    </div>
  );
};
