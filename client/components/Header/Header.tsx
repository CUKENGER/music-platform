'use client'

import {FC, useState} from 'react' ;
import Image from 'next/image';
import burger from '@/assets/burger_menu.svg';
import styles from './Header.module.css'
import NavBar from '../NavBar/NavBar';
import useActions from "@/hooks/useActions";
import {useTypedSelector} from "@/hooks/useTypedSelector";

interface HeaderProps {
    title?:string;
}

const Header:FC<HeaderProps> = ({title}) => {

    const [isOpen, setIsOpen] = useState(false)
    const {setIsNavbarOpen} = useActions()
    const {isNavbarOpen} = useTypedSelector(state => state.dropdownReducer)
    const toggleMenu = () => {
        setIsOpen(!isOpen)
        setIsNavbarOpen(!isNavbarOpen)
    }

    return (
        <header className={styles.container}>
            
            <Image onClick={toggleMenu} className={styles.image} src={burger} alt='burger menu icon'/>
            
            <p className={styles.title}>{title}</p>
            <NavBar isOpen={isOpen} toggleMenu={toggleMenu} setIsNavbarOpen={setIsNavbarOpen} setIsOpen={setIsOpen}/>
            
        </header>
    )
}

export default Header;