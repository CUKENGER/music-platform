import { memo, FC } from "react";
import styles from "./ExclamIcon.module.scss"
import exclamErrorIcon from '@/assets/exclamError.svg'


interface ExclamIconProps {

}

const ExclamIcon: FC<ExclamIconProps> = () => {
  return (
    <div className={styles.ExclamIcon}>
      <img className={styles.exclam} src={exclamErrorIcon} alt="error icon" />
    </div>
  );
};

export default memo(ExclamIcon);