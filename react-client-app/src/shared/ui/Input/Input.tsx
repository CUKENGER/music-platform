import { FC, InputHTMLAttributes, useCallback, useId } from 'react'
import styles from './Input.module.scss'
import ExclamIcon from '../assets/ExclamIcon/ExclamIcon';
import ClearIcon from '../assets/ClearIcon/ClearIcon';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  setValue: (e: string) => void;
  placeholder?: string;
  isEmpty?: boolean;
  value: string
}

export const Input:FC<InputProps> = ({setValue, placeholder, isEmpty, ...inputProps}) => {

  const id = useId()

  const handleClear = useCallback(() => {
    if (setValue) {
      setValue('');
    }
  }, [setValue]);

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
      <input
        id={`inputString-${id}`}
        className={styles.input}
        aria-invalid={isEmpty}
        aria-label={placeholder}
        {...inputProps}
      />
    </div>
  )
}