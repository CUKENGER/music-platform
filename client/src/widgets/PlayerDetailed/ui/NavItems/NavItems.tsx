import { FC } from 'react';
import styles from './NavItems.module.scss'

interface NavItemsProps {
  selectedNav: 'text' | 'next' | 'related';
  onNavChange: (nav: 'text' | 'next' | 'related') => void;
}

export const NavItems: FC<NavItemsProps> = ({onNavChange, selectedNav}) => {

  return (
    <div className={styles.nav_bar}>
      <p
        onClick={() => onNavChange('next')}
        className={`${styles.nav_item} ${selectedNav === 'next' && styles.nav_item_active}`}
      >
        Далее
      </p>
      <p
        onClick={() => onNavChange('text')}
        className={`${styles.nav_item} ${selectedNav === 'text' && styles.nav_item_active}`}
      >
        Текст
      </p>
      <p
        onClick={() => onNavChange('related')}
        className={`${styles.nav_item} ${selectedNav === 'related' && styles.nav_item_active}`}
      >
        Похожие
      </p>
    </div>
  )
}