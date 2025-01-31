import { ChangeEvent, forwardRef, InputHTMLAttributes, useId, useState } from 'react';
import cl from './index.module.scss';
import cn from 'classnames';
import { ExclamIcon } from '../assets/ExclamIcon';
import { ClearIcon } from '../assets/ClearIcon';
import { ShowPassIcon } from '../assets/ShowPassIcon';
import { WarningMessage } from '../WarningMessage';
import { useDebounce } from '@/shared/hooks';
import { IWarning } from '@/shared/types';
import { UILabel } from '../UILabel';

interface UIPasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  className?: string;
  required?: boolean;
  clearable?: boolean;
  label?: string;
  id?: string;
  warnings?: IWarning[];
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const UIPasswordInput = forwardRef<HTMLInputElement, UIPasswordInputProps>(({
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
}, ref
) => {
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
      {label && <UILabel htmlFor={id ?? defaultId}>{label}</UILabel>}
      <div className={cn(containerClassName, cl.container)}>
        {value && (
          <div onClick={toggleShowPass} className={cl.showIcon} aria-hidden="true">
            <ShowPassIcon isShow={isShow} />
          </div>
        )}
        <input
          ref={ref}
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
}
)

UIPasswordInput.displayName = "UIPasswordInput"
