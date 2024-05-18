import { ChangeEvent, FC } from "react"
import styles from './Input.module.css'

interface InputProps {
    placeholder: string;
    onChange?: (e:ChangeEvent<HTMLInputElement>) => void;
    value: string;
}

const Input:FC<InputProps> = ({onChange, placeholder, value}) => {
    return (
        <>
            <input 
                id="input"
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                type="text" 
                className={styles.input}
            />
            <label htmlFor="input">{placeholder}</label>
        </>

    )
}

export default Input