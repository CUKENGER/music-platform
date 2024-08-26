import { FC, memo, useCallback } from "react";
import styles from './NavItems.module.scss';

interface NavItemsProps {
  selectedNav: 'text' | 'next' | 'related';
  onNavChange: (nav: 'text' | 'next' | 'related') => void;
}

const NavItems: FC<NavItemsProps> = ({ selectedNav, onNavChange }) => {
  
  const handleClick = useCallback((nav: 'text' | 'next' | 'related') => {
    onNavChange(nav);
  }, [onNavChange]);

  return (
    <div className={styles.nav_bar}>
      <p
        onClick={() => handleClick('next')}
        className={`${styles.nav_item} ${selectedNav === 'next' ? styles.nav_item_active : ''}`}
      >
        Далее
      </p>
      <p
        onClick={() => handleClick('text')}
        className={`${styles.nav_item} ${selectedNav === 'text' ? styles.nav_item_active : ''}`}
      >
        Текст
      </p>
      <p
        onClick={() => handleClick('related')}
        className={`${styles.nav_item} ${selectedNav === 'related' ? styles.nav_item_active : ''}`}
      >
        Похожие
      </p>
    </div>
  );
};

export default memo(NavItems);
