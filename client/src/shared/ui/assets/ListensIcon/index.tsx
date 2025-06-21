import { ListensIcon } from './ListensIcon';
import styles from './ListensIcon.module.scss';
import classNames from 'classnames';

interface ListensIconProps {
  listens?: number;
  className?: string;
}

export const ListensContainer = ({ listens, className }: ListensIconProps) => {
  return (
    <div className={classNames(className, styles.ListensIcon)}>
      <ListensIcon className={styles.icon} />
      <p className={styles.ListensText}>{listens}</p>
    </div>
  );
};
