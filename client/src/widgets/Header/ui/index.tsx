import styles from './Header.module.scss'
import { useWindowWidth } from '@/shared/hooks';
import { MenuIcon } from './MenuIcon';
import { Search } from '@/features/Search';

export const Header = () => {

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

