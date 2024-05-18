import { FC } from 'react';
import styles from './Btn.module.css'

interface BtnProps{
    children: string;
    onClick: () => void
}

const Btn:FC<BtnProps> = ({children, onClick}) => {
    return (
        <button className={styles.btn} onClick={onClick}>
            {children}
        </button>
    )
}

export default Btn