'use client'

import {FC, useState} from 'react' ;
import Image from 'next/image';
import burger from '../assets/burger_menu.svg';
import styles from '../styles/Header.module.css'
import NavBar from './NavBar';

interface HeaderProps {
    title?:string;
}

const Header:FC<HeaderProps> = ({title}) => {

    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    return (
        <header className={styles.container}>
            
            <Image onClick={toggleMenu} className={styles.image} src={burger} alt='burger menu icon'/>
            
            <p className={styles.title}>{title}</p>
            <NavBar isOpen={isOpen} toggleMenu={toggleMenu}/>
            
        </header>
    )
}

export default Header;