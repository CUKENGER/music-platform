import { memo } from "react";
import styles from './Navbar.module.scss'
import RouteList from "./components/RouteList";

const Navbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.user_container}>
        <div className={styles.user_info_container}>
          <div className={styles.user_avatar}>
          </div>
          <div className={styles.name_container}>
            <p>Имя Фамилия</p>
          </div>
        </div>
      </div>
      <RouteList/>
    </div>
  );
};

export default memo(Navbar);