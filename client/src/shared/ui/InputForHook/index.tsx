import { InputHTMLAttributes, useId } from 'react'
import styles from './InputForHook.module.scss'
import { ExclamIcon } from '../assets/ExclamIcon/';
import { ClearIcon } from '../assets/ClearIcon/';
import { UseInputProps } from '@/shared/types';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  inputValue: UseInputProps
}

export const InputForHook = ({ inputValue, placeholder, ...inputProps }: InputProps) => {

  const id = useId()

  const handleClear = () => {
    if (inputValue.setValue) {
      inputValue.setValue('');
    }
  };

  if (!inputValue) {
    console.error("Input component: 'inputValue' is undefined or null.");
    return null;
  }

  return (
    <div className={styles.container}>
      <label htmlFor={`inputString-${id}`} className={styles.label}>
        {placeholder}
      </label>
      {inputValue.isEmpty
        ? <div className={styles.exclam_container}>
          <ExclamIcon />
        </div>
        : <ClearIcon handleClear={handleClear} />
      }
      <input
        id={`inputString-${id}`}
        className={styles.input}
        aria-invalid={inputValue.isEmpty}
        aria-label={placeholder}
        onBlur={inputValue.onBlur}
        onChange={inputValue.onChange}
        value={inputValue.value}
        {...inputProps}
      />
    </div>
  )
}
