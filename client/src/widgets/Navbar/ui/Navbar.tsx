import { NavTo } from '@/features';
import styles from './Navbar.module.scss';
import { UserAvatar } from '@/entities';
import { useNavBarStore, useWindowWidth } from '@/shared';
import { useEffect } from 'react';

const Navbar = () => {
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

export default Navbar;
