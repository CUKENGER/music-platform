import { FC } from 'react';
import x from '@/assets/x.svg';
import styles from './NavBar.module.css'
import Image from 'next/image';
import { useRouter } from 'next/router';

interface NavBarProps {
    isOpen: boolean;
    toggleMenu: ()=> void;
}

const menuItems = [
    {text: "Главная", href: '/'},
    {text: "Список треков", href: '/tracks'},
    {text: "Список альбомов", href: '/albums'},
    {text: "Список артистов", href: '/artists'},
]

const NavBar:FC<NavBarProps> = ({isOpen, toggleMenu}) => {

    const router = useRouter()

    return (
        <>
            {isOpen && (
                <div className={`${styles.overlay} ${isOpen ? styles.visible : ''}`}>
                    <div onClick={toggleMenu} className={styles.click_container}></div>
                    <div className={`${styles.menu__container} ${isOpen ? styles.visible : ''}`}>
                        
                            <div
                                className={styles.x__container}
                                onClick={toggleMenu}
                                >
                                <Image
                                    className={styles.x_image}
                                    src={x}
                                    width={21}
                                    height={21}
                                    alt='jesus on this is died'
                                />
                            </div>
                            
                            <ul className={styles.list}>
                                {menuItems.map( ({text, href}, index) => (
                                    <li 
                                    onClick={() => router.push(href)}
                                    key={index} 
                                    className={styles.list__item}
                                    >
                                        {text}
                                    </li>
                                ))}
                                
                            </ul>    
                        
                    </div>
                </div>
            )}
        </>
    )
}
export default NavBar