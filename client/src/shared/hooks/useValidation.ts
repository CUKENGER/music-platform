import { useEffect, useState } from 'react';
import { Validations } from '../types/UseInputProps';

export const useValidation = (value: string, validations: Validations) => {
  const [isEmpty, setIsEmpty] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordStrong, setIsPasswordStrong] = useState(true);
  const [isLatin, setIsLatin] = useState(true);
  const [isLengthValid, setIsLengthValid] = useState(true);
  const [isPassEqual, setIsPassEqual] = useState(true);

  useEffect(() => {
    if (validations.isLatin) {
      const isLatinRegex = /^[a-zA-Z0-9._%+-@]*$/;
      const isLatin = isLatinRegex.test(value);
      setIsLatin(isLatin);
    } else {
      setIsLatin(true);
    }

    for (const validation in validations) {
      switch (validation) {
        case 'isEmpty': {
          setIsEmpty(!value.trim());
          break;
        }
        case 'isEmail': {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          setIsEmailValid(emailRegex.test(value));
          break;
        }
        case 'isPasswordStrong': {
          const hasUpperCase = /[A-Z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          const isLongEnough = value.length >= 8;
          setIsPasswordStrong(hasUpperCase && hasNumber && isLongEnough);
          break;
        }
        case 'isLength': {
          if (validations.isLength) {
            const { min, max } = validations.isLength;
            const isLongEnough = value.length >= min && value.length <= max;
            setIsLengthValid(isLongEnough);
          }
          break;
        }
        case 'repeatPassword': {
          setIsPassEqual(value === validations.repeatPassword);
          break;
        }
        default:
          break;
      }
    }
  }, [value, validations]);

  return {
    isEmpty,
    isEmailValid,
    isPasswordStrong,
    isLatin,
    isLengthValid,
    isPassEqual,
  };
};
