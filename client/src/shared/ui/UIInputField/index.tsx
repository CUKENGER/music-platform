import { ChangeEvent, InputHTMLAttributes} from "react"
import cl from './index.module.scss'
import cn from 'classnames'
import { ExclamIcon } from "../assets/ExclamIcon"
import { ClearIcon } from "../assets/ClearIcon"

interface UIInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  className?: string;
  required?: boolean;
  clearable?: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const UIInputField = ({ containerClassName, className, required = false, clearable = false, value, onChange, ...inputProps }: UIInputFieldProps) => {

  const handleClear = () => {
    onChange({ target: { value: '' }, nativeEvent: {} } as ChangeEvent<HTMLInputElement>);
  };

  return (
    <div
      className={
        cn(containerClassName, cl.container)
      }
    >
      <input
        className={cn(className, cl.input)}
        required={required}
        value={value}
        onChange={onChange}
        {...inputProps}
      />
      {clearable && value && <ClearIcon handleClear={handleClear} />}
      {required && !value && <ExclamIcon className={cl.icon_container} />}
    </div>
  )
}
