import { FC, InputHTMLAttributes, useCallback, useId, useState } from 'react';
import { ExclamIcon } from '../assets/ExclamIcon/ExclamIcon';
import { ClearIcon } from '../assets/ClearIcon/ClearIcon';
import styles from './Input.module.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export const Input: FC<InputProps> = ({ placeholder, ...props }) => {
  const id = useId();
  const [value, setValue] = useState(props.value);

  const handleClear = useCallback(() => {
    if (props.onChange) {
      const event = {
        target: {
          value: '',
        },
      } as React.ChangeEvent<HTMLInputElement>;
      props.onChange(event);
    }
  }, [props]);

  return (
    <div className={styles.container}>
      <label htmlFor={`inputString-${id}`} className={styles.label}>
        {placeholder}
      </label>
      {value === '' ? (
        <div className={styles.exclam_container}>
          <ExclamIcon />
        </div>
      ) : (
        <ClearIcon handleClear={handleClear} />
      )}
      <input
        id={`inputString-${id}`}
        className={styles.input}
        aria-invalid={value === ''}
        aria-label={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (props.onChange) {
            props.onChange(e);
          }
        }}
        {...props}
      />
    </div>
  );
};
