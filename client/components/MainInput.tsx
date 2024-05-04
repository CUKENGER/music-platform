import useActions from '@/hooks/useActions'
import useDebounce from '@/hooks/useDebounce'
import { useTypedSelector } from '@/hooks/useTypedSelector'
import styles from '@/styles/MainInput.module.css'
import { ChangeEvent, FC, useEffect, useState } from 'react'

interface MainInputProps {
    placeholder?: string
}

const MainInput: FC<MainInputProps> = ({placeholder='Найти'}) => {

    const [value, setValue] = useState<string>('')
    const [isDebouncing, setIsDebouncing] = useState(false)
    const {setSearchInput} = useActions()

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setIsDebouncing(true)
    };

    useEffect(()=>{
        const timer = setTimeout(()=> {
            setSearchInput(value)
            setIsDebouncing(false)
        }, 500)
        return ()=> clearTimeout(timer)
    }, [value, setSearchInput])

    return (
        <div className={styles.input_container}>
            <input 
                className={styles.input}
                onChange={onChange}
                value={value}
                placeholder={placeholder}
            />
            {isDebouncing 
                && (<span className={styles.loader}></span>)
            }
            
        </div>
        
    )
}

export default MainInput;