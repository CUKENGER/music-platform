import styles from './Navbar.module.scss';
import { useEffect } from 'react';
import { useNavBarStore } from '@/shared/model';
import { useWindowWidth } from '@/shared/hooks';
import { UserAvatar } from '@/entities/user';
import { NavTo } from '@/features/NavTo';

export const Navbar = () => {
  const { isMenuOpen, setIsMenuOpen } = useNavBarStore();

  const windowWidth = useWindowWidth()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navbar = document.getElementById('navbar');
      if (navbar && !navbar.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <>
      {isMenuOpen && <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />}
      <div className={`${styles.container} ${(windowWidth && (isMenuOpen || windowWidth > 768)) ? styles.open : ''}`} id='navbar'>
        <UserAvatar />
        <NavTo />
      </div>
    </>
  );
};

