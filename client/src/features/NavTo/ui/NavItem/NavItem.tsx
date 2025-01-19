import { FC, memo } from "react";
import styles from './NavItem.module.scss'
import { useNavigate } from "react-router-dom";
import { useNavBarStore } from "@/shared/model/NavBarStore";

interface RouteItemProps{
  icon: string;
  title: string;
  path:string
}

const RouteItem:FC<RouteItemProps> = ({icon, title, path}) => {

  const {setIsMenuOpen} = useNavBarStore()

  const navigate = useNavigate()

  const pathName = window.location.pathname

  const handleClick = () => {
    if (path !==pathName) {
      navigate(path)
      setIsMenuOpen(false)
    }
  }

  return (
    <div className={`${styles.route_item} ${path == pathName && styles.active}`} onClick={handleClick}>
      <div className={styles.icon_container}>
        <img src={icon} alt="home" />
      </div>
      <p className={styles.route_text}>{title}</p>
    </div>
  );
};

export default memo(RouteItem);