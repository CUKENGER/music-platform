import { TextareaHTMLAttributes, useEffect, useId, useRef } from "react";
import styles from './TextareaForHook.module.scss';
import { ClearIcon } from "../assets/ClearIcon/";
import { ExclamIcon } from "../assets/ExclamIcon/";
import cn from "classnames";
import { UseInputProps } from "@/shared/types";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder: string;
  inputValue: UseInputProps;
  classNameContainer?: string;
  classNameTextarea?: string
}

export const TextareaForHook = ({ inputValue, placeholder, classNameContainer, classNameTextarea, ...props }: TextareaProps) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '100%';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue.value]);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = 'auto';
    if (e.currentTarget.scrollHeight <= 300) {
      e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
    } else {
      e.currentTarget.style.height = '300px';
    }
  };

  const id = useId()

  const handleClear = () => {
    if (inputValue.setValue) {
      inputValue.setValue('')
    }
  }

  return (
    <div className={cn(
      classNameContainer,
      styles.container
    )}>
      <label className={styles.label} htmlFor={`textarea-${id}`}>{placeholder}</label>
      <textarea
        id={`textarea-${id}`}
        onChange={inputValue.onChange}
        value={inputValue.value}
        ref={textareaRef}
        onInput={handleInput}
        className={cn(
          classNameTextarea,
          styles.textarea
        )}
        onBlur={inputValue.onBlur}
        {...props}
      >

      </textarea>
      {inputValue.isEmpty
        ? (<div className={styles.exclam_container}>
          <ExclamIcon />
        </div>
        )
        : (<ClearIcon handleClear={handleClear} />)
      }
    </div>
  );
};
