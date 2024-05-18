import useActions from '@/hooks/useActions'
import styles from './MainInput.module.css'
import { ChangeEvent, FC, useEffect, useState } from 'react'

interface MainInputProps {
    placeholder?: string;
}

const MainInput: FC<MainInputProps> = ({placeholder='Найти'}) => {

    const [value, setValue] = useState<string>('')
    const [isDebouncing, setIsDebouncing] = useState(false)
    const {setSearchInput, setSearchAlbumsInput, setSearchArtistsInput} = useActions()

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setIsDebouncing(true)
    };

    useEffect(()=>{
        const timer = setTimeout(()=> {
            setSearchInput(value)
            setSearchAlbumsInput(value)
            setSearchArtistsInput(value)
            setIsDebouncing(false)
        }, 500)
        return ()=> clearTimeout(timer)
    }, [value, setSearchInput, setSearchAlbumsInput])

    return (
        <div className={styles.input_container}>
            <input 
                id='main_input'
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