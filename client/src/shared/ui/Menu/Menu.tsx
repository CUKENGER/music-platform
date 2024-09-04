import { useState, useRef, useEffect, FC } from 'react';
import styles from './Menu.module.scss'
import dots from '../assets/dots.svg'
import { MenuItem } from '@/shared/types/MenuItem';

interface MenuProps {
  items: MenuItem[];
}

export const Menu: FC<MenuProps> = ({ items }) => {

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current) {
      const current = menuRef.current as HTMLElement | null;
      if (current && !current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.menu} ref={menuRef}>
      <img src={dots} onClick={toggleMenu} className={styles.menu_btn} />
      {isOpen && (
        <ul className={styles.menu_list}>
          {items.map((item, index) => (
            <li key={index} className={styles.menu_item} onClick={item.onClick}>
              {item.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}