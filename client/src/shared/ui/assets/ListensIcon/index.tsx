import { FC } from 'react';
import styles from './ListensIcon.module.scss';
import listensIcon from './listens.svg';
import classNames from 'classnames';

interface ListensIconProps {
  listens?: number;
  className?: string;
}

export const ListensIcon: FC<ListensIconProps> = ({ listens, className }) => {
  return (
    <div className={classNames(className, styles.ListensIcon)}>
      <img src={listensIcon} alt="listens" />
      <p>{listens}</p>
    </div>
  );
};
