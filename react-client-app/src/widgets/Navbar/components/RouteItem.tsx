import { FC, memo } from "react";
import styles from '../Navbar.module.scss'
import { useNavigate } from "react-router-dom";

interface RouteItemProps{
  icon: string;
  title: string;
  path:string
}

const RouteItem:FC<RouteItemProps> = ({icon, title, path}) => {

  const navigate = useNavigate()

  const pathName = window.location.pathname

  const handleClick = () => {
    if (path !==pathName) {
      navigate(path)
    }
  }

  return (
    <div className={`${styles.route_item} ${path == pathName ? styles.active : ''}`} onClick={handleClick}>
      <div className={styles.image_container}>
        <img className={styles.image} src={icon} alt="home icon" />
      </div>
      <p className={styles.route_text}>{title}</p>
    </div>
  );
};

export default memo(RouteItem);