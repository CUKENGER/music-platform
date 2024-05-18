import { ChangeEvent, FC, useEffect, useRef } from "react"
import styles from './Textarea.module.css'

interface TextareaProps {
    placeholder?: string;
    value: string;
    setValue?: (value:any) => void;
    isRequired?: boolean;
    onChangeNeed?: boolean;
    handleChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea:FC<TextareaProps> = ({placeholder, value, setValue, isRequired=false, onChangeNeed=false, handleChange})=>{

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

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if(setValue) {
            setValue(e.target?.value)
        }
    }

    return (

        <div className={styles.container}>
            {onChangeNeed 
                ? (
                    <>
                        <label className={styles.label} htmlFor="textarea">{placeholder}</label>
                        <textarea 
                            id="textarea"
                            onChange={onChange}
                            value={value}
                            ref={textareaRef}
                            onInput={handleInput}
                            className={styles.textarea} 
                            // placeholder={placeholder}
                            required={isRequired}
                        >
                        </textarea>
                    </>
            
                    
                )
                : (
                    <>  
                        <label className={styles.label} htmlFor="textarea">{placeholder}</label>
                        <textarea 
                            id="textarea"
                            onChange={handleChange}
                            value={value}
                            ref={textareaRef}
                            onInput={handleInput}
                            className={styles.textarea} 
                            // placeholder={placeholder}
                            required={isRequired}
                        >
                        </textarea>
                    </>
                )

            }
            
        </div>
    )
}   

export default Textarea