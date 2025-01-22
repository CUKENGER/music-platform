import { ChangeEvent, InputHTMLAttributes, useId, useState } from 'react';
import cl from './index.module.scss';
import cn from 'classnames';
import { ExclamIcon } from '../assets/ExclamIcon';
import { ClearIcon } from '../assets/ClearIcon';
import { ShowPassIcon } from '../assets/ShowPassIcon';
import { UILabelField } from '../UILabelField';
import { WarningMessage } from '../WarningMessage';
import { useDebounce } from '@/shared/hooks';

interface Warning {
  condition?: boolean;
  text: string;
}

interface UIPasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  className?: string;
  required?: boolean;
  clearable?: boolean;
  label?: string;
  id?: string;
  warnings?: Warning[];
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const UIPasswordInput = ({
  containerClassName,
  className,
  required,
  clearable,
  value,
  onChange,
  label,
  id,
  warnings,
  ...inputProps
}: UIPasswordInputProps) => {
  const [isShow, setIsShow] = useState(false);

  const debounceValue = useDebounce(value, 200);

  const handleClear = () => {
    const event = {
      target: { value: '' },
      nativeEvent: {},
    } as ChangeEvent<HTMLInputElement>;

    if (onChange) {
      onChange(event);
    }
  };

  const toggleShowPass = () => {
    setIsShow((prev) => !prev);
  };

  const defaultId = useId();
  return (
    <div className={cl.TextFieldContainer}>
      {label && <UILabelField htmlFor={id ?? defaultId}>{label}</UILabelField>}
      <div className={cn(containerClassName, cl.container)}>
        {value && (
          <div onClick={toggleShowPass} className={cl.showIcon} aria-hidden="true">
            <ShowPassIcon isShow={isShow} />
          </div>
        )}
        <input
          id={id ?? defaultId}
          className={cn(className, cl.input)}
          value={value}
          onChange={onChange}
          required={required}
          type={isShow ? 'text' : 'password'}
          {...inputProps}
        />
        {clearable && value && <ClearIcon handleClear={handleClear} />}
        {required && !value && <ExclamIcon className={cl.icon_container} />}
      </div>
      {warnings && debounceValue && (
        <div className={cl.warnings_container}>
          {warnings.map(
            (warning, index) =>
              warning.condition && <WarningMessage key={index} text={warning.text} />,
          )}
        </div>
      )}
    </div>
  );
};
