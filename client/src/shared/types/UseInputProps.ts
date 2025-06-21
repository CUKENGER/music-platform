import { ChangeEvent } from 'react';

export interface Validations {
  isEmpty?: boolean;
  isEmail?: boolean;
  isPasswordStrong?: boolean;
  isLatin?: boolean;
  isLength?: { min: number; max: number };
  repeatPassword?: string;
  isPassEqual?: boolean;
  isLengthValid?: boolean;
}

export interface UseInputProps extends Validations {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: () => void;
  isDirty: boolean;
  setValue: (s: string) => void;
  isEmailValid: boolean;
  isPassEqual: boolean;
}
