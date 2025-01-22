import { UseInputProps } from '@/shared/types';
import styles from './LoginInput.module.scss';
import { InputHTMLAttributes, useId, useState } from 'react';
import { ExclamIcon } from '../assets/ExclamIcon';
import { ClearIcon } from '../assets/ClearIcon';
import { ShowPassIcon } from '../assets/ShowPassIcon';
import { WarningMessage } from '../WarningMessage';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputValue: UseInputProps;
  placeholder: string;
  warnings?: Warning[];
}

export const PasswordInput = ({
  inputValue,
  placeholder,
  warnings,
  ...inputProps
}: PasswordInputProps) => {
  const id = useId();
  const [isShow, setIsShow] = useState(false);

  const handleClear = () => {
    if (inputValue.setValue) {
      inputValue.setValue('');
      setIsShow(false);
    }
  };

  const toggleShowPass = () => {
    setIsShow((prev) => !prev);
  };

  const showExclamIcon = inputValue.isEmpty && !warnings?.some((warning) => warning.condition);

  return (
    <div className={styles.container}>
      <label htmlFor={`inputString-${id}`} className={styles.label}>
        {placeholder}
      </label>
      {showExclamIcon ?
        <ExclamIcon />
      : <ClearIcon handleClear={handleClear} />}

      {inputValue.value.trim() && (
        <div onClick={toggleShowPass} className={styles.showIcon} aria-hidden="true">
          <ShowPassIcon isShow={isShow} />
        </div>
      )}
      <input
        id={`inputString-${id}`}
        className={styles.input}
        aria-invalid={inputValue.isEmpty}
        aria-label={placeholder}
        onChange={inputValue.onChange}
        onBlur={inputValue.onBlur}
        type={isShow ? 'text' : 'password'}
        value={inputValue.value}
        {...inputProps}
      />
      {warnings &&
        warnings.map((warning, index) => <WarningMessage key={index} text={warning.message} />)}
    </div>
  );
};

interface Warning {
  condition: boolean;
  message: string;
}

interface EmailInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputValue: UseInputProps;
  placeholder: string;
  warnings?: Warning[];
}

export const EmailInput = ({
  inputValue,
  placeholder,
  warnings,
  ...inputProps
}: EmailInputProps) => {
  const id = useId();

  const handleClear = () => {
    if (inputValue.setValue) {
      inputValue.setValue('');
    }
  };

  const showExclamIcon = inputValue.isEmpty && !warnings?.some((warning) => warning.condition);

  return (
    <div className={styles.container}>
      <label htmlFor={`inputString-${id}`} className={styles.label}>
        {placeholder}
      </label>
      {showExclamIcon ?
        <div className={styles.exclam_container}>
          <ExclamIcon />
        </div>
      : <ClearIcon handleClear={handleClear} />}
      <input
        id={`inputString-${id}`}
        className={styles.input}
        aria-invalid={inputValue.isEmpty || warnings?.some((warning) => warning.condition)}
        aria-label={placeholder}
        onChange={inputValue.onChange}
        onBlur={inputValue.onBlur}
        type="email"
        value={inputValue.value}
        {...inputProps}
      />
      {warnings &&
        warnings.map((warning, index) => <WarningMessage key={index} text={warning.message} />)}
    </div>
  );
};
