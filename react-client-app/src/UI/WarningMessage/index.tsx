import { memo, FC} from "react";
import styles from "./index.module.scss"
import ExclamIcon from "../Icons/ExclamIcon";

interface WarningMessageProps {
  text: string
}

const WarningMessage:FC<WarningMessageProps> = ({text}) => {
  return (
    <div className={styles.WarningMessage}>
      <ExclamIcon isRed={true}/>
      {text}
      </div>
  );
};

export default memo(WarningMessage);