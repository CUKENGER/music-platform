import { FC, InputHTMLAttributes } from "react"
import { Input } from "../Input/Input"
import { WarningMessage } from "../WarningMessage/WarningMessage";
import { UseInputProps } from "@/shared/hooks/useInput";

interface InputWithWarnProps extends InputHTMLAttributes<HTMLInputElement>{
  inputProps: UseInputProps;
  placeholder: string;
  warnings: { condition: boolean | undefined; message: string }[];
}

export const InputWithWarn: FC<InputWithWarnProps> = ({ inputProps, placeholder, warnings,  }) => {

  if (!inputProps) {
    return null
  }

  return (
    <>
       <Input
        name={placeholder}
        placeholder={placeholder}
        inputValue={inputProps}
      />
      {warnings.map((warning, index) => 
        warning.condition && <WarningMessage key={index} text={warning.message} />
      )}
    </>
  )
}