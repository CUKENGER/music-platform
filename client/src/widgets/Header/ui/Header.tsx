import { Search } from '@/features';
import styles from './Header.module.scss'

const Header = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.search_container}>
          <Search placeholder="Найти"/>
        </div>
      </div>
    </div>
  );
}

export default Header;
