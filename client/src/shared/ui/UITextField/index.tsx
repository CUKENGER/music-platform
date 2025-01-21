import { ChangeEvent, InputHTMLAttributes } from "react";
import { UIInputField } from "../UIInputField"
import { UILabelField } from "../UILabelField"
import { WarningMessage } from "../WarningMessage";
import cl from './index.module.scss'

interface Warning {
  condition?: boolean;
  text: string
}

interface UITextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  className?: string;
  required?: boolean;
  clearable?: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  id?: string;
  warnings?: Warning[];
}

export const UITextField = ({ containerClassName, className, required, clearable, value, onChange, label, id, warnings, ...inputProps }: UITextFieldProps) => {
  console.log('warnings', warnings)
  return (
    <div className={cl.container}>
      {label && (
        <UILabelField htmlFor={id}>
          {label}
        </UILabelField>
      )}
      <UIInputField
        id={id}
        onChange={onChange}
        value={value}
        containerClassName={containerClassName}
        className={className}
        required={required}
        clearable={clearable}
        {...inputProps}
      />
      {warnings && value && (
        <div>
          {warnings.map((warning, index) => (
            warning.condition && <WarningMessage key={index} text={warning.text}/>
          ))}
        </div>
      )}
    </div>
  )
}
