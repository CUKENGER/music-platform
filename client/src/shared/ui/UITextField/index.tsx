import { ChangeEvent, forwardRef, InputHTMLAttributes, useId } from 'react';
import { WarningMessage } from '../WarningMessage';
import cl from './index.module.scss';
import { useDebounce } from '@/shared/hooks';
import { UILabel } from '../UILabel';
import { UIInput } from '../UIInput';

interface Warning {
  condition?: boolean;
  text?: string;
}

interface UITextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
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

export const UITextField = forwardRef<HTMLInputElement, UITextFieldProps>(
  (
    {
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
    },
    ref,
  ) => {
    const debounceValue = useDebounce(value, 200);
    const defaultId = useId();
    return (
      <div className={cl.container}>
        {label && <UILabel htmlFor={id ?? defaultId}>{label}</UILabel>}
        <UIInput
          ref={ref}
          id={id ?? defaultId}
          containerClassName={containerClassName}
          className={className}
          required={required}
          clearable={clearable}
          value={value}
          onChange={onChange}
          {...inputProps}
        />
        <div className={cl.warnings_container}>
          {warnings &&
            debounceValue &&
            warnings.map(
              (warning, index) =>
                warning.condition && (
                  <WarningMessage
                    key={index}
                    text={warning.text}
                  />
                ),
            )}
        </div>
      </div>
    );
  },
);

UITextField.displayName = 'UITextField';
