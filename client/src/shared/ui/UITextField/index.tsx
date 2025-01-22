import { ChangeEvent, InputHTMLAttributes, useId } from 'react';
import { UIInputField } from '../UIInputField';
import { UILabelField } from '../UILabelField';
import { WarningMessage } from '../WarningMessage';
import cl from './index.module.scss';
import { useDebounce } from '@/shared/hooks';

interface Warning {
  condition?: boolean;
  text: string;
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

export const UITextField = ({
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
}: UITextFieldProps) => {
  const debounceValue = useDebounce(value, 200);
  const defaultId = useId();
  return (
    <div className={cl.container}>
      {label && <UILabelField htmlFor={id ?? defaultId}>{label}</UILabelField>}
      <UIInputField
        id={id ?? defaultId}
        containerClassName={containerClassName}
        className={className}
        required={required}
        clearable={clearable}
        value={value}
        onChange={onChange}
        {...inputProps}
      />
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
