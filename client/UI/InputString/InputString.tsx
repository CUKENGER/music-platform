import { ChangeEvent, FC } from "react";
import styles from './InputString.module.css'

interface InputStringProps {
    value: string;
    setValue: (e: string)=> void;
    placeholder: string;
    isRequired?: boolean
}

const InputString: FC<InputStringProps> = ({value, setValue, placeholder, isRequired=false}) => {

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target?.value)
    }

    return (
        <div className={styles.container}>
            <label className={styles.label} htmlFor="input">{placeholder}</label>
            <input 
                id="input"
                onChange={onChange}
                value={value}
                // placeholder={placeholder}
                className={styles.input}
                type="text" 
                required={isRequired}
            />
        </div>

        
    )
}

export default InputString