import { ChangeEvent, useState } from "react";
import useValidation, { Validations } from "./useValidation";

export interface UseInputProps extends Validations {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: () => void;
  isDirty: boolean;
  setValue: (s: string) => void;
  isEmailValid: boolean;
  isPassEqual: boolean;
}

export const useInput = (initialValue: string, validations: Validations, repeatValue?: string) => {
  const [value, setValue] = useState(initialValue);
  const [isDirty, setIsDirty] = useState(false);
  const valid = useValidation(value, { ...validations, repeatPassword: repeatValue });

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    setIsDirty(true);
  };

  return {
    value,
    onChange,
    setValue,
    onBlur,
    isDirty,
    ...valid,
  };
};
