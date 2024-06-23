import { ChangeEvent, FC, memo, useEffect, useRef } from "react";
import styles from './Textarea.module.scss'
import exclamErrorIcon from '@/assets/exclamError.svg'

interface TextareaProps{
  placeholder: string
  value:string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: ChangeEvent<HTMLTextAreaElement>) => void,
  isEmpty?: boolean;
  isRequired?: boolean
}

const Textarea:FC<TextareaProps> = ({placeholder, value, onChange, onBlur, isEmpty, isRequired=true}) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
      if (textareaRef.current) {
          textareaRef.current.style.height = '100%';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
  }, []);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      e.currentTarget.style.height = 'auto';
      if(e.currentTarget.scrollHeight <= 300) {
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
      } else {
          e.currentTarget.style.height = '300px';
      }
  };

  return (
    <div className={styles.container}>
       <label className={styles.label} htmlFor="textarea">{placeholder}</label>
          <textarea 
              id="textarea"
              onChange={onChange}
              value={value}
              ref={textareaRef}
              onInput={handleInput}
              className={styles.textarea} 
              required={isRequired}
              onBlur={onBlur}
          >
            
        </textarea>
        {isEmpty && (
          <div className={styles.exclam_container}>
            <img className={styles.exclam} src={exclamErrorIcon} alt="error icon" />
          </div>
        )}
    </div>
  );
};

export default memo(Textarea);