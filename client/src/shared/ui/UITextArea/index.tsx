import { ChangeEvent, forwardRef, InputHTMLAttributes, useEffect, useRef } from 'react';
import cl from './index.module.scss';
import cn from 'classnames';
import { ExclamIcon } from '../assets/ExclamIcon';
import { ClearIcon } from '../assets/ClearIcon';

interface UITextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  className?: string;
  required?: boolean;
  clearable?: boolean;
}

export const UITextArea = forwardRef<HTMLTextAreaElement, UITextAreaProps>(
  ({ containerClassName, className, required = false, clearable = false, ...inputProps }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [inputProps.value]);

    const handleClear = () => {
      const event = {
        target: { value: '' },
        nativeEvent: {},
      } as ChangeEvent<HTMLTextAreaElement>;

      if (inputProps.onChange) {
        inputProps.onChange(event);
      }
    };

    return (
      <div className={cn(containerClassName, cl.container)}>
        <textarea
          ref={(node) => {
            textareaRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          className={cn(className, cl.textarea)}
          required={required}
          {...inputProps}
        />
        {clearable && inputProps.value && <ClearIcon handleClear={handleClear} />}
        {required && !inputProps.value && <ExclamIcon className={cl.icon_container} />}
      </div>
    );
  },
);

UITextArea.displayName = 'UITextArea';
