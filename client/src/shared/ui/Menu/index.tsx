import { useState, useRef, useEffect } from 'react';
import styles from './Menu.module.scss';
import { MenuItem } from '@/shared/types';
import { MenuIcon } from './MenuIcon';
import cn from 'classnames';

interface MenuProps {
  items: MenuItem[];
}

export const Menu = ({ items }: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (onClick: (e?: React.MouseEvent) => void) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
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
    <div
      className={styles.menu}
      ref={menuRef}
    >
      <div
        onClick={toggleMenu}
        className={cn(styles.menu_btn, isOpen && styles.menu_btn_active)}
      >
        <MenuIcon className={styles.menu_icon} />
      </div>
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
  );
};
