import { ChangeEvent, useState } from 'react';
import { useValidation } from './useValidation';
import { Validations } from '../types/UseInputProps';

export const useInput = (initialValue: string, validations: Validations, repeatValue?: string) => {
  const [value, setValue] = useState(initialValue);
  const [isDirty, setIsDirty] = useState(false);
  const valid = useValidation(value, {
    ...validations,
    repeatPassword: repeatValue,
  });

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
