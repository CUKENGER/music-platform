import { memo, FC} from "react";
import styles from "./index.module.scss"
import exclamIcon from '@/assets/exclamError.svg'
import exclamRed from '@/assets/exclam_red.svg'

interface ExclamIconProps {
  isRed?: boolean
}

const ExclamIcon:FC<ExclamIconProps> = ({isRed=false}) => {
  return (
    <div className={styles.ExclamIcon}>
      <img src={isRed ? exclamRed : exclamIcon} alt="exclam" />
    </div>
  );
};

export default memo(ExclamIcon);