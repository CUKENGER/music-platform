import { ChangeEvent, InputHTMLAttributes } from 'react';
import cl from './index.module.scss';
import cn from 'classnames';
import { ExclamIcon } from '../assets/ExclamIcon';
import { ClearIcon } from '../assets/ClearIcon';

interface UIInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  className?: string;
  required?: boolean;
  clearable?: boolean;
}

export const UIInputField = ({
  containerClassName,
  className,
  required = false,
  clearable = false,
  ...inputProps
}: UIInputFieldProps) => {
  const handleClear = () => {
    const event = {
      target: { value: '' },
      nativeEvent: {},
    } as ChangeEvent<HTMLInputElement>;

    if (inputProps.onChange) {
      inputProps.onChange(event);
    }
  };

  return (
    <div className={cn(containerClassName, cl.container)}>
      <input className={cn(className, cl.input)} required={required} {...inputProps} />
      {clearable && inputProps.value && <ClearIcon handleClear={handleClear} />}
      {required && !inputProps.value && <ExclamIcon className={cl.icon_container} />}
    </div>
  );
};
