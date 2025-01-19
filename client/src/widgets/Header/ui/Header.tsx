import { Search } from '@/features';
import styles from './Header.module.scss'
import { useWindowWidth } from '@/shared';
import { MenuIcon } from './MenuIcon/MenuIcon';

const Header = () => {

  const windowWidth = useWindowWidth()

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {windowWidth && windowWidth < 768 && (
          <MenuIcon/>
        )}
        <div className={styles.search_container}>
          <Search placeholder="Найти"/>
        </div>
      </div>
    </div>
  );
}

export default Header;
