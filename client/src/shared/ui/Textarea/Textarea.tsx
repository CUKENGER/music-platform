import { FC,  TextareaHTMLAttributes, useEffect, useId, useRef } from "react";
import styles from './Textarea.module.scss';
import { ClearIcon } from "../assets/ClearIcon/ClearIcon";
import { ExclamIcon } from "../assets/ExclamIcon/ExclamIcon";
import { UseInputProps } from "@/shared";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{
  placeholder: string;
  inputValue: UseInputProps
  isEmpty?: boolean;
}

export const Textarea:FC<TextareaProps> = ({ isEmpty, inputValue, placeholder, ...props}) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
      if (textareaRef.current) {
          textareaRef.current.style.height = '100%';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
  }, [inputValue.value]);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      e.currentTarget.style.height = 'auto';
      if(e.currentTarget.scrollHeight <= 300) {
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
      } else {
          e.currentTarget.style.height = '300px';
      }
  };

  const id = useId()

  const handleClear = () => {
    if(inputValue.setValue) {
      inputValue.setValue('')
    }
  }

  return (
    <div className={styles.container}>
       <label className={styles.label} htmlFor={`textarea-${id}`}>{placeholder}</label>
          <textarea 
              id={`textarea-${id}`}
              onChange={inputValue.onChange}
              value={inputValue.value}
              ref={textareaRef}
              onInput={handleInput}
              className={styles.textarea} 
              onBlur={inputValue.onBlur}
              {...props}
          >
            
        </textarea>
        {isEmpty 
        ? (<div className={styles.exclam_container}>
            <ExclamIcon/> 
          </div>
          ) 
        : (<ClearIcon handleClear={handleClear}/>)
        }
        
        
    </div>
  );
};
