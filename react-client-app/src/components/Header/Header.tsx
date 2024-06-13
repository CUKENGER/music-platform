import { memo } from "react";
import styles from './Header.module.scss'
import burgerBtn from '@/assets/burgerBtn.svg'

const Header = () => {
  return (
    <div className={styles.container}>
      <button>
        <img src={burgerBtn} alt="burger btn icon"/>
      </button>
      <p className={styles.title}>Главная</p>
    </div>
  );
};

export default memo(Header);