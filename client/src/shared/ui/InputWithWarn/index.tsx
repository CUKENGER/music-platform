import { InputHTMLAttributes, useId, useState } from 'react';
import { WarningMessage } from '../WarningMessage/';
import styles from './InputWithWarn.module.scss';
import { ExclamIcon } from '../assets/ExclamIcon/';
import { ClearIcon } from '../assets/ClearIcon/';

interface InputWithWarnProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  warnings?: { condition: boolean | undefined; message: string }[];
}

export const InputWithWarn = ({ placeholder, warnings, ...props }: InputWithWarnProps) => {
  const id = useId();
  const [isDirty, setIsDirty] = useState(false);

  const handleClear = () => {
    if (props.onChange) {
      const event = {
        target: {
          value: '',
        },
      } as React.ChangeEvent<HTMLInputElement>;
      props.onChange(event);
    }
  };

  const showExclamIcon =
    isDirty && props.value && props.value === '' && !warnings?.some((warning) => warning.condition);

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
        aria-invalid={warnings?.some((warning) => warning.condition)}
        aria-label={placeholder}
        type="email"
        onBlur={() => setIsDirty(true)}
        {...props}
      />
      {isDirty &&
        warnings &&
        warnings.map((warning, index) => <WarningMessage key={index} text={warning.message} />)}
    </div>
  );
};
