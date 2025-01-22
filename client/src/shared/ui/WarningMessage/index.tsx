import styles from './WarningMessage.module.scss';
import { ExclamIcon } from '../assets/ExclamIcon/';

interface WarningMessageProps {
  text: string;
}

export const WarningMessage = ({ text }: WarningMessageProps) => {
  return (
    <div className={styles.WarningMessage}>
      <ExclamIcon className={styles.icon_container} />
      <p className={styles.text}>{text}</p>
    </div>
  );
};
