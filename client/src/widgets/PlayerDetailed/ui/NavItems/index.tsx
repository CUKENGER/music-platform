import { memo } from 'react';
import styles from './NavItems.module.scss';
import classNames from 'classnames';

interface NavItemsProps {
  selectedNav: 'text' | 'next' | 'related';
  onNavChange: (nav: 'text' | 'next' | 'related') => void;
}

export const NavItems = memo(({ onNavChange, selectedNav }: NavItemsProps) => {
  return (
    <div className={styles.nav_bar}>
      <p
        onClick={() => onNavChange('next')}
        className={classNames(styles.nav_item, {
          [styles.nav_item_active]: selectedNav === 'next',
        })}
      >
        Далее
      </p>
      <p
        onClick={() => onNavChange('text')}
        className={classNames(styles.nav_item, {
          [styles.nav_item_active]: selectedNav === 'text',
        })}
      >
        Текст
      </p>
      <p
        onClick={() => onNavChange('related')}
        className={classNames(styles.nav_item, {
          [styles.nav_item_active]: selectedNav === 'related',
        })}
      >
        Похожие
      </p>
    </div>
  );
});

NavItems.displayName = 'NavItems';
