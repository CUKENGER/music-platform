import { ChangeEvent, FC, memo, TextareaHTMLAttributes, useEffect, useId, useRef } from "react";
import styles from './Textarea.module.scss';
import ExclamIcon from "@/shared/ui/assets/ExclamIcon/ExclamIcon";
import ClearIcon from "@/shared/ui/assets/ClearIcon/ClearIcon";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{
  placeholder: string
  value:string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: ChangeEvent<HTMLTextAreaElement>) => void,
  isEmpty?: boolean;
  isRequired?: boolean;
  setValue?: (e:string) => void
}

const Textarea:FC<TextareaProps> = ({placeholder, value, onChange, onBlur, isEmpty, isRequired=true, setValue, ...props}) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
      if (textareaRef.current) {
          textareaRef.current.style.height = '100%';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
  }, [value]);

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
    if(setValue) {
      setValue('')
    }
  }

  return (
    <div className={styles.container}>
       <label className={styles.label} htmlFor={`textarea-${id}`}>{placeholder}</label>
          <textarea 
              id={`textarea-${id}`}
              onChange={onChange}
              value={value}
              ref={textareaRef}
              onInput={handleInput}
              className={styles.textarea} 
              required={isRequired}
              onBlur={onBlur}
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

export default memo(Textarea);