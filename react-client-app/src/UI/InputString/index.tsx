import { ChangeEvent, FC, memo, useCallback, useState } from "react";
import styles from './InputString.module.scss';
import { genToTag } from "@/services/genIdToTag";
import ClearIcon from "../ClearIcon";
import ExclamIcon from "../ExclamIcon";
import ShowPassIcon from "../Icons/ShowPassIcon";

interface InputStringProps {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  isEmpty?: boolean;
  isRequired?: boolean;
  setValue?: (e: string) => void;
  isPass?: boolean;
}

const InputString: FC<InputStringProps> = ({
  placeholder,
  value,
  onChange,
  onBlur,
  isEmpty,
  isRequired = true,
  setValue,
  isPass = false
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

  return (
    <div className={styles.container}>
      <label htmlFor={`inputString-${id}`} className={styles.label}>
        {placeholder}
      </label>
      {isEmpty ? <ExclamIcon /> : <ClearIcon handleClear={handleClear} />}
      {isPass && value.trim() && (
        <div onClick={toggleShowPass} className={styles.showIcon} aria-hidden="true">
          <ShowPassIcon isShow={isShow} />
        </div>
      )}
      <input
        id={`inputString-${id}`}
        className={styles.input}
        onChange={onChange}
        value={value}
        type={isPass && !isShow ? 'password' : 'text'}
        onBlur={onBlur}
        required={isRequired}
        aria-invalid={isEmpty}
        aria-label={placeholder}
      />
    </div>
  );
};

export default memo(InputString);
