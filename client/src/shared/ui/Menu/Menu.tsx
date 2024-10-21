import { useState, useRef, useEffect, FC } from 'react';
import styles from './Menu.module.scss'
import dots from './dots_gray.svg'
import dots_active from './dots_active.svg'
import { MenuItem } from '@/shared/types/MenuItem';

interface MenuProps {
  items: MenuItem[];
}

export const Menu: FC<MenuProps> = ({ items }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [isHover, setIsHover] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (onClick: (e?: React.MouseEvent) => void) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation()
      onClick(e);
      setIsOpen(false);
    };
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
      <img 
        src={isHover ? dots_active : dots}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={toggleMenu} 
        className={styles.menu_btn} 
      />
      {isOpen && (
        <ul className={styles.menu_list}>
          {items.map((item, index) => (
            <li 
              key={index} 
              className={styles.menu_item} 
              onClick={handleMenuItemClick(item.onClick)}
            >
              {item.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}