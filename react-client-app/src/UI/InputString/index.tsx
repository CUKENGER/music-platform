import { ChangeEvent, FC, memo } from "react";
import styles from './InputString.module.scss'
import { genToTag } from "@/services/genIdToTag";
import ClearIcon from "../ClearIcon";
import ExclamIcon from "../ExclamIcon";


interface InputStringProps{
  value:string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: ChangeEvent<HTMLInputElement>) => void,
  isEmpty?: boolean;
  isRequired?: boolean;
  setValue?:(e:string) => void
}

const InputString:FC<InputStringProps> = ({placeholder, value, onChange, onBlur, isEmpty, isRequired=true, setValue}) => {

  const id = genToTag();

  const handleClear = () => {
    if(setValue){
      setValue('')
    }
  }

  return (
    <div className={styles.container}>
      <label 
        htmlFor={`inputString-${id}`}
        className={styles.label}
      >
        {placeholder}
      </label>
      {isEmpty ? (<ExclamIcon/>) : (<ClearIcon handleClear={handleClear}/>)}
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