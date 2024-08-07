import { ChangeEvent, FC, memo, useCallback, useState } from "react";
import styles from './InputString.module.scss';
import { genToTag } from "@/services/genIdToTag";
import ClearIcon from "../ClearIcon";
import ShowPassIcon from "../Icons/ShowPassIcon";
import ExclamIcon from "../Icons/ExclamIcon";


export enum InputTypes {
  EMAIL = 'email',
  PASSWORD = 'password',
  TEXT = 'text'
}

interface InputStringProps {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  isEmpty?: boolean;
  isRequired?: boolean;
  setValue?: (e: string) => void;
  name?: string;
  type: InputTypes
}

const InputString: FC<InputStringProps> = ({
  placeholder,
  value,
  onChange,
  onBlur,
  isEmpty,
  isRequired = true,
  setValue,
  name,
  type
}) => {
  const id = genToTag();
  const [isShow, setIsShow] = useState(false);

  const handleClear = useCallback(() => {
    if (setValue) {
      setValue('');
      setIsShow(false);
    }
  }, [setValue]);

  const toggleShowPass = useCallback(() => {
    setIsShow(prev => !prev);
  }, []);

  let typeToUse = type;
  if (type === InputTypes.PASSWORD && isShow) {
    typeToUse = InputTypes.TEXT;
  }

  return (
    <div className={styles.container}>
      <label htmlFor={`inputString-${id}`} className={styles.label}>
        {placeholder}
      </label>
      {isEmpty 
      ? <div className={styles.exclam_container}>
          <ExclamIcon/> 
        </div>
      : <ClearIcon handleClear={handleClear} />
      }
      {type===InputTypes.PASSWORD && value.trim() && (
        <div onClick={toggleShowPass} className={styles.showIcon} aria-hidden="true">
          <ShowPassIcon isShow={isShow} />
        </div>
      )}
      <input
        name={name}
        id={`inputString-${id}`}
        className={styles.input}
        onChange={onChange}
        value={value}
        type={typeToUse}
        onBlur={onBlur}
        required={isRequired}
        aria-invalid={isEmpty}
        aria-label={placeholder}
      />
    </div>
  );
};

export default memo(InputString);
