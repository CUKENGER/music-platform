import { ChangeEvent, FC, memo } from "react";
import styles from './InputString.module.scss'
import { genToTag } from "@/services/genIdToTag";
import exclamErrorIcon from '@/assets/exclamError.svg'

interface InputStringProps{
  value:string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: ChangeEvent<HTMLInputElement>) => void,
  isEmpty?: boolean;
  isRequired?: boolean
}

const InputString:FC<InputStringProps> = ({placeholder, value, onChange, onBlur, isEmpty, isRequired=true}) => {

  // const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
  //   setValue(e.target.value)
  // }

  const id = genToTag();

  return (
    <div className={styles.container}>
      <label 
        htmlFor={`inputString-${id}`}
        className={styles.label}
      >
        {placeholder}
      </label>
      {isEmpty && (
        <div className={styles.exclam_container}>
          <img className={styles.exclam} src={exclamErrorIcon} alt="error icon" />
        </div>
      )}
      
      <input
        id={`inputString-${id}`}
        className={styles.input}
        onChange={onChange}
        value={value}
        type="text" 
        onBlur={onBlur}
        required={isRequired}
      />
    </div>
  );
};

export default memo(InputString);