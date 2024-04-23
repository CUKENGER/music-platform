import { ChangeEvent, FC } from "react"
import styles from '@/styles/Input.module.css'

interface InputProps {
    label?: string;
    placeholder?: string;
    value?: string | undefined;
    setValue: (value: string) => void;
    isRequired: boolean;
}

const Input:FC<InputProps> = ({placeholder, label, value, setValue, isRequired = false}) => {

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target?.value)
    }

    return (
        <>
            <input onChange={onChange} value={value} className={styles.input} id='text' type="text" placeholder={placeholder} required={isRequired} />
            <label className={styles.label} htmlFor="text">{label}</label>
        </>
    )
}

export default Input