import { memo, FC} from "react";
import styles from "./index.module.scss"

interface InputCheckboxProps {
  placeholder:string
}

const InputCheckbox:FC<InputCheckboxProps> = ({placeholder}) => {
  return (
    <label className={styles.label}>
      <input type="checkbox" className={styles.input}/>
      <span className={styles.checkmark}></span>
      {placeholder}
    </label>
  );
};

export default memo(InputCheckbox);