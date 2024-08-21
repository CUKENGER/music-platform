import { FC} from "react";
import styles from "./WarningMessage.module.scss";
import { ExclamIcon } from "../assets/ExclamIcon/ExclamIcon";

interface WarningMessageProps {
  text: string
}

export const WarningMessage:FC<WarningMessageProps> = ({text}) => {
  return (
    <div className={styles.WarningMessage}>
      <ExclamIcon isRed={true}/>
      {text}
      </div>
  );
};
