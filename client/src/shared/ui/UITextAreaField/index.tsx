import { ChangeEvent, forwardRef, InputHTMLAttributes, useId } from 'react';
import { WarningMessage } from '../WarningMessage';
import cl from './index.module.scss';
import { useDebounce } from '@/shared/hooks';
import { IWarning } from '@/shared/types';
import { UILabel } from '../UILabel';
import { UITextArea } from '../UITextArea';
import cn from 'classnames';

interface UITextAreaFieldProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  className?: string;
  required?: boolean;
  clearable?: boolean;
  label?: string;
  id?: string;
  warnings?: IWarning[];
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const UITextAreaField = forwardRef<HTMLTextAreaElement, UITextAreaFieldProps>(
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
        <UITextArea
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
  },
);

UITextAreaField.displayName = 'UITextField';
