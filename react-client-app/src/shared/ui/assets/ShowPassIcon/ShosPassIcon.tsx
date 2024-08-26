import { memo, FC} from "react";
import styles from "./index.module.scss"
import eye from '@/assets/eye.svg'
import eye_off from '@/assets/eye_off.svg'

interface ShowPassIconProps {
  isShow: boolean
}

const ShowPassIcon:FC<ShowPassIconProps> = ({isShow}) => {
  return (
    <div className={styles.ShowPassIcon}>
      <img src={isShow ? eye : eye_off} alt="show password" />
    </div>
  );
};

export default memo(ShowPassIcon);