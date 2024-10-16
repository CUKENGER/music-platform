import { ClearIcon, ExclamIcon, ShowPassIcon, UseInputProps } from '@/shared'
import styles from './LoginInput.module.scss'
import { FC, InputHTMLAttributes, useCallback, useId, useState } from 'react'

interface LoginInputProps extends InputHTMLAttributes<HTMLInputElement>{
  inputValue: UseInputProps;
  placeholder: string;
  isEmpty: boolean | undefined;
  isEmail?: boolean
}

export const LoginInput: FC<LoginInputProps> = ({inputValue, isEmpty, placeholder,isEmail=false, ...inputProps}) => {

  const id = useId()
  const [isShow, setIsShow] = useState(false);

  const handleClear = useCallback(() => {
    if (inputValue.setValue) {
      inputValue.setValue('');
      setIsShow(false);
    }
  }, [inputValue]);

  const toggleShowPass = useCallback(() => {
    setIsShow((prev) => !prev);
  }, []);

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

      {!isEmail && inputValue.value.trim() && (
        <div
          onClick={toggleShowPass}
          className={styles.showIcon}
          aria-hidden="true"
        >
          <ShowPassIcon isShow={isShow} />
        </div>
      )}
      <input
        id={`inputString-${id}`}
        className={styles.input}
        aria-invalid={isEmpty}
        aria-label={placeholder}
        onChange={inputValue.onChange}
        onBlur={inputValue.onBlur}
        type={isEmail ? 'email' : isShow ? 'text' : 'password'}
        value={inputValue.value}
        {...inputProps}
      />
    </div>
  )
}