import { ChangeEvent, FC, memo, useEffect, useRef } from "react";
import styles from './Textarea.module.scss'
import { genToTag } from "@/services/genIdToTag";
import ClearIcon from "../ClearIcon";
import ExclamIcon from "../Icons/ExclamIcon";

interface TextareaProps{
  placeholder: string
  value:string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: ChangeEvent<HTMLTextAreaElement>) => void,
  isEmpty?: boolean;
  isRequired?: boolean;
  setValue?: (e:string) => void
}

const Textarea:FC<TextareaProps> = ({placeholder, value, onChange, onBlur, isEmpty, isRequired=true, setValue}) => {

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

  const id = genToTag()

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