import { TextareaHTMLAttributes, useCallback, useEffect, useId, useRef } from "react";
import styles from './Textarea.module.scss';
import { ClearIcon } from "../assets/ClearIcon";
import { ExclamIcon } from "../assets/ExclamIcon";
import classNames from "classnames";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
  classNameContainer?: string;
  classNameTextarea?: string
}

export const Textarea = ({ placeholder, classNameContainer, classNameTextarea, ...props }: TextareaProps) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '100%';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = 'auto';
    if (e.currentTarget.scrollHeight <= 300) {
      e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
    } else {
      e.currentTarget.style.height = '300px';
    }
  };

  const id = useId()

  const handleClear = useCallback(() => {
    if (props.onChange) {
      const event = {
        target: {
          value: '',
        },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      props.onChange(event);
    }
  }, [props]);

  return (
    <div className={classNames(
      classNameContainer,
      styles.container
    )}>
      <label className={styles.label} htmlFor={`textarea-${id}`}>{placeholder}</label>
      <textarea
        id={`textarea-${id}`}
        ref={textareaRef}
        onInput={handleInput}
        className={classNames(
          classNameTextarea,
          styles.textarea
        )}
        {...props}
      >

      </textarea>
      {props.value === ''
        ? (<div className={styles.exclam_container}>
          <ExclamIcon />
        </div>
        )
        : (<ClearIcon handleClear={handleClear} />)
      }
    </div>
  );
};
