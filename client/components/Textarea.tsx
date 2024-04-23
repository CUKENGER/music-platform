import { ChangeEvent, FC, useEffect, useRef } from "react"
import styles from '@/styles/Textarea.module.css'

interface TextareaProps {
    placeholder?: string;
    value: string;
    setValue: (value:string)=> void
}

const Textarea:FC<TextareaProps> = ({placeholder, value, setValue})=>{

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
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
        setValue(e.target?.value)
    }

    return (
        <textarea 
        onChange={onChange}
        value={value}
        ref={textareaRef}
        onInput={handleInput}
        className={styles.textarea} 
        placeholder={placeholder}></textarea>
    )
}   

export default Textarea